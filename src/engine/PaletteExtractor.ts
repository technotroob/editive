export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  population: number;
  type: 'dominant' | 'accent' | 'background' | 'muted';
}

export class PaletteExtractor {
  /**
   * Extracts a structured palette (Dominant, Accent, Background colors) from an HTMLImageElement or ImageData
   */
  public static extractFromImage(image: HTMLImageElement | HTMLCanvasElement, colorCount = 6): ExtractedColor[] {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    // Scale down image for fast color quantization
    const sampleSize = 100;
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    ctx.drawImage(image, 0, 0, sampleSize, sampleSize);

    const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
    const colorBuckets: { [key: string]: { r: number; g: number; b: number; count: number } } = {};

    for (let i = 0; i < imgData.length; i += 16) { // Sample every 4th pixel
      const a = imgData[i + 3];
      if (a < 128) continue; // Ignore transparent pixels

      // Quantize to 5-bit color (groups of 8)
      const r = Math.round(imgData[i] / 16) * 16;
      const g = Math.round(imgData[i + 1] / 16) * 16;
      const b = Math.round(imgData[i + 2] / 16) * 16;

      const key = `${r},${g},${b}`;
      if (!colorBuckets[key]) {
        colorBuckets[key] = { r, g, b, count: 0 };
      }
      colorBuckets[key].count++;
    }

    const sortedColors = Object.values(colorBuckets)
      .sort((a, b) => b.count - a.count)
      .slice(0, colorCount);

    return sortedColors.map((c, index) => {
      const hex = this.rgbToHex(c.r, c.g, c.b);
      let type: ExtractedColor['type'] = 'dominant';

      if (index === 0) type = 'background';
      else if (index === 1) type = 'dominant';
      else if (index === 2) type = 'accent';
      else type = 'muted';

      return {
        hex,
        rgb: [c.r, c.g, c.b],
        population: c.count,
        type,
      };
    });
  }

  public static rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
      const clamped = Math.min(255, Math.max(0, n));
      return clamped.toString(16).padStart(2, '0');
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }
}
