import React from 'react';
import { Card } from '@/components/ui/Card';
import { UserAnalytics } from '@/types/analytics';
import { Award, CheckCircle2, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { formatDuration } from '@/lib/utils/formatters';

interface StatsOverviewProps {
  analytics: UserAnalytics;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ analytics }) => {
  const stats = [
    {
      title: 'Total Interviews',
      value: analytics.totalInterviews.toString(),
      subtext: `${analytics.completedInterviews} completed`,
      icon: Award,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Average Score',
      value: analytics.averageScore > 0 ? `${analytics.averageScore}%` : 'N/A',
      subtext: analytics.averageScore >= 80 ? 'Top 10% benchmark' : 'Target: 80%+',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Questions Answered',
      value: analytics.totalQuestionsAnswered.toString(),
      subtext: 'Across all topics',
      icon: MessageSquare,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Practice Time',
      value: formatDuration(analytics.totalTimeSpentSeconds),
      subtext: 'Active mock duration',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.subtext}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
