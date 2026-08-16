import { NextRequest, NextResponse } from 'next/server';
import { RemoveBgService } from '@/lib/ai/remove-bg';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc } = body;

    const result = await RemoveBgService.removeBackground(imageSrc);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        operation: 'remove-background',
        error: { code: 'INTERNAL_ERROR', message: 'Internal background removal error' },
      },
      { status: 500 }
    );
  }
}
