export interface UserAnalytics {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  averageTechnicalScore: number;
  averageCommunicationScore: number;
  averageProblemSolvingScore: number;
  totalQuestionsAnswered: number;
  totalTimeSpentSeconds: number;
  
  // Breakdown
  categoryPerformance: Record<string, { count: number; averageScore: number }>;
  difficultyPerformance: Record<string, { count: number; averageScore: number }>;
  
  // Progress history
  scoreHistory: {
    interviewId: string;
    date: string;
    topic: string;
    score: number;
    type: string;
  }[];
}
