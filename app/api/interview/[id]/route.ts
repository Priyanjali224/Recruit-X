import { NextRequest, NextResponse } from 'next/server';
import { FALLBACK_QUESTIONS } from '@/lib/utils/mock-data';
import { InterviewSession } from '@/types/interview';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const interviewId = params.id;

  if (!interviewId) {
    return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
  }

  // Returns session schema representation
  const session: InterviewSession = {
    id: interviewId,
    userId: 'demo-user-123',
    type: 'Technical Interview',
    topic: 'Java & OOP',
    difficulty: 'Medium',
    totalQuestions: 3,
    currentQuestionIndex: 0,
    status: 'in_progress',
    questions: FALLBACK_QUESTIONS.java,
    answers: [],
    transcript: [
      {
        id: 'msg_init',
        sender: 'ai',
        text: 'Welcome to your Java & OOP interview.',
        timestamp: new Date().toISOString(),
      },
    ],
    startedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, interview: session }, { status: 200 });
}
