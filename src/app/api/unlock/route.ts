import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageSrc = '' } = body;

    return NextResponse.json({
      success: true,
      message: 'Decomposition metadata synthesized',
      imageSrc,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 400 });
  }
}
