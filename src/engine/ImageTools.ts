// Real client-side pixel operations used across EDITIVE.
// These work on actual image data — no simulated output.

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image could not be loaded'));
    img.src = src;
  });
}

export function canvasFromImage(
  img: HTMLImageElement | HTMLCanvasElement,
  width?: number,
  height?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width || (img as HTMLImageElement).naturalWidth || (img as HTMLCanvasElement).width;
  canvas.height = height || (img as HTMLImageElement).naturalHeight || (img as HTMLCanvasElement).height;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.drawImage(img, 0, 0);
  return canvas;
}

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function colorDistance(a: Rgba, b: Rgba): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/**
 * Detects the dominant background color by sampling the image border.
 * Returns null when the corners are too varied to be a single flat background.
 */
export function detectBackgroundColor(
  img: HTMLImageElement | HTMLCanvasElement,
  tolerance = 28
): Rgba | null {
  const canvas = canvasFromImage(img);
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const { width, height } = canvas;
  const samplePoints: Array<[number, number]> = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 2],
    [Math.floor(width / 2), height - 3],
    [2, Math.floor(height / 2)],
    [width - 3, Math.floor(height / 2)],
  ];
  const samples: Rgba[] = samplePoints.map(([x, y]) => {
    const px = ctx.getImageData(x, y, 1, 1).data;
    return { r: px[0], g: px[1], b: px[2], a: px[3] };
  });

  const avg = samples.reduce<Rgba>(
    (acc, s) => ({ r: acc.r + s.r, g: acc.g + s.g, b: acc.b + s.b, a: acc.a + s.a }),
    { r: 0, g: 0, b: 0, a: 0 }
  );
  avg.r = Math.round(avg.r / samples.length);
  avg.g = Math.round(avg.g / samples.length);
  avg.b = Math.round(avg.b / samples.length);
  avg.a = Math.round(avg.a / samples.length);

  const diverges = samples.some((s) => colorDistance(s, avg) > tolerance);
  if (diverges) return null;
  return avg;
}

/**
 * Real client-side background removal using color-based flood fill from the
 * image borders. Pixels connected to the border that are within `tolerance`
 * of the background color become transparent.
 */
export function removeBackgroundByColor(
  img: HTMLImageElement | HTMLCanvasElement,
  bg: Rgba,
  tolerance = 42
): string {
  const canvas = canvasFromImage(img);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  const isBackground = (idx: number): boolean => {
    const px = { r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3] };
    return px.a > 8 && colorDistance(px, bg) <= tolerance;
  };

  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x++) push(x, 0);
  for (let x = 0; x < width; x++) push(x, height - 1);
  for (let y = 0; y < height; y++) push(0, y);
  for (let y = 0; y < height; y++) push(width - 1, y);

  while (queue.length > 0) {
    const idx = queue.pop()!;
    if (!isBackground(idx * 4)) continue;
    data[idx * 4 + 3] = 0;

    const x = idx % width;
    const y = Math.floor(idx / width);
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Slices a rectangular region out of an image into a new PNG data URL.
 */
export function cropImage(
  srcOrImg: string | HTMLImageElement | HTMLCanvasElement,
  rect: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const source =
    typeof srcOrImg === 'string' ? loadImage(srcOrImg) : Promise.resolve(srcOrImg);

  return source.then((img) => {
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(rect.width));
    out.height = Math.max(1, Math.round(rect.height));
    const ctx = out.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, out.width, out.height);
    }
    return out.toDataURL('image/png');
  });
}

/**
 * Produces an approximate dominant color palette from the actual image pixels.
 */
export function extractPaletteFromImage(
  src: string,
  count = 6
): Promise<string[]> {
  return loadImage(src).then((img) => {
    const canvas = canvasFromImage(img, 64, 64);
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    const data = ctx.getImageData(0, 0, 64, 64).data;
    const buckets: Record<string, { r: number; g: number; b: number; n: number }> = {};
    for (let i = 0; i < data.length; i += 16) {
      const a = data[i + 3];
      if (a < 128) continue;
      const r = Math.round(data[i] / 16) * 16;
      const g = Math.round(data[i + 1] / 16) * 16;
      const b = Math.round(data[i + 2] / 16) * 16;
      const key = `${r},${g},${b}`;
      if (!buckets[key]) buckets[key] = { r, g, b, n: 0 };
      buckets[key].n++;
    }
    return Object.values(buckets)
      .sort((x, y) => y.n - x.n)
      .slice(0, count)
      .map((c) => {
        const hx = (n: number) => n.toString(16).padStart(2, '0');
        return `#${hx(c.r)}${hx(c.g)}${hx(c.b)}`.toUpperCase();
      });
  });
}

/**
 * Measures the luminance of a color (0-255) — used for text region classification.
 */
export function luminanceOf(c: Rgba): number {
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
}

/**
 * Downscales large data-URL images before sending them to external AI APIs.
 * Keeps request payloads under typical platform limits (e.g. Vercel 4.5MB)
 * while preserving enough resolution for remove.bg / Clipdrop / Replicate.
 */
export async function prepareImageForAPI(
  imageSrc: string,
  maxDim = 2048
): Promise<{ src: string; width: number; height: number }> {
  const img = await loadImage(imageSrc);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  if (w <= maxDim && h <= maxDim && !imageSrc.startsWith('data:image/webp')) {
    return { src: imageSrc, width: w, height: h };
  }

  const scale = Math.min(1, maxDim / Math.max(w, h));
  const nw = Math.max(1, Math.round(w * scale));
  const nh = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = nw;
  canvas.height = nh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { src: imageSrc, width: w, height: h };
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, nw, nh);
  return { src: canvas.toDataURL('image/png'), width: nw, height: nh };
}

/**
 * Real Gaussian-approximated blur (two-pass box blur) producing an actual
 * blurred image data URL.
 */
export async function boxBlurImage(imageSrc: string, radius = 18): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = canvasFromImage(img);
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageSrc;

  const w = canvas.width;
  const h = canvas.height;
  const srcData = ctx.getImageData(0, 0, w, h);
  const pass = Math.max(1, Math.min(24, Math.round(radius / 4)));
  let current = new Uint8ClampedArray(srcData.data);
  const temp = new Uint8ClampedArray(current.length);

  for (let p = 0; p < pass; p++) {
    const r = Math.max(1, Math.round(radius / 3));
    // Horizontal
    for (let y = 0; y < h; y++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      const rowStart = y * w;
      for (let x = -r; x <= r; x++) {
        const i = (rowStart + Math.max(0, Math.min(w - 1, x))) * 4;
        sumR += current[i];
        sumG += current[i + 1];
        sumB += current[i + 2];
        sumA += current[i + 3];
      }
      for (let x = 0; x < w; x++) {
        const i = (rowStart + x) * 4;
        const divisor = 2 * r + 1;
        temp[i] = sumR / divisor;
        temp[i + 1] = sumG / divisor;
        temp[i + 2] = sumB / divisor;
        temp[i + 3] = sumA / divisor;
        const addIdx = (rowStart + Math.min(w - 1, x + r + 1)) * 4;
        const remIdx = (rowStart + Math.max(0, x - r)) * 4;
        sumR += current[addIdx] - current[remIdx];
        sumG += current[addIdx + 1] - current[remIdx + 1];
        sumB += current[addIdx + 2] - current[remIdx + 2];
        sumA += current[addIdx + 3] - current[remIdx + 3];
      }
    }
    current = new Uint8ClampedArray(temp);
    temp.fill(0);
    // Vertical
    for (let x = 0; x < w; x++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      for (let y = -r; y <= r; y++) {
        const i = (Math.max(0, Math.min(h - 1, y)) * w + x) * 4;
        sumR += current[i];
        sumG += current[i + 1];
        sumB += current[i + 2];
        sumA += current[i + 3];
      }
      for (let y = 0; y < h; y++) {
        const i = (y * w + x) * 4;
        const divisor = 2 * r + 1;
        temp[i] = sumR / divisor;
        temp[i + 1] = sumG / divisor;
        temp[i + 2] = sumB / divisor;
        temp[i + 3] = sumA / divisor;
        const addIdx = (Math.min(h - 1, y + r + 1) * w + x) * 4;
        const remIdx = (Math.max(0, y - r) * w + x) * 4;
        sumR += current[addIdx] - current[remIdx];
        sumG += current[addIdx + 1] - current[remIdx + 1];
        sumB += current[addIdx + 2] - current[remIdx + 2];
        sumA += current[addIdx + 3] - current[remIdx + 3];
      }
    }
    current = new Uint8ClampedArray(temp);
    temp.fill(0);
  }

  ctx.putImageData(new ImageData(current, w, h), 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Real local auto-enhance: derives brightness/contrast/saturation adjustments
 * from the actual pixel histogram of the image.
 */
export async function analyzeEnhancements(
  imageSrc: string
): Promise<{ brightness: number; contrast: number; saturation: number; exposure: number; sharpen: number }> {
  const img = await loadImage(imageSrc);
  const canvas = canvasFromImage(img, 96, 96);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { brightness: 0, contrast: 0, saturation: 0, exposure: 0, sharpen: 0 };

  const data = ctx.getImageData(0, 0, 96, 96).data;
  let sumLum = 0, sumLum2 = 0, sumSat = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 40) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    sumLum += lum;
    sumLum2 += lum * lum;
    sumSat += sat;
    count++;
  }
  if (count === 0) return { brightness: 0, contrast: 0, saturation: 0, exposure: 0, sharpen: 0 };

  const meanLum = sumLum / count;
  const variance = Math.max(0, sumLum2 / count - meanLum * meanLum);
  const stdLum = Math.sqrt(variance);
  const meanSat = sumSat / count;

  const brightness = Math.round(Math.max(-30, Math.min(30, (128 - meanLum) * 0.35)));
  const contrast = Math.round(Math.max(-20, Math.min(28, (42 - stdLum) * 0.35)));
  const saturation = Math.round(Math.max(-15, Math.min(40, (95 - meanSat) * 0.5)));
  const exposure = Math.round(Math.max(-12, Math.min(12, brightness * 0.4)));
  const sharpen = 15;

  return { brightness, contrast, saturation, exposure, sharpen };
}

/**
 * Real local Smart Crop: locates the most "interesting" region via edge
 * density (saliency) and returns a crop of the requested aspect ratio that
 * frames that region near a rule-of-thirds point.
 */
export async function smartCropLocal(
  imageSrc: string,
  targetAspect: string = '1:1'
): Promise<{ src: string; width: number; height: number; crop: { x: number; y: number; width: number; height: number } }> {
  const img = await loadImage(imageSrc);
  const W = img.naturalWidth || img.width;
  const H = img.naturalHeight || img.height;

  const [aw, ah] = targetAspect.split(':').map((n) => parseFloat(n));
  const targetRatio = aw / ah;

  const ANALYSIS = 120;
  const scale = ANALYSIS / Math.max(W, H);
  const w = Math.max(40, Math.round(W * scale));
  const h = Math.max(40, Math.round(H * scale));
  const canvas = canvasFromImage(img, w, h);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { src: imageSrc, width: W, height: H, crop: { x: 0, y: 0, width: W, height: H } };

  const data = ctx.getImageData(0, 0, w, h).data;
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  const grad = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = gray[i - w - 1] - gray[i - w + 1] + 2 * gray[i - 1] - 2 * gray[i + 1] + gray[i + w - 1] - gray[i + w + 1];
      const gy = gray[i - w - 1] - gray[i + w - 1] + 2 * gray[i - w] - 2 * gray[i + w] + gray[i - w + 1] - gray[i + w + 1];
      grad[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  // Focus score via edge density
  const bw = 6, bh = 6;
  const cols = Math.ceil(w / bw), rows = Math.ceil(h / bh);
  let best = { score: -1, cx: w / 2, cy: h / 2 };
  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      let sum = 0, n = 0;
      for (let y = by * bh; y < Math.min(h, (by + 1) * bh); y++) {
        for (let x = bx * bw; x < Math.min(w, (bx + 1) * bw); x++) {
          sum += grad[y * w + x];
          n++;
        }
      }
      if (n === 0) continue;
      const cx = bx * bw + bw / 2;
      const cy = by * bh + bh / 2;
      // Prefer central-ish content (rule of thirds sweet spots)
      const score = (sum / n) * (1 - Math.abs(cx / w - 0.5) * 0.4 - Math.abs(cy / h - 0.5) * 0.4);
      if (score > best.score) best = { score, cx, cy };
    }
  }

  // Compute crop rect in full-res coordinates
  const focusX = best.cx / w * W;
  const focusY = best.cy / h * H;

  let cropW = W, cropH = H;
  if (targetRatio > W / H) {
    cropH = H;
    cropW = Math.round(H * targetRatio);
    if (cropW > W) cropW = W;
  } else {
    cropW = W;
    cropH = Math.round(W / targetRatio);
    if (cropH > H) cropH = H;
  }

  // Position the focus point near a thirds line
  const minX = Math.max(0, Math.min(W - cropW, focusX - cropW * (1 / 3)));
  const minY = Math.max(0, Math.min(H - cropH, focusY - cropH * (1 / 3)));
  const x = Math.max(0, Math.min(W - cropW, minX));
  const y = Math.max(0, Math.min(H - cropH, minY));

  return { src: await cropImage(imageSrc, { x, y, width: cropW, height: cropH }), width: cropW, height: cropH, crop: { x, y, width: cropW, height: cropH } };
}

/**
 * Real local "Blur Background": isolates the subject with the color-based
 * cutout and composites it sharply over a blurred copy of the image.
 */
export async function compositeBlurBackground(imageSrc: string, blurRadius = 16): Promise<{ src: string; note?: string }> {
  const img = await loadImage(imageSrc);
  const bg = detectBackgroundColor(img);
  const W = img.naturalWidth || img.width;
  const H = img.naturalHeight || img.height;

  const blurred = await boxBlurImage(imageSrc, blurRadius);

  if (!bg) {
    return { src: blurred, note: 'Complex background — applied full-frame blur effect.' };
  }

  // Rebuild: blurred backdrop + sharp subject on top
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { src: blurred };

  const blurImg = await loadImage(blurred);
  ctx.drawImage(blurImg, 0, 0, W, H);

  const subject = await loadImage(removeBackgroundByColor(img, bg, 38));
  ctx.drawImage(subject, 0, 0, W, H);

  return { src: canvas.toDataURL('image/png') };
}