import { NextRequest, NextResponse } from 'next/server';
import { ReplicateService } from '@/lib/ai/replicate';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc, pointCoords } = body;

    const result = await ReplicateService.segmentObject(imageSrc, pointCoords);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        operation: 'smart-select',
        error: { code: 'INTERNAL_ERROR', message: 'Internal segmentation error' },
      },
      { status: 500 }
    );
  }
}
