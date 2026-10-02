import React from 'react';
import { Card } from '@/components/ui/Card';
import { Award, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';
import { getScoreBadgeClass } from '@/lib/utils/formatters';

interface ScoreCardProps {
  overallScore: number;
  topic: string;
  difficulty: string;
  type: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  overallScore,
  topic,
  difficulty,
  type,
}) => {
  const getRatingSummary = (score: number) => {
    if (score >= 85) return { label: 'Strong Hire / Excellent', color: 'text-emerald-600', icon: CheckCircle };
    if (score >= 70) return { label: 'Hire / Meets Expectations', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 55) return { label: 'Leaning Hire / Needs Refinement', color: 'text-amber-600', icon: TrendingUp };
    return { label: 'Needs Substantial Practice', color: 'text-rose-600', icon: ShieldAlert };
  };

  const rating = getRatingSummary(overallScore);
  const RatingIcon = rating.icon;

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute right-0 top-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>AI Interview Performance Report</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {topic} — {type}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span>Difficulty: <strong className="text-white">{difficulty}</strong></span>
            <span>•</span>
            <span>Evaluation Model: <strong className="text-cyan-300">Gemini 1.5 Flash Pro</strong></span>
          </div>
          <div className="flex items-center gap-2 pt-2 text-sm font-semibold">
            <RatingIcon className={`w-4 h-4 ${rating.color}`} />
            <span className={rating.color}>{rating.label}</span>
          </div>
        </div>

        {/* Big Score Gauge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 self-center md:self-auto min-w-[160px]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Overall Score</span>
          <div className="text-5xl font-black tracking-tight text-white mt-1">
            {overallScore}
            <span className="text-xl text-slate-400 font-normal">/100</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${overallScore >= 75 ? 'bg-emerald-400' : overallScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
