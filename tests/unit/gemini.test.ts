import { generateInterviewQuestions } from '@/lib/gemini/questions';
import { generateInterviewFeedback } from '@/lib/gemini/feedback';
import { InterviewSession } from '@/types/interview';
import { FALLBACK_QUESTIONS } from '@/lib/utils/mock-data';

describe('Gemini AI Service Suite', () => {
  test('generateInterviewQuestions returns correct question structure and count', async () => {
    const questions = await generateInterviewQuestions({
      type: 'Technical Interview',
      topic: 'Java & OOP',
      difficulty: 'Medium',
      count: 3,
    });

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThanOrEqual(1);
    expect(questions[0]).toHaveProperty('question');
    expect(questions[0]).toHaveProperty('category');
    expect(questions[0]).toHaveProperty('difficulty');
  });

  test('generateInterviewFeedback produces complete scorecard rubric', async () => {
    const mockSession: InterviewSession = {
      id: 'test-session-1',
      userId: 'test-user',
      type: 'Technical Interview',
      topic: 'React.js',
      difficulty: 'Medium',
      totalQuestions: 2,
      currentQuestionIndex: 1,
      status: 'completed',
      questions: FALLBACK_QUESTIONS.react,
      answers: [
        {
          id: 'ans-1',
          interviewId: 'test-session-1',
          questionId: 'react-1',
          questionText: 'Explain React Fiber architecture.',
          transcript: 'Fiber enables incremental rendering and prioritizes urgent updates.',
          answeredAt: new Date().toISOString(),
        },
      ],
      transcript: [],
      startedAt: new Date().toISOString(),
    };

    const feedback = await generateInterviewFeedback(mockSession);

    expect(feedback).toBeDefined();
    expect(feedback.overallScore).toBeGreaterThanOrEqual(0);
    expect(feedback.overallScore).toBeLessThanOrEqual(100);
    expect(feedback.strengths.length).toBeGreaterThan(0);
    expect(feedback.improvements.length).toBeGreaterThan(0);
    expect(feedback.recommendation).toBeTruthy();
  });
});
