'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserAnalytics } from '@/types/analytics';
import { getUserAnalytics } from '@/lib/firebase/firestore';
import { formatDuration, getScoreBadgeClass } from '@/lib/utils/formatters';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  BrainCircuit, 
  MessageSquare, 
  Clock, 
  Play,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    async function loadAnalytics() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getUserAnalytics(user.uid);
        setAnalytics(data);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadAnalytics();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <LoadingState fullScreen title="Aggregating Analytics" description="Calculating competency scores and historical progress trends..." />;
  }

  const hasData = analytics && analytics.totalInterviews > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">Performance Telemetry</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidate Analytics & Growth Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time breakdown of technical proficiency, communication scores, and interview performance trends.
          </p>
        </div>
        <Link href="/interview/setup">
          <Button size="sm" rightIcon={<Play className="w-3.5 h-3.5" />}>
            Start New Mock Session
          </Button>
        </Link>
      </div>

      {!hasData ? (
        <EmptyState
          title="No analytics recorded yet"
          description="Complete your first AI mock interview to generate performance analytics, competency breakdown, and historical trend charts."
          actionLabel="Launch Interview"
          onAction={() => router.push('/interview/setup')}
          icon={<BarChart3 className="w-8 h-8" />}
        />
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200/80 bg-white">
              <span className="text-xs font-semibold text-slate-500">Average Overall Score</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {analytics.averageScore}%
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Across {analytics.completedInterviews} completed rounds
              </p>
            </Card>

            <Card className="p-5 border-slate-200/80 bg-white">
              <span className="text-xs font-semibold text-slate-500">Technical Depth</span>
              <div className="text-3xl font-black text-blue-600 mt-1">
                {analytics.averageTechnicalScore}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">System design & core CS</p>
            </Card>

            <Card className="p-5 border-slate-200/80 bg-white">
              <span className="text-xs font-semibold text-slate-500">Communication & Clarity</span>
              <div className="text-3xl font-black text-indigo-600 mt-1">
                {analytics.averageCommunicationScore}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Speech pacing & articulation</p>
            </Card>

            <Card className="p-5 border-slate-200/80 bg-white">
              <span className="text-xs font-semibold text-slate-500">Total Practice Time</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {formatDuration(analytics.totalTimeSpentSeconds)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {analytics.totalQuestionsAnswered} questions solved
              </p>
            </Card>
          </div>

          {/* Charts & Topic Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Performance (7 cols) */}
            <Card className="lg:col-span-7 p-6 bg-white border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Topic Proficiency Breakdown</h3>
                </div>
                <span className="text-xs text-slate-400">Score & Volume</span>
              </div>

              <div className="space-y-4">
                {Object.keys(analytics.categoryPerformance).length === 0 ? (
                  <p className="text-xs text-slate-400">No topic data available yet.</p>
                ) : (
                  Object.entries(analytics.categoryPerformance).map(([topic, data], idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800">{topic} ({data.count} sessions)</span>
                        <span className="text-blue-600">{data.averageScore}%</span>
                      </div>
                      <ProgressBar value={data.averageScore} max={100} showPercentage={false} />
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Difficulty Breakdown (5 cols) */}
            <Card className="lg:col-span-5 p-6 bg-white border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900">Difficulty Distribution</h3>
                </div>
                <span className="text-xs text-slate-400">Accuracy</span>
              </div>

              <div className="space-y-4">
                {['Easy', 'Medium', 'Hard'].map((diff) => {
                  const data = analytics.difficultyPerformance[diff] || { count: 0, averageScore: 0 };
                  return (
                    <div key={diff} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{diff}</span>
                        <span className="font-black text-slate-700">{data.averageScore > 0 ? `${data.averageScore}%` : 'N/A'}</span>
                      </div>
                      <ProgressBar
                        value={data.averageScore}
                        max={100}
                        color={diff === 'Easy' ? 'emerald' : diff === 'Medium' ? 'amber' : 'rose'}
                      />
                      <span className="text-[10px] text-slate-400 block">{data.count} mock sessions completed</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Historical Score Progression Trend */}
          {analytics.scoreHistory && analytics.scoreHistory.length > 0 && (
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Session Score Progression</h3>
                </div>
                <span className="text-xs text-slate-400">Recent Completed Rounds</span>
              </div>

              {/* Responsive SVG Sparkline Chart */}
              <div className="h-48 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {analytics.scoreHistory.map((hist, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {hist.score}%
                    </span>
                    <div
                      className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-700 group-hover:to-indigo-600 transition-all duration-300"
                      style={{ height: `${Math.max(15, hist.score)}%` }}
                    />
                    <span className="text-[10px] text-slate-400 truncate max-w-[60px]">
                      {hist.topic}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
