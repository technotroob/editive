import { NextRequest, NextResponse } from 'next/server';
import { RemoveBgService } from '@/lib/ai/remove-bg';
import { ClipdropService } from '@/lib/ai/clipdrop';
import { OCRSpaceService } from '@/lib/ai/ocr';
import { ReplicateService } from '@/lib/ai/replicate';

export const maxDuration = 60;

/**
 * Unified AI dispatcher: routes an operation to the correct real provider.
 * Prefer the dedicated per-tool routes (/api/ai/remove-background etc.);
 * this endpoint is a convenience dispatcher used by generic tooling.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tool = 'smart-enhance', imageSrc = '', maskSrc, extendLeft, extendRight, extendUp, extendDown, pointCoords } = body;

    let result;
    switch (tool) {
      case 'remove-background':
      case 'remove_bg':
        result = await RemoveBgService.removeBackground(imageSrc);
        break;
      case 'remove-object':
      case 'remove_object':
        result = await ClipdropService.cleanupObject(imageSrc, maskSrc);
        break;
      case 'upscale':
      case 'ai_upscale':
        result = await ClipdropService.upscale2x(imageSrc, body.targetWidth, body.targetHeight);
        break;
      case 'expand':
      case 'ai_expand':
        result = await ClipdropService.uncropExpand(
          imageSrc,
          extendLeft || 100,
          extendRight || 100,
          extendUp || 100,
          extendDown || 100
        );
        break;
      case 'ocr':
      case 'extract_text':
        result = await OCRSpaceService.extractText(imageSrc);
        break;
      case 'smart-select':
      case 'smart_select':
        result = await ReplicateService.segmentObject(imageSrc, pointCoords);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            operation: tool,
            error: { code: 'UNSUPPORTED_TOOL', message: `AI tool "${tool}" is not supported.` },
          },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: result?.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, operation: 'ai', error: { code: 'INTERNAL_ERROR', message: err.message || 'AI processing error' } },
      { status: 500 }
    );
  }
}