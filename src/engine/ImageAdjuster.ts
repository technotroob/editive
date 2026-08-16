import { ImageAdjustments } from './LayerModel';

export class ImageAdjuster {
  /**
   * Generates a CSS filter string for high-performance real-time DOM/Canvas rendering
   */
  public static toCSSFilter(adj: ImageAdjustments): string {
    const filters: string[] = [];

    if (adj.brightness !== 0) {
      filters.push(`brightness(${1 + adj.brightness / 100})`);
    }
    if (adj.contrast !== 0) {
      filters.push(`contrast(${1 + adj.contrast / 100})`);
    }
    if (adj.saturation !== 0) {
      filters.push(`saturate(${1 + adj.saturation / 100})`);
    }
    if (adj.hue !== 0) {
      filters.push(`hue-rotate(${adj.hue}deg)`);
    }
    if (adj.blur > 0) {
      filters.push(`blur(${adj.blur}px)`);
    }
    if (adj.grayscale > 0) {
      filters.push(`grayscale(${adj.grayscale}%)`);
    }
    if (adj.sepia > 0) {
      filters.push(`sepia(${adj.sepia}%)`);
    }
    if (adj.invert > 0) {
      filters.push(`invert(${adj.invert}%)`);
    }

    return filters.length > 0 ? filters.join(' ') : 'none';
  }

  /**
   * Applies pixel-level adjustments for high-resolution export or offline rasterization
   */
  public static applyPixelAdjustments(imageData: ImageData, adj: ImageAdjustments): ImageData {
    const data = imageData.data;
    const len = data.length;

    const brightnessMul = 1 + adj.brightness / 100;
    const contrastFactor = (259 * (adj.contrast + 255)) / (255 * (259 - adj.contrast));
    const satFactor = 1 + adj.saturation / 100;
    const tempK = adj.temperature / 100; // -1 to 1 (cool to warm)
    const tintK = adj.tint / 100;       // -1 to 1 (green to magenta)

    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Brightness & Exposure
      r = r * brightnessMul;
      g = g * brightnessMul;
      b = b * brightnessMul;

      // Contrast
      if (adj.contrast !== 0) {
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;
      }

      // Saturation
      if (adj.saturation !== 0) {
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * satFactor;
        g = gray + (g - gray) * satFactor;
        b = gray + (b - gray) * satFactor;
      }

      // Temperature (warm = +red -blue, cool = +blue -red)
      if (tempK !== 0) {
        r += tempK * 30;
        b -= tempK * 30;
      }

      // Tint (magenta = +red +blue -green, green = +green)
      if (tintK !== 0) {
        r += tintK * 15;
        g -= tintK * 25;
        b += tintK * 15;
      }

      // Grayscale
      if (adj.grayscale > 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const gRatio = adj.grayscale / 100;
        r = r * (1 - gRatio) + gray * gRatio;
        g = g * (1 - gRatio) + gray * gRatio;
        b = b * (1 - gRatio) + gray * gRatio;
      }

      // Sepia
      if (adj.sepia > 0) {
        const sRatio = adj.sepia / 100;
        const sr = (r * 0.393) + (g * 0.769) + (b * 0.189);
        const sg = (r * 0.349) + (g * 0.686) + (b * 0.168);
        const sb = (r * 0.272) + (g * 0.534) + (b * 0.131);
        r = r * (1 - sRatio) + sr * sRatio;
        g = g * (1 - sRatio) + sg * sRatio;
        b = b * (1 - sRatio) + sb * sRatio;
      }

      // Invert
      if (adj.invert > 0) {
        const invRatio = adj.invert / 100;
        r = r * (1 - invRatio) + (255 - r) * invRatio;
        g = g * (1 - invRatio) + (255 - g) * invRatio;
        b = b * (1 - invRatio) + (255 - b) * invRatio;
      }

      data[i] = Math.min(255, Math.max(0, Math.round(r)));
      data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
      data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }

    return imageData;
  }
}
