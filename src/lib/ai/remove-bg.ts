import { AIHelpers } from './helpers';
import { AIResponse } from './types';

export class RemoveBgService {
  public static async removeBackground(imageSrc: string): Promise<AIResponse> {
    const validation = AIHelpers.validateImageInput(imageSrc);
    if (!validation.valid) {
      return {
        success: false,
        operation: 'remove-background',
        error: { code: 'INVALID_INPUT', message: validation.error || 'Invalid image' },
      };
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        operation: 'remove-background',
        error: {
          code: 'NO_API_KEY',
          message: 'REMOVE_BG_API_KEY is not configured in .env.local. Add it to enable real background removal.',
        },
      };
    }

    try {
      const { buffer, mimeType } = AIHelpers.dataUrlToBuffer(imageSrc);
      const formData = new FormData();
      const blob = AIHelpers.bufferToBlob(buffer, mimeType);
      formData.append('image_file', blob, 'image.png');
      formData.append('size', 'auto');
      formData.append('format', 'png');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('remove.bg API Error status:', res.status, errText);
        return {
          success: false,
          operation: 'remove-background',
          error: {
            code: 'PROVIDER_ERROR',
            message: 'Background removal provider reported an error. Please try again.',
          },
        };
      }

      const resArrayBuffer = await res.arrayBuffer();
      const outBuffer = Buffer.from(resArrayBuffer);
      const outputUrl = AIHelpers.bufferToDataUrl(outBuffer, 'image/png');

      return {
        success: true,
        operation: 'remove-background',
        outputUrl,
        mimeType: 'image/png',
        metadata: { provider: 'remove.bg' },
      };
    } catch (err: any) {
      console.error('remove.bg request failed:', err.message);
      return {
        success: false,
        operation: 'remove-background',
        error: {
          code: 'NETWORK_TIMEOUT',
          message: 'Unable to reach the background removal service. Please check your connection.',
        },
      };
    }
  }
}
