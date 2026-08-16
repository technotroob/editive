import { NextRequest, NextResponse } from 'next/server';
import { OCRSpaceService } from '@/lib/ai/ocr';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc } = body;

    const result = await OCRSpaceService.extractText(imageSrc);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        operation: 'ocr',
        error: { code: 'INTERNAL_ERROR', message: 'Internal OCR error' },
      },
      { status: 500 }
    );
  }
}
