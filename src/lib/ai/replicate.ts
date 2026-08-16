import { AIHelpers } from './helpers';
import { AIResponse } from './types';

export class ReplicateService {
  private static getApiToken(): string | undefined {
    return process.env.REPLICATE_API_TOKEN;
  }

  /**
   * Smart Object Select: isolates the primary subject via an up-to-date
   * background-removal/segmentation model on Replicate.
   *
   * Uses `model` (not a pinned `version`) so it always resolves to the
   * model's current default version — no outdated hardcoded hashes.
   */
  public static async segmentObject(imageSrc: string, pointCoords?: [number, number]): Promise<AIResponse> {
    const validation = AIHelpers.validateImageInput(imageSrc);
    if (!validation.valid) {
      return {
        success: false,
        operation: 'smart-select',
        error: { code: 'INVALID_INPUT', message: validation.error || 'Invalid image' },
      };
    }

    const token = this.getApiToken();
    if (!token) {
      return {
        success: false,
        operation: 'smart-select',
        error: {
          code: 'NO_API_KEY',
          message: 'REPLICATE_API_TOKEN is not configured in .env.local. Add it to enable smart object select.',
        },
      };
    }

    let predictionId: string | null = null;

    try {
      // Start the prediction (Prefer: wait so fast models return inline)
      const createRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'wait=5',
        },
        body: JSON.stringify({
          model: 'lucataco/remove-bg',
          input: {
            image: imageSrc,
            ...(pointCoords ? { point_coords: [pointCoords] } : {}),
          },
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text().catch(() => '');
        console.error('Replicate create prediction error:', createRes.status, errText);
        return {
          success: false,
          operation: 'smart-select',
          error: { code: 'PROVIDER_ERROR', message: 'Object segmentation service returned an error.' },
        };
      }

      const prediction = await createRes.json();
      predictionId = prediction.id ?? null;

      // Poll until terminal state (max ~40s)
      const startedAt = Date.now();
      let state = prediction.status;
      let output = prediction.output;

      while (state === 'starting' || state === 'processing') {
        if (Date.now() - startedAt > 40000) {
          return {
            success: false,
            operation: 'smart-select',
            error: { code: 'TIMEOUT', message: 'Object segmentation took too long. Please try again.' },
          };
        }
        await new Promise((r) => setTimeout(r, 1500));
        const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!pollRes.ok) break;
        const pollData = await pollRes.json();
        state = pollData.status;
        output = pollData.output;
      }

      if (state === 'succeeded' && output) {
        const outputUrl = Array.isArray(output) ? output[0] : output;
        if (outputUrl) {
          // Convert the remote output to a data URL so the client canvas can
          // render it without CORS restrictions.
          try {
            const imgRes = await fetch(outputUrl, { signal: AbortSignal.timeout(20000) });
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              const mime = (imgRes.headers.get('content-type') || 'image/png').split(';')[0];
              return {
                success: true,
                operation: 'smart-select',
                outputUrl: AIHelpers.bufferToDataUrl(buf, mime),
                mimeType: mime,
                metadata: { provider: 'replicate', model: 'lucataco/remove-bg' },
              };
            }
          } catch (fetchErr: any) {
            console.error('Replicate output fetch failed:', fetchErr?.message);
            return {
              success: false,
              operation: 'smart-select',
              error: { code: 'OUTPUT_FETCH_FAILED', message: 'Segmentation succeeded but the result could not be loaded.' },
            };
          }
        }
      }

      if (state === 'failed' || state === 'canceled') {
        return {
          success: false,
          operation: 'smart-select',
          error: { code: 'SEGMENTATION_FAILED', message: 'Object segmentation failed. Please try a different image.' },
        };
      }

      return {
        success: false,
        operation: 'smart-select',
        error: { code: 'SEGMENTATION_INCOMPLETE', message: 'Segmentation could not isolate the subject.' },
      };
    } catch (err: any) {
      console.error('Replicate request failed:', err.message);
      return {
        success: false,
        operation: 'smart-select',
        error: { code: 'NETWORK_TIMEOUT', message: 'Unable to reach object segmentation service.' },
      };
    }
  }
}