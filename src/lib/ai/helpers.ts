export class AIHelpers {
  public static dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If plain base64 without prefix
      return {
        buffer: Buffer.from(dataUrl, 'base64'),
        mimeType: 'image/png',
      };
    }

    return {
      buffer: Buffer.from(matches[2], 'base64'),
      mimeType: matches[1],
    };
  }

  public static bufferToDataUrl(buffer: Buffer, mimeType = 'image/png'): string {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }

  public static bufferToBlob(buffer: Buffer, mimeType = 'image/png'): Blob {
    return new Blob([new Uint8Array(buffer)], { type: mimeType });
  }

  public static validateImageInput(imageSrc?: string): { valid: boolean; error?: string } {
    if (!imageSrc || typeof imageSrc !== 'string') {
      return { valid: false, error: 'No image source provided' };
    }

    if (imageSrc.startsWith('data:')) {
      const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      const mime = imageSrc.split(';')[0].replace('data:', '');
      if (!allowedMimes.includes(mime)) {
        return { valid: false, error: `Unsupported image format: ${mime}. Please use PNG, JPG, or WebP.` };
      }

      // Check approximate size (max 15MB)
      const approxBytes = (imageSrc.length * 3) / 4;
      if (approxBytes > 15 * 1024 * 1024) {
        return { valid: false, error: 'Image exceeds maximum allowed size of 15MB' };
      }
    }

    return { valid: true };
  }
}
