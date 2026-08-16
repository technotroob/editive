import { NextRequest, NextResponse } from 'next/server';
import { ClipdropService } from '@/lib/ai/clipdrop';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc, targetWidth, targetHeight } = body;

    const result = await ClipdropService.upscale2x(imageSrc, targetWidth, targetHeight);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        operation: 'upscale',
        error: { code: 'INTERNAL_ERROR', message: 'Internal upscaling error' },
      },
      { status: 500 }
    );
  }
}
