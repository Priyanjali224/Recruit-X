import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestions } from '@/lib/gemini/questions';
import { InterviewSession, InterviewType, InterviewDifficulty } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, type, topic, difficulty, totalQuestions = 5 } = body;

    if (!topic || !type) {
      return NextResponse.json(
        { error: 'Invalid request: "topic" and "type" are required fields.' },
        { status: 400 }
      );
    }

    const validDifficulty: InterviewDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty)
      ? difficulty
      : 'Medium';

    const questions = await generateInterviewQuestions({
      type: type as InterviewType,
      topic,
      difficulty: validDifficulty,
      count: Number(totalQuestions) || 5,
    });

    const interviewId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const session: InterviewSession = {
      id: interviewId,
      userId: userId || 'anonymous',
      type: type as InterviewType,
      topic,
      difficulty: validDifficulty,
      totalQuestions: questions.length,
      currentQuestionIndex: 0,
      status: 'in_progress',
      questions,
      answers: [],
      transcript: [
        {
          id: `msg_init_${Date.now()}`,
          sender: 'ai',
          text: `Welcome to your ${topic} ${type}. Let's begin with question 1.`,
          timestamp: new Date().toISOString(),
          questionIndex: 0,
        },
      ],
      startedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Interview session created successfully',
        interview: session,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
