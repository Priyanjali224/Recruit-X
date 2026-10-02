import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestions } from '@/lib/gemini/questions';
import { InterviewType, InterviewDifficulty } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, type = 'Technical Interview', difficulty = 'Medium', count = 1 } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required.' },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions({
      type: type as InterviewType,
      topic,
      difficulty: difficulty as InterviewDifficulty,
      count: Number(count) || 1,
    });

    return NextResponse.json(
      {
        success: true,
        questions,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate question' },
      { status: 500 }
    );
  }
}
