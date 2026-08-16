import { NextRequest, NextResponse } from 'next/server';
import { ClipdropService } from '@/lib/ai/clipdrop';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc, extendLeft, extendRight, extendUp, extendDown } = body;

    const result = await ClipdropService.uncropExpand(
      imageSrc,
      extendLeft || 100,
      extendRight || 100,
      extendUp || 100,
      extendDown || 100
    );
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        operation: 'expand',
        error: { code: 'INTERNAL_ERROR', message: 'Internal expansion error' },
      },
      { status: 500 }
    );
  }
}
