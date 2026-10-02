import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { InterviewSession } from '@/types/interview';
import { formatDate, getScoreBadgeClass, getDifficultyBadgeClass } from '@/lib/utils/formatters';
import { ArrowRight, FileText, Play, History, CheckCircle2, Clock } from 'lucide-react';

interface RecentInterviewsProps {
  interviews: InterviewSession[];
}

export const RecentInterviews: React.FC<RecentInterviewsProps> = ({ interviews }) => {
  if (!interviews || interviews.length === 0) {
    return (
      <EmptyState
        title="No interviews completed yet"
        description="Select any interview track above to start your very first AI-driven technical mock round."
        actionLabel="Start New Interview"
        onAction={() => (window.location.href = '/interview/setup')}
        icon={<History className="w-6 h-6" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Interview Sessions</h2>
          <p className="text-xs text-slate-500">Your latest practice rounds and feedback reports</p>
        </div>
        <Link href="/history">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All History
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-xs">
        {interviews.slice(0, 5).map((interview) => {
          const isCompleted = interview.status === 'completed';

          return (
            <div
              key={interview.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900">{interview.topic}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyBadgeClass(interview.difficulty)}`}>
                    {interview.difficulty}
                  </span>
                  <Badge variant={isCompleted ? 'success' : 'warning'}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{formatDate(interview.startedAt)}</span>
                  <span>•</span>
                  <span>{interview.totalQuestions} Questions</span>
                  <span>•</span>
                  <span>{interview.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {isCompleted && typeof interview.score === 'number' && (
                  <div className={`px-3 py-1.5 rounded-xl border font-black text-sm ${getScoreBadgeClass(interview.score)}`}>
                    {interview.score}/100
                  </div>
                )}

                {isCompleted ? (
                  <Link href={`/interview/${interview.id}/feedback`}>
                    <Button size="sm" variant="outline" leftIcon={<FileText className="w-3.5 h-3.5 text-blue-600" />}>
                      View Report
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/interview/${interview.id}`}>
                    <Button size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
                      Resume
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
