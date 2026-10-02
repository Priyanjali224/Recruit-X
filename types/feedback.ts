export interface QuestionFeedback {
  questionId: string;
  order: number;
  question: string;
  candidateAnswer: string;
  score: number; // 0-100
  evaluation: string;
  improvementSuggestion: string;
  keyPointsCovered: string[];
  keyPointsMissed: string[];
}

export interface FeedbackReport {
  id: string;
  interviewId: string;
  userId: string;
  createdAt: string;
  
  // High level scores
  overallScore: number; // 0-100
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  answerQualityScore: number;
  confidenceScore: number;
  relevanceScore: number;

  // Analysis lists
  strengths: string[];
  improvements: string[];
  
  // Detailed per-question review
  questionReviews: QuestionFeedback[];
  
  // Final summary recommendation
  recommendation: string;
  nextSteps: string[];
}
