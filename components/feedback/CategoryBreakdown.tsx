import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FeedbackReport } from '@/types/feedback';
import { 
  Code2, 
  BrainCircuit, 
  MessageSquare, 
  Sparkles, 
  Target, 
  Zap 
} from 'lucide-react';

interface CategoryBreakdownProps {
  feedback: FeedbackReport;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ feedback }) => {
  const categories = [
    {
      name: 'Technical Knowledge',
      score: feedback.technicalScore || 85,
      desc: 'Conceptual correctness, system semantics, depth of knowledge.',
      icon: Code2,
      color: 'blue' as const,
    },
    {
      name: 'Problem Solving',
      score: feedback.problemSolvingScore || 80,
      desc: 'Algorithmic reasoning, trade-off analysis, edge-case handling.',
      icon: BrainCircuit,
      color: 'emerald' as const,
    },
    {
      name: 'Communication',
      score: feedback.communicationScore || 84,
      desc: 'Clarity of articulation, vocabulary, and structured responses.',
      icon: MessageSquare,
      color: 'indigo' as const,
    },
    {
      name: 'Answer Quality',
      score: feedback.answerQualityScore || 82,
      desc: 'Completeness, thoroughness, and avoidance of ambiguity.',
      icon: Sparkles,
      color: 'amber' as const,
    },
    {
      name: 'Confidence & Delivery',
      score: feedback.confidenceScore || 79,
      desc: 'Verbal composure, pacing, and decisive articulation.',
      icon: Zap,
      color: 'rose' as const,
    },
    {
      name: 'Relevance to Question',
      score: feedback.relevanceScore || 88,
      desc: 'Focus on core problem statement without unnecessary tangents.',
      icon: Target,
      color: 'blue' as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Competency Dimension Scores</h3>
        <span className="text-xs text-slate-500 font-medium">Standardized 0-100 Rubric</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Card key={idx} className="p-5 border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-slate-900">{cat.score}%</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{cat.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{cat.desc}</p>
              </div>
              <ProgressBar value={cat.score} max={100} showPercentage={false} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};
