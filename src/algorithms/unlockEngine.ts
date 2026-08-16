import {
  EditorLayer,
  ImageLayer,
  TextLayer,
  ShapeLayer,
  DEFAULT_LAYER_EFFECTS,
  DEFAULT_IMAGE_ADJUSTMENTS,
} from '../engine/LayerModel';
import {
  loadImage,
  detectBackgroundColor,
  removeBackgroundByColor,
  cropImage,
  Rgba,
} from '../engine/ImageTools';

export interface DetectedRegion {
  id: string;
  type: 'text' | 'image' | 'shape' | 'background';
  role: 'headline' | 'subtitle' | 'price' | 'cta' | 'subject' | 'background' | 'shape';
  label: string;
  confidence: number; // 0 to 100
  bounds: { x: number; y: number; width: number; height: number };
  previewUrl?: string;
  text?: string;
  accepted?: boolean;
}

export interface DecomposedDesign {
  originalImageSrc: string;
  width: number;
  height: number;
  detectedRegions: DetectedRegion[];
  reconstructedLayers: EditorLayer[];
  backgroundIsFlat: boolean;
  backgroundColor: string | null;
  ocrUsed: boolean;
  note: string;
}

type CellClass = 'bg' | 'text' | 'image' | 'flat';

interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
  cls: CellClass;
  meanColor: Rgba;
  edgeRatio: number;
  colorStd: number;
  region: number;
}

interface FeatureGrid {
  cells: Cell[];
  cellPx: number;
  canvasW: number;
  canvasH: number;
}

interface RegionGroup {
  id: number;
  cls: CellClass;
  cells: Cell[];
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  cellPx: number;
  canvasW: number;
  canvasH: number;
}

const MIN_REGION_SIZE = 0.012; // fraction of total pixels
const MAX_REGIONS = 10;

export class UnlockEngine {
  /**
   * Real client-side semantic decomposition of a flat image into editable layers.
   *
   * Pipeline (all operating on the user's actual pixels):
   *   1. Detect the dominant flat background color (border sampling).
   *   2. Build a feature grid (edges / color variance) and classify cells.
   *   3. Grow connected regions and merge small fragments.
   *   4. Fire real OCR against the full image; match lines to text regions.
   *   5. Reconstruct real layers: background, sliced image/shape crops, OCR text.
   *   6. When the background is flat, physically remove it from each cutout.
   */
  public static async decomposeImage(
    imageSrc: string,
    onProgress?: (percent: number, status: string) => void
  ): Promise<DecomposedDesign> {
    const img = await loadImage(imageSrc);
    const width = img.naturalWidth || 1080;
    const height = img.naturalHeight || 1080;

    if (onProgress) onProgress(12, 'Loading image pixels...');
    await new Promise((r) => setTimeout(r, 30));

    // 1. Background detection
    const bg = detectBackgroundColor(img);
    if (onProgress) onProgress(30, 'Analyzing background and color structure...');
    await new Promise((r) => setTimeout(r, 60));

    // 2 & 3. Segmentation
    const grid = this.buildFeatureGrid(img);
    const groups = this.growRegions(grid);
    if (onProgress) onProgress(55, 'Detecting text, subjects, and shapes...');
    await new Promise((r) => setTimeout(r, 60));

    // 4. Real OCR (best effort, single call on the full image)
    let ocrLines: Array<{ text: string; x: number; y: number; width: number; height: number }> = [];
    let ocrUsed = false;
    if (groups.some((g) => g.cls === 'text')) {
      if (onProgress) onProgress(70, 'Extracting editable text with OCR...');
      try {
        const res = await fetch('/api/ai/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageSrc }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.success && Array.isArray(data.textLayers) && data.textLayers.length > 0) {
          ocrLines = data.textLayers.map((t: any) => ({
            text: String(t.text || '').trim(),
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
          })).filter((t: { text: string }) => t.text.length > 0);
          ocrUsed = ocrLines.length > 0;
        }
      } catch {
        ocrUsed = false;
      }
    }

    if (onProgress) onProgress(85, 'Reconstructing editable layers...');
    await new Promise((r) => setTimeout(r, 60));

    // 5. Build detected regions + real layers
    const regions: DetectedRegion[] = [];
    const layers: EditorLayer[] = [];
    let idx = 0;

    // Background layer
    if (bg) {
      layers.push({
        id: 'unlocked_bg',
        name: 'Background (Recovered)',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width,
        height,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: true,
        fill: this.rgbaToHex(bg),
        stroke: 'transparent',
        strokeWidth: 0,
        cornerRadius: 0,
        semanticRole: 'background',
        reconstructed: { isReconstructed: true, confidence: 99 },
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      } as ShapeLayer);
    } else {
      // Non-flat background: keep the original pixels as the recoverable backdrop
      layers.push({
        id: 'unlocked_bg',
        name: 'Original Image (Backdrop)',
        type: 'image',
        src: imageSrc,
        naturalWidth: width,
        naturalHeight: height,
        x: 0,
        y: 0,
        width,
        height,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: true,
        flipHorizontal: false,
        flipVertical: false,
        cornerRadius: 0,
        semanticRole: 'background',
        reconstructed: { isReconstructed: true, confidence: 92 },
        adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      } as ImageLayer);
    }

    // Sort groups by area descending; skip the dominant background group
    const sortedGroups = groups
      .filter((g) => g.cls !== 'bg')
      .sort((a, b) => this.groupArea(b) - this.groupArea(a))
      .slice(0, MAX_REGIONS);

    for (const group of sortedGroups) {
      idx++;
      const toX = width / group.canvasW;
      const toY = height / group.canvasH;
      const bounds = {
        x: Math.round(group.minX * group.cellPx * toX),
        y: Math.round(group.minY * group.cellPx * toY),
        width: Math.round((group.maxX - group.minX) * group.cellPx * toX),
        height: Math.round((group.maxY - group.minY) * group.cellPx * toY),
      };
      if (bounds.width < 6 || bounds.height < 6) continue;

      const avgColor = this.groupMeanColor(group);
      const confidence = this.computeConfidence(group);
      const previewUrl = await cropImage(imageSrc, bounds);
      const label = this.labelFor(group);

      // Determine role by position/size heuristics on the real layout
      const role = this.roleFor(group, bounds, width, height);

      // OCR match for text groups
      if (group.cls === 'text') {
        const matched = ocrLines.filter(
          (l) =>
            l.x >= bounds.x - bounds.width * 0.5 &&
            l.y >= bounds.y - bounds.height * 0.5 &&
            l.x + l.width <= bounds.x + bounds.width * 1.5 &&
            l.y + l.height <= bounds.y + bounds.height * 1.5
        );

        if (matched.length > 0) {
          matched.forEach((line, li) => {
            const tLayer: TextLayer = {
              id: 'unlocked_text_' + Math.random().toString(36).substr(2, 9),
              name: matched.length > 1 ? `Text Line ${li + 1}` : label,
              type: 'text',
              text: line.text,
              fontFamily: 'Outfit, sans-serif',
              fontSize: Math.max(12, Math.round(line.height * 0.9)),
              fontWeight: role === 'headline' ? 800 : 600,
              fontStyle: 'normal',
              textDecoration: 'none',
              textAlign: 'center',
              fill: this.textColorAgainst(avgColor),
              letterSpacing: 0,
              lineHeight: 1.15,
              x: Math.max(0, Math.round(line.x)),
              y: Math.max(0, Math.round(line.y)),
              width: Math.max(60, Math.round(line.width)),
              height: Math.max(24, Math.round(line.height)),
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              semanticRole: role,
              reconstructed: {
                isReconstructed: true,
                confidence: Math.min(98, confidence),
                originalBounds: bounds,
              },
              effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
            };
            layers.push(tLayer);
            regions.push({
              id: 'region_' + idx + '_' + li,
              type: 'text',
              role,
              label: matched.length > 1 ? `Text Line ${li + 1} — ${line.text}` : `${label} — ${line.text}`,
              confidence: Math.min(98, confidence),
              bounds,
              previewUrl,
              text: line.text,
              accepted: true,
            });
          });
          continue;
        }
      }

      // Non-text or OCR-missed region → real pixel slice layer
      const isCutout = group.cls === 'image' && bg !== null;
      const finalSrc = isCutout
        ? await cropImage(imageSrc, bounds).then((s) => {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            const i2 = new Image();
            i2.src = s;
            c.width = bounds.width;
            c.height = bounds.height;
            if (ctx) ctx.drawImage(i2, 0, 0);
            return removeBackgroundByColor(c, bg, 30);
          })
        : previewUrl;

      if (group.cls === 'flat') {
        layers.push({
          id: 'unlocked_flat_' + Math.random().toString(36).substr(2, 9),
          name: label,
          type: 'shape',
          shapeType: 'rounded-rect',
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: this.rgbaToHex(avgColor),
          stroke: 'transparent',
          strokeWidth: 0,
          cornerRadius: Math.min(14, Math.round(bounds.height * 0.18)),
          semanticRole: role,
          reconstructed: {
            isReconstructed: true,
            confidence,
            originalBounds: bounds,
          },
          effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
        } as ShapeLayer);
      } else {
        layers.push({
          id: 'unlocked_slice_' + Math.random().toString(36).substr(2, 9),
          name: label,
          type: 'image',
          src: finalSrc,
          naturalWidth: bounds.width,
          naturalHeight: bounds.height,
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          flipHorizontal: false,
          flipVertical: false,
          cornerRadius: 0,
          semanticRole: role,
          reconstructed: {
            isReconstructed: true,
            confidence,
            originalBounds: bounds,
          },
          adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
          effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
        } as ImageLayer);
      }

      regions.push({
        id: 'region_' + idx,
        type: group.cls === 'flat' ? 'shape' : 'image',
        role,
        label,
        confidence,
        bounds,
        previewUrl,
        accepted: true,
      });
    }

    if (onProgress) onProgress(100, 'Reconstruction complete!');

    const note = bg
      ? `Recovered ${layers.length - 1} elements against a flat background.`
      : 'This image has a complex background. Elements were recovered on top of the original; you can crop and re-edit freely.';

    return {
      originalImageSrc: imageSrc,
      width,
      height,
      detectedRegions: regions,
      reconstructedLayers: layers,
      backgroundIsFlat: bg !== null,
      backgroundColor: bg ? this.rgbaToHex(bg) : null,
      ocrUsed,
      note,
    };
  }

  // ---------------------------------------------------------------
  // Segmentation internals
  // ---------------------------------------------------------------

  private static buildFeatureGrid(img: HTMLImageElement): FeatureGrid {
    const ANALYSIS = 160;
    const scale = ANALYSIS / Math.max(img.naturalWidth, img.naturalHeight);
    const w = Math.max(32, Math.round(img.naturalWidth * scale));
    const h = Math.max(32, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { cells: [], cellPx: 1, canvasW: w, canvasH: h };
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    const gray = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    }

    // Sobel gradient magnitude
    const grad = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx =
          gray[i - w - 1] - gray[i - w + 1] +
          2 * gray[i - 1] - 2 * gray[i + 1] +
          gray[i + w - 1] - gray[i + w + 1];
        const gy =
          gray[i - w - 1] - gray[i + w - 1] +
          2 * gray[i - w] - 2 * gray[i + w] +
          gray[i - w + 1] - gray[i + w + 1];
        grad[i] = Math.sqrt(gx * gx + gy * gy);
      }
    }

    // bg reference
    const bg = detectBackgroundColor(img);

    const cellSize = Math.max(3, Math.round(Math.max(w, h) / 40));
    const cells: Cell[] = [];
    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        let sumR = 0, sumG = 0, sumB = 0;
        let edgeCount = 0;
        let acc = 0;
        const edgeThresh = 60;
        const sR: number[] = [], sG: number[] = [], sB: number[] = [];

        for (let y = cy * cellSize; y < Math.min(h, (cy + 1) * cellSize); y++) {
          for (let x = cx * cellSize; x < Math.min(w, (cx + 1) * cellSize); x++) {
            const i = y * w + x;
            const a = data[i * 4 + 3];
            if (a < 20) continue;
            sumR += data[i * 4];
            sumG += data[i * 4 + 1];
            sumB += data[i * 4 + 2];
            sR.push(data[i * 4]);
            sG.push(data[i * 4 + 1]);
            sB.push(data[i * 4 + 2]);
            if (grad[i] > edgeThresh) edgeCount++;
            acc++;
          }
        }

        if (acc === 0) {
          cells.push({ x: cx, y: cy, w: cellSize, h: cellSize, cls: 'bg', meanColor: { r: 0, g: 0, b: 0, a: 0 }, edgeRatio: 0, colorStd: 0, region: -1 });
          continue;
        }

        const meanR = sumR / acc, meanG = sumG / acc, meanB = sumB / acc;
        const std =
          (this.stdDev(sR) + this.stdDev(sG) + this.stdDev(sB)) / 3;
        const edgeRatio = edgeCount / acc;
        const meanColor = { r: meanR, g: meanG, b: meanB, a: 255 };

        let cls: CellClass = 'image';
        if (bg && this.dist(meanColor, bg) < 32) cls = 'bg';
        else if (edgeRatio > 0.16 && std < 60) cls = 'text';
        else if (edgeRatio < 0.03 && std < 28) cls = 'flat';
        else if (edgeRatio > 0.05) cls = 'image';
        else if (std < 45) cls = 'flat';

        cells.push({ x: cx, y: cy, w: cellSize, h: cellSize, cls, meanColor, edgeRatio, colorStd: std, region: -1 });
      }
    }

    return { cells, cellPx: cellSize, canvasW: w, canvasH: h };
  }

  private static growRegions(grid: FeatureGrid): RegionGroup[] {
    const cells = grid.cells;
    const cols = Math.max(...cells.map((c) => c.x)) + 1;
    const rows = Math.max(...cells.map((c) => c.y)) + 1;
    const groups: RegionGroup[] = [];
    let nextId = 0;

    const neighbors = (cx: number, cy: number): number[] => {
      const out: number[] = [];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as Array<[number, number]>) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const ni = ny * cols + nx;
        out.push(ni);
      }
      return out;
    };

    const indexOf = (c: Cell) => c.y * cols + c.x;
    void indexOf;

    cells.forEach((cell) => {
      if (cell.region !== -1) return;
      const id = nextId++;
      cell.region = id;
      const group: RegionGroup = {
        id,
        cls: cell.cls,
        cells: [cell],
        minX: cell.x, minY: cell.y, maxX: cell.x + 1, maxY: cell.y + 1,
        cellPx: grid.cellPx,
        canvasW: grid.canvasW,
        canvasH: grid.canvasH,
      };
      groups.push(group);

      const stack: Cell[] = [cell];
      while (stack.length) {
        const cur = stack.pop()!;
        for (const ni of neighbors(cur.x, cur.y)) {
          const n = cells[ni];
          if (n.region !== -1 || n.cls !== group.cls) continue;
          n.region = id;
          group.cells.push(n);
          group.minX = Math.min(group.minX, n.x);
          group.minY = Math.min(group.minY, n.y);
          group.maxX = Math.max(group.maxX, n.x + 1);
          group.maxY = Math.max(group.maxY, n.y + 1);
          stack.push(n);
        }
      }
    });

    // Merge small groups into their largest same-class neighbor, keep top-level clusters
    const totalCells = cells.length;
    const significant = groups.filter((g) => g.cells.length >= totalCells * MIN_REGION_SIZE);
    const significantIds = new Set(significant.map((g) => g.id));
    const mergedGroups: RegionGroup[] = [];

    const keep: RegionGroup[] = groups
      .filter((g) => significantIds.has(g.id))
      .filter((g) => g.cls !== 'bg');

    // Drop groups that are essentially covered by a larger one (nested overlaps)
    const sorted = keep.sort((a, b) => b.cells.length - a.cells.length);
    for (const g of sorted) {
      const covered = mergedGroups.some((m) =>
        m.cls === g.cls &&
        g.minX >= m.minX && g.maxX <= m.maxX &&
        g.minY >= m.minY && g.maxY <= m.maxY &&
        m.cells.length > g.cells.length * 3
      );
      if (!covered) mergedGroups.push(g);
    }

    return mergedGroups;
  }

  private static groupArea(g: RegionGroup): number {
    return (g.maxX - g.minX) * (g.maxY - g.minY);
  }

  private static groupMeanColor(g: RegionGroup): Rgba {
    const r = g.cells.reduce((s, c) => s + c.meanColor.r, 0) / g.cells.length;
    const gr = g.cells.reduce((s, c) => s + c.meanColor.g, 0) / g.cells.length;
    const b = g.cells.reduce((s, c) => s + c.meanColor.b, 0) / g.cells.length;
    return { r: Math.round(r), g: Math.round(gr), b: Math.round(b), a: 255 };
  }

  private static computeConfidence(g: RegionGroup): number {
    const edgeRatio = g.cells.reduce((s, c) => s + c.edgeRatio, 0) / Math.max(1, g.cells.length);
    let score = 60 + Math.min(25, edgeRatio * 90);
    score += Math.min(12, Math.min(1, g.cells.length / 60) * 12);
    return Math.round(Math.min(98, score));
  }

  private static labelFor(g: RegionGroup): string {
    switch (g.cls) {
      case 'text': return 'Text Region';
      case 'image': return 'Image / Subject';
      case 'flat': return 'Color Element';
      default: return 'Element';
    }
  }

  private static roleFor(
    g: RegionGroup,
    bounds: { x: number; y: number; width: number; height: number },
    width: number,
    height: number
  ): DetectedRegion['role'] {
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    const isWide = bounds.width > width * 0.55;
    const topZone = cy < height * 0.35;
    const bottomZone = cy > height * 0.68;

    if (g.cls === 'text') {
      if (topZone && isWide) return 'headline';
      if (bottomZone && (bounds.height > 20)) return 'cta';
      if (bottomZone) return 'price';
      if (isWide) return 'subtitle';
      return 'headline';
    }
    if (g.cls === 'flat') {
      if (bottomZone && isWide) return 'cta';
      return 'shape';
    }
    return 'subject';
  }

  private static textColorAgainst(bg: Rgba): string {
    const lum = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b;
    return lum > 150 ? '#1A1A1A' : '#FFFFFF';
  }

  private static dist(a: Rgba, b: Rgba): number {
    return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
  }

  private static stdDev(arr: number[]): number {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
    return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length);
  }

  private static rgbaToHex(c: Rgba): string {
    const hx = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${hx(c.r)}${hx(c.g)}${hx(c.b)}`.toUpperCase();
  }

  /**
   * Manual fallback: slices a user-selected bounding box into an independent editable ImageLayer.
   */
  public static sliceRegionToLayer(
    sourceImg: HTMLImageElement | HTMLCanvasElement,
    region: { x: number; y: number; width: number; height: number },
    name = 'Extracted Element'
  ): ImageLayer {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, region.width);
    canvas.height = Math.max(1, region.height);
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        sourceImg,
        region.x,
        region.y,
        region.width,
        region.height,
        0,
        0,
        region.width,
        region.height
      );
    }

    return {
      id: 'layer_' + Math.random().toString(36).substr(2, 9),
      name,
      type: 'image',
      src: canvas.toDataURL('image/png'),
      naturalWidth: region.width,
      naturalHeight: region.height,
      x: region.x,
      y: region.y,
      width: region.width,
      height: region.height,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      flipHorizontal: false,
      flipVertical: false,
      cornerRadius: 0,
      maskShape: 'none',
      semanticRole: 'generic',
      reconstructed: { isReconstructed: true, confidence: 100, originalBounds: region },
      adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
      effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
    };
  }
}