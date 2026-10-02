import { NextRequest, NextResponse } from 'next/server';
import { FALLBACK_QUESTIONS, SAMPLE_FEEDBACK_REPORT } from '@/lib/utils/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // Returns list of interviews (standard mock / server representation)
  const interviews = [
    {
      id: 'demo-interview-java',
      userId: userId || 'demo-user-123',
      type: 'Technical Interview',
      topic: 'Java & OOP',
      difficulty: 'Medium',
      totalQuestions: 3,
      currentQuestionIndex: 2,
      status: 'completed',
      score: 84,
      durationSeconds: 380,
      startedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86400000 + 380000).toISOString(),
    },
    {
      id: 'demo-interview-react',
      userId: userId || 'demo-user-123',
      type: 'Technical Interview',
      topic: 'React.js & Next.js',
      difficulty: 'Hard',
      totalQuestions: 5,
      currentQuestionIndex: 4,
      status: 'completed',
      score: 91,
      durationSeconds: 520,
      startedAt: new Date(Date.now() - 172800000).toISOString(),
      completedAt: new Date(Date.now() - 172800000 + 520000).toISOString(),
    },
  ];

  return NextResponse.json(
    {
      success: true,
      count: interviews.length,
      interviews,
    },
    { status: 200 }
  );
}
