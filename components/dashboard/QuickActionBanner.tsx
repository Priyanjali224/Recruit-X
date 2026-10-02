import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, Play, Bot, Mic } from 'lucide-react';

interface QuickActionBannerProps {
  userName?: string | null;
}

export const QuickActionBanner: React.FC<QuickActionBannerProps> = ({ userName }) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg shadow-blue-500/10">
      {/* Background accents */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none -mb-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Voice Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {userName || 'Candidate'}!
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Ready to simulate your next technical round? Choose a domain, speak with your AI interviewer, and get structured evaluation metrics in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/interview/setup">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-md"
              leftIcon={<Play className="w-4 h-4 text-blue-600 fill-blue-600" />}
            >
              Start New Interview
            </Button>
          </Link>
          <Link href="/analytics">
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
