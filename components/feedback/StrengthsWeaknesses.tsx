import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

interface StrengthsWeaknessesProps {
  strengths: string[];
  improvements: string[];
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  strengths,
  improvements,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <Card className="p-6 border-emerald-200/80 bg-emerald-50/30 space-y-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold">Key Candidate Strengths</h3>
        </div>

        <ul className="space-y-3">
          {strengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Areas for Improvement */}
      <Card className="p-6 border-amber-200/80 bg-amber-50/30 space-y-4">
        <div className="flex items-center gap-2 text-amber-800">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold">Areas for Target Improvement</h3>
        </div>

        <ul className="space-y-3">
          {improvements.map((imp, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
