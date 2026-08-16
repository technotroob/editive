import { NextRequest, NextResponse } from 'next/server';
import { ClipdropService } from '@/lib/ai/clipdrop';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc, maskSrc } = body;

    const result = await ClipdropService.cleanupObject(imageSrc, maskSrc);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        operation: 'remove-object',
        error: { code: 'INTERNAL_ERROR', message: 'Internal object cleanup error' },
      },
      { status: 500 }
    );
  }
}
