import { getGeminiClient, isGeminiConfigured } from './client';
import { InterviewQuestion, InterviewDifficulty, InterviewType } from '@/types/interview';
import { FALLBACK_QUESTIONS } from '../utils/mock-data';

interface GenerateQuestionsParams {
  type: InterviewType;
  topic: string;
  difficulty: InterviewDifficulty;
  count: number;
}

export async function generateInterviewQuestions({
  type,
  topic,
  difficulty,
  count = 5,
}: GenerateQuestionsParams): Promise<InterviewQuestion[]> {
  if (isGeminiConfigured()) {
    try {
      const client = getGeminiClient();
      if (client) {
        const model = client.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        });

        const prompt = `
You are an expert technical interviewer at a top tech company (like Google, Stripe, or Meta).
Generate exactly ${count} realistic, challenging, high-quality interview questions for a candidate.

Parameters:
- Interview Track: ${type}
- Specific Topic: ${topic}
- Target Difficulty: ${difficulty} (Easy, Medium, Hard)

Ensure questions test conceptual depth, real-world trade-offs, edge cases, and architectural reasoning.
Format your response as a valid JSON array of objects with this exact structure:
[
  {
    "order": 1,
    "question": "Question text...",
    "category": "${topic}",
    "difficulty": "${difficulty}",
    "idealAnswerKeyPoints": ["Point 1", "Point 2", "Point 3"],
    "expectedTopics": ["topic1", "topic2"]
  }
]
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, index) => ({
            id: `q_${Date.now()}_${index + 1}`,
            order: index + 1,
            question: item.question,
            category: item.category || topic,
            difficulty: item.difficulty || difficulty,
            idealAnswerKeyPoints: item.idealAnswerKeyPoints || [],
            expectedTopics: item.expectedTopics || [],
          }));
        }
      }
    } catch (error) {
      console.warn('Gemini API question generation error, using fallback catalog:', error);
    }
  }

  // Domain fallback question generator
  return getFallbackQuestionsForTopic(topic, difficulty, count);
}

function getFallbackQuestionsForTopic(
  topic: string, 
  difficulty: InterviewDifficulty, 
  count: number
): InterviewQuestion[] {
  const normalizedTopic = topic.toLowerCase();
  let baseList: InterviewQuestion[] = [];

  if (normalizedTopic.includes('java') || normalizedTopic.includes('oop')) {
    baseList = FALLBACK_QUESTIONS.java || [];
  } else if (normalizedTopic.includes('dsa') || normalizedTopic.includes('algorithm') || normalizedTopic.includes('structure')) {
    baseList = FALLBACK_QUESTIONS.dsa || [];
  } else if (normalizedTopic.includes('react') || normalizedTopic.includes('next') || normalizedTopic.includes('frontend')) {
    baseList = FALLBACK_QUESTIONS.react || [];
  }

  // Generative template if topic not in predefined map
  const catalog: InterviewQuestion[] = [
    ...baseList,
    {
      id: `q_dyn_1`,
      order: 1,
      question: `Explain the core mental model and architectural design patterns behind ${topic}. How does it handle scalability and fault tolerance?`,
      category: topic,
      difficulty,
      idealAnswerKeyPoints: ['Core architectural components', 'Scalability patterns', 'Error handling strategies'],
    },
    {
      id: `q_dyn_2`,
      order: 2,
      question: `What are the most common performance bottlenecks in ${topic} in production environments, and how do you diagnose and mitigate them?`,
      category: topic,
      difficulty,
      idealAnswerKeyPoints: ['Profiling & monitoring metrics', 'Common anti-patterns', 'Optimization strategies'],
    },
    {
      id: `q_dyn_3`,
      order: 3,
      question: `Compare the trade-offs of ${topic} versus alternative paradigms or technologies. Under what constraints would you NOT recommend using it?`,
      category: topic,
      difficulty,
      idealAnswerKeyPoints: ['Trade-off analysis', 'Resource/complexity overhead', 'Best use cases vs edge cases'],
    },
    {
      id: `q_dyn_4`,
      order: 4,
      question: `Describe how state management, memory lifecycle, or caching is handled in ${topic} under concurrent workloads.`,
      category: topic,
      difficulty,
      idealAnswerKeyPoints: ['Concurrency models', 'Cache invalidation / memory leaks', 'Thread safety or execution queue'],
    },
    {
      id: `q_dyn_5`,
      order: 5,
      question: `Walk me through how you would troubleshoot a silent latency spike or unexpected memory leak in a system using ${topic}.`,
      category: topic,
      difficulty,
      idealAnswerKeyPoints: ['Root-cause analysis methodology', 'Log & telemetry inspection', 'Remediation and rollback plan'],
    },
  ];

  return catalog.slice(0, count).map((q, idx) => ({
    ...q,
    id: `gen_q_${Date.now()}_${idx + 1}`,
    order: idx + 1,
    difficulty,
  }));
}
