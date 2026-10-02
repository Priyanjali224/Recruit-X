import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { QuestionFeedback } from '@/types/feedback';
import { getScoreBadgeClass } from '@/lib/utils/formatters';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  MessageSquare, 
  HelpCircle 
} from 'lucide-react';

interface QuestionReviewListProps {
  questionReviews: QuestionFeedback[];
}

export const QuestionReviewList: React.FC<QuestionReviewListProps> = ({
  questionReviews,
}) => {
  if (!questionReviews || questionReviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Question-by-Question Deep Dive</h3>
        <span className="text-xs text-slate-500 font-medium">{questionReviews.length} Questions Evaluated</span>
      </div>

      <div className="space-y-4">
        {questionReviews.map((item, idx) => (
          <Card key={idx} className="p-6 bg-white border-slate-200/80 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md w-fit">
                Question {item.order || idx + 1}
              </span>
              <div className={`px-3 py-1 rounded-xl text-xs font-black border w-fit ${getScoreBadgeClass(item.score)}`}>
                Score: {item.score}/100
              </div>
            </div>

            {/* Question Text */}
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                "{item.question}"
              </p>
            </div>

            {/* Candidate Answer Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider block">
                Recorded Candidate Response:
              </span>
              <p className="italic leading-relaxed font-sans">{item.candidateAnswer || 'Answer provided verbally.'}</p>
            </div>

            {/* AI Evaluation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-700">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  AI Evaluation:
                </span>
                <p className="leading-relaxed">{item.evaluation}</p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-slate-700">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Improvement Advice:
                </span>
                <p className="leading-relaxed">{item.improvementSuggestion}</p>
              </div>
            </div>

            {/* Covered vs Missed Points */}
            {(item.keyPointsCovered?.length > 0 || item.keyPointsMissed?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {item.keyPointsCovered?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Key Points Hit
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                      {item.keyPointsCovered.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.keyPointsMissed?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-600" /> Missed Technical Nuances
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                      {item.keyPointsMissed.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
