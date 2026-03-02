import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // TODO: Integrate with backend WebSocket handler
    // For now, return mock response
    return NextResponse.json({
      success: true,
      data: {
        id: sessionId,
        status: 'completed',
        endedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error stopping session:', error);
    return NextResponse.json(
      { error: 'Failed to stop session' },
      { status: 500 }
    );
  }
}
