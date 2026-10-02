'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ScoreCard } from '@/components/feedback/ScoreCard';
import { CategoryBreakdown } from '@/components/feedback/CategoryBreakdown';
import { StrengthsWeaknesses } from '@/components/feedback/StrengthsWeaknesses';
import { QuestionReviewList } from '@/components/feedback/QuestionReviewList';
import { Recommendations } from '@/components/feedback/Recommendations';
import { LoadingState } from '@/components/ui/LoadingState';
import { FeedbackReport } from '@/types/feedback';
import { InterviewSession } from '@/types/interview';
import { getFeedbackReport, getInterviewSession } from '@/lib/firebase/firestore';
import { SAMPLE_FEEDBACK_REPORT } from '@/lib/utils/mock-data';

export default function InterviewFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const { user } = useAuth();

  const [feedback, setFeedback] = useState<FeedbackReport | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!interviewId) return;
      try {
        setLoading(true);
        const [feedbackData, sessionData] = await Promise.all([
          getFeedbackReport(interviewId),
          getInterviewSession(interviewId),
        ]);

        if (feedbackData) {
          setFeedback(feedbackData);
        } else {
          // Fallback demo report
          setFeedback({
            ...SAMPLE_FEEDBACK_REPORT,
            interviewId,
            userId: user?.uid || 'demo-user',
          });
        }

        if (sessionData) {
          setSession(sessionData);
        }
      } catch (err) {
        console.error('Error loading feedback report:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [interviewId, user]);

  if (loading || !feedback) {
    return <LoadingState fullScreen title="Compiling Evaluation Report" description="Loading detailed AI scores, transcripts, and recommendations..." />;
  }

  const topic = session?.topic || 'Java & OOP';
  const difficulty = session?.difficulty || 'Medium';
  const type = session?.type || 'Technical Interview';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Score Card */}
      <ScoreCard
        overallScore={feedback.overallScore}
        topic={topic}
        difficulty={difficulty}
        type={type}
      />

      {/* Multi-Dimensional Competency Scores */}
      <CategoryBreakdown feedback={feedback} />

      {/* Strengths & Improvements */}
      <StrengthsWeaknesses
        strengths={feedback.strengths}
        improvements={feedback.improvements}
      />

      {/* Question by Question Review */}
      <QuestionReviewList questionReviews={feedback.questionReviews} />

      {/* Final Actionable Recommendation */}
      <Recommendations
        recommendation={feedback.recommendation}
        nextSteps={feedback.nextSteps}
        topic={topic}
      />
    </div>
  );
}
