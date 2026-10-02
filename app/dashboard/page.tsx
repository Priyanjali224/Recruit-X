'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { QuickActionBanner } from '@/components/dashboard/QuickActionBanner';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { RecentInterviews } from '@/components/dashboard/RecentInterviews';
import { LoadingState } from '@/components/ui/LoadingState';
import { getUserInterviews, getUserAnalytics } from '@/lib/firebase/firestore';
import { InterviewSession } from '@/types/interview';
import { UserAnalytics } from '@/types/analytics';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    averageTechnicalScore: 0,
    averageCommunicationScore: 0,
    averageProblemSolvingScore: 0,
    totalQuestionsAnswered: 0,
    totalTimeSpentSeconds: 0,
    categoryPerformance: {},
    difficultyPerformance: {},
    scoreHistory: [],
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    async function loadDashboardData() {
      if (!user) return;
      try {
        setDataLoading(true);
        const [userInterviews, userStats] = await Promise.all([
          getUserInterviews(user.uid),
          getUserAnalytics(user.uid),
        ]);
        setInterviews(userInterviews);
        setAnalytics(userStats);
      } catch (err) {
        console.warn('Failed to load dashboard data:', err);
      } finally {
        setDataLoading(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) {
    return <LoadingState fullScreen title="Loading Candidate Dashboard" description="Fetching your latest interviews and performance metrics..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <QuickActionBanner userName={user.displayName} />

      {/* Numerical Stats Overview */}
      <StatsOverview analytics={analytics} />

      {/* Category Selection Cards */}
      <CategoryGrid />

      {/* Recent Interviews List */}
      <RecentInterviews interviews={interviews} />
    </div>
  );
}
