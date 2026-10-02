import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { message, call } = payload;

    // Handles Vapi call status updates and transcripts
    console.log('Vapi webhook received message type:', message?.type);

    if (message?.type === 'end-of-call-report') {
      console.log('Vapi Call ended. Duration:', message?.durationMinutes);
      return NextResponse.json({ success: true, processed: true }, { status: 200 });
    }

    if (message?.type === 'transcript') {
      return NextResponse.json({
        success: true,
        transcript: message.transcript,
        role: message.role,
      }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
