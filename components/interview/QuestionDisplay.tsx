import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { InterviewQuestion } from '@/types/interview';
import { getDifficultyBadgeClass } from '@/lib/utils/formatters';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';

interface QuestionDisplayProps {
  question: InterviewQuestion | undefined;
  currentIndex: number;
  totalQuestions: number;
  topic: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  topic,
}) => {
  const [showHints, setShowHints] = useState(false);

  if (!question) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-slate-500">Preparing next question...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-slate-200/80 shadow-sm space-y-4">
      {/* Progress Bar & Index */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyBadgeClass(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {topic}
          </span>
        </div>

        <ProgressBar
          value={currentIndex + 1}
          max={totalQuestions}
          color="gradient"
        />
      </div>

      {/* Main Question Text */}
      <div className="pt-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          "{question.question}"
        </h3>
      </div>

      {/* Hints / Expectations Toggle */}
      {question.idealAnswerKeyPoints && question.idealAnswerKeyPoints.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Expected Discussion Areas (Evaluation Rubric)
            </span>
            {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHints && (
            <div className="mt-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-150">
              <p className="font-semibold text-blue-900 text-[11px] uppercase tracking-wider">
                Key Concepts Evaluated:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {question.idealAnswerKeyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
