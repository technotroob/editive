import { AIHelpers } from './helpers';
import { AIResponse } from './types';

export class OCRSpaceService {
  public static async extractText(imageSrc: string): Promise<AIResponse> {
    const validation = AIHelpers.validateImageInput(imageSrc);
    if (!validation.valid) {
      return {
        success: false,
        operation: 'ocr',
        error: { code: 'INVALID_INPUT', message: validation.error || 'Invalid image' },
      };
    }

    const apiKey = process.env.OCR_SPACE_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        operation: 'ocr',
        error: {
          code: 'NO_API_KEY',
          message: 'OCR_SPACE_API_KEY is not configured in .env.local. Add it to enable real text extraction.',
        },
      };
    }

    try {
      const formData = new FormData();
      formData.append('base64Image', imageSrc);
      formData.append('isOverlayRequired', 'true');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          success: false,
          operation: 'ocr',
          error: { code: 'PROVIDER_ERROR', message: 'OCR Service encountered an error.' },
        };
      }

      const data = await res.json();
      if (data.IsErroredOnProcessing || !data.ParsedResults || data.ParsedResults.length === 0) {
        const msg = data.ErrorMessage ? data.ErrorMessage[0] : 'No readable text detected in image';
        return {
          success: false,
          operation: 'ocr',
          error: { code: 'NO_TEXT_FOUND', message: msg },
        };
      }

      const parsedResult = data.ParsedResults[0];
      const textOverlay = parsedResult.TextOverlay;
      const textLayers: Array<{
        text: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fontSize: number;
        fontWeight: number;
        fill: string;
      }> = [];

      if (textOverlay && textOverlay.Lines && textOverlay.Lines.length > 0) {
        textOverlay.Lines.forEach((line: any, idx: number) => {
          const lineText = line.LineText?.trim();
          if (!lineText) return;

          const top = line.MinTop || 100 + idx * 50;
          const left = line.MinLeft || 100;
          const height = line.MaxHeight || 36;
          const width = line.Words?.reduce((acc: number, w: any) => acc + (w.Width || 40), 0) || 300;

          textLayers.push({
            text: lineText,
            x: Math.round(left),
            y: Math.round(top),
            width: Math.max(120, Math.round(width)),
            height: Math.max(30, Math.round(height)),
            fontSize: Math.max(16, Math.min(64, Math.round(height * 0.85))),
            fontWeight: 700,
            fill: '#FFFFFF',
          });
        });
      } else if (parsedResult.ParsedText) {
        // Fallback to line-by-line raw text
        const rawLines = parsedResult.ParsedText.split('\n').filter((l: string) => l.trim().length > 0);
        rawLines.forEach((line: string, idx: number) => {
          textLayers.push({
            text: line.trim(),
            x: 80,
            y: 100 + idx * 60,
            width: 500,
            height: 50,
            fontSize: idx === 0 ? 36 : 22,
            fontWeight: idx === 0 ? 800 : 500,
            fill: '#FFFFFF',
          });
        });
      }

      return {
        success: true,
        operation: 'ocr',
        textLayers,
        metadata: { provider: 'ocr.space', count: textLayers.length },
      };
    } catch (err: any) {
      console.error('OCR.space request failed:', err.message);
      return {
        success: false,
        operation: 'ocr',
        error: { code: 'NETWORK_TIMEOUT', message: 'Unable to reach OCR text extraction service.' },
      };
    }
  }
}
