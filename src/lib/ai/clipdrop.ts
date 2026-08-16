import { AIHelpers } from './helpers';
import { AIResponse } from './types';

export class ClipdropService {
  private static getApiKey(): string | undefined {
    return process.env.CLIPDROP_API_KEY;
  }

  public static async cleanupObject(imageSrc: string, maskSrc?: string): Promise<AIResponse> {
    const validation = AIHelpers.validateImageInput(imageSrc);
    if (!validation.valid) {
      return {
        success: false,
        operation: 'remove-object',
        error: { code: 'INVALID_INPUT', message: validation.error || 'Invalid image' },
      };
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        success: false,
        operation: 'remove-object',
        error: {
          code: 'NO_API_KEY',
          message: 'CLIPDROP_API_KEY is not configured in .env.local. Add it to enable object cleanup.',
        },
      };
    }

    try {
      const { buffer: imgBuffer, mimeType: imgMime } = AIHelpers.dataUrlToBuffer(imageSrc);
      const formData = new FormData();
      formData.append('image_file', AIHelpers.bufferToBlob(imgBuffer, imgMime), 'image.png');

      if (maskSrc) {
        const { buffer: maskBuffer, mimeType: maskMime } = AIHelpers.dataUrlToBuffer(maskSrc);
        formData.append('mask_file', AIHelpers.bufferToBlob(maskBuffer, maskMime), 'mask.png');
      } else {
        formData.append('mask_file', AIHelpers.bufferToBlob(imgBuffer, imgMime), 'mask.png');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch('https://clipdrop-api.co/cleanup/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('Clipdrop cleanup error:', res.status, errText);
        return {
          success: false,
          operation: 'remove-object',
          error: { code: 'PROVIDER_ERROR', message: 'Object cleanup failed. Please try again.' },
        };
      }

      const resBuffer = Buffer.from(await res.arrayBuffer());
      return {
        success: true,
        operation: 'remove-object',
        outputUrl: AIHelpers.bufferToDataUrl(resBuffer, 'image/png'),
        mimeType: 'image/png',
        metadata: { provider: 'clipdrop' },
      };
    } catch (err: any) {
      console.error('Clipdrop cleanup request failed:', err.message);
      return {
        success: false,
        operation: 'remove-object',
        error: { code: 'NETWORK_TIMEOUT', message: 'Unable to reach object removal service.' },
      };
    }
  }

  public static async upscale2x(imageSrc: string, targetWidth?: number, targetHeight?: number): Promise<AIResponse> {
    const validation = AIHelpers.validateImageInput(imageSrc);
    if (!validation.valid) {
      return {
        success: false,
        operation: 'upscale',
        error: { code: 'INVALID_INPUT', message: validation.error || 'Invalid image' },
      };
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        success: false,
        operation: 'upscale',
        error: {
          code: 'NO_API_KEY',
          message: 'CLIPDROP_API_KEY is not configured in .env.local. Add it to enable AI upscaling.',
        },
      };
    }

    try {
      const { buffer, mimeType } = AIHelpers.dataUrlToBuffer(imageSrc);
      const formData = new FormData();
      formData.append('image_file', AIHelpers.bufferToBlob(buffer, mimeType), 'image.png');
      if (targetWidth) formData.append('target_width', String(Math.min(4096, targetWidth * 2)));
      if (targetHeight) formData.append('target_height', String(Math.min(4096, targetHeight * 2)));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch('https://clipdrop-api.co/image-upscaling/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('Clipdrop upscale error:', res.status, errText);
        return {
          success: false,
          operation: 'upscale',
          error: { code: 'PROVIDER_ERROR', message: 'Image upscale failed. Please try again.' },
        };
      }

      const resBuffer = Buffer.from(await res.arrayBuffer());
      return {
        success: true,
        operation: 'upscale',
        outputUrl: AIHelpers.bufferToDataUrl(resBuffer, 'image/png'),
        mimeType: 'image/png',
        metadata: { provider: 'clipdrop' },
      };
    } catch (err: any) {
      console.error('Clipdrop upscale request failed:', err.message);
      return {
        success: false,
        operation: 'upscale',
        error: { code: 'NETWORK_TIMEOUT', message: 'Unable to reach image upscale service.' },
      };
    }
  }

  public static async uncropExpand(
    imageSrc: string,
    extendLeft = 100,
    extendRight = 100,
    extendUp = 100,
    extendDown = 100
  ): Promise<AIResponse> {
    const validation = AIHelpers.validateImageInput(imageSrc);
    if (!validation.valid) {
      return {
        success: false,
        operation: 'expand',
        error: { code: 'INVALID_INPUT', message: validation.error || 'Invalid image' },
      };
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        success: false,
        operation: 'expand',
        error: {
          code: 'NO_API_KEY',
          message: 'CLIPDROP_API_KEY is not configured in .env.local. Add it to enable AI expand.',
        },
      };
    }

    try {
      const { buffer, mimeType } = AIHelpers.dataUrlToBuffer(imageSrc);
      const formData = new FormData();
      formData.append('image_file', AIHelpers.bufferToBlob(buffer, mimeType), 'image.png');
      formData.append('extend_left', String(extendLeft));
      formData.append('extend_right', String(extendRight));
      formData.append('extend_up', String(extendUp));
      formData.append('extend_down', String(extendDown));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const res = await fetch('https://clipdrop-api.co/uncrop/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('Clipdrop uncrop error:', res.status, errText);
        return {
          success: false,
          operation: 'expand',
          error: { code: 'PROVIDER_ERROR', message: 'AI expand failed. Please try again.' },
        };
      }

      const resBuffer = Buffer.from(await res.arrayBuffer());
      return {
        success: true,
        operation: 'expand',
        outputUrl: AIHelpers.bufferToDataUrl(resBuffer, 'image/png'),
        mimeType: 'image/png',
        metadata: { provider: 'clipdrop' },
      };
    } catch (err: any) {
      console.error('Clipdrop uncrop request failed:', err.message);
      return {
        success: false,
        operation: 'expand',
        error: { code: 'NETWORK_TIMEOUT', message: 'Unable to reach AI expansion service.' },
      };
    }
  }
}
