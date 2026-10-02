import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewFeedback } from '@/lib/gemini/feedback';
import { InterviewSession } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = body.session as InterviewSession;

    if (!session || !session.questions || !Array.isArray(session.questions)) {
      return NextResponse.json(
        { error: 'Invalid payload: "session" with questions array is required.' },
        { status: 400 }
      );
    }

    const feedback = await generateInterviewFeedback(session);

    return NextResponse.json(
      {
        success: true,
        feedback,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Feedback generation error' },
      { status: 500 }
    );
  }
}
