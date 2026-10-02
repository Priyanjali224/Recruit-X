export type InterviewType = 
  | 'Technical Interview'
  | 'Coding Interview'
  | 'HR Interview'
  | 'Full Stack Interview'
  | 'System Design';

export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export type InterviewStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export type AIInterviewerStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface InterviewQuestion {
  id: string;
  interviewId?: string;
  order: number;
  question: string;
  category: string;
  difficulty: InterviewDifficulty;
  idealAnswerKeyPoints?: string[];
  expectedTopics?: string[];
}

export interface CandidateAnswer {
  id: string;
  interviewId: string;
  questionId: string;
  questionText: string;
  transcript: string;
  score?: number; // 0-100
  feedback?: string;
  answeredAt: string;
  durationSeconds?: number;
}

export interface TranscriptMessage {
  id: string;
  sender: 'ai' | 'candidate' | 'system';
  text: string;
  timestamp: string;
  questionIndex?: number;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  topic: string;
  difficulty: InterviewDifficulty;
  totalQuestions: number;
  currentQuestionIndex: number;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  answers: CandidateAnswer[];
  transcript: TranscriptMessage[];
  score?: number;
  durationSeconds?: number;
  startedAt: string;
  completedAt?: string;
  feedbackId?: string;
}

export interface InterviewSetupConfig {
  type: InterviewType;
  topic: string;
  difficulty: InterviewDifficulty;
  totalQuestions: number;
  customNotes?: string;
}
