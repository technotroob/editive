import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    projects: [],
    message: 'Projects storage endpoint active',
  });
}

export async function POST(req: NextRequest) {
  try {
    const project = await req.json();
    return NextResponse.json({
      success: true,
      projectId: project.id,
      savedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Save error' }, { status: 500 });
  }
}
