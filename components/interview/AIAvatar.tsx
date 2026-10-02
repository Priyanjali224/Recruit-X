import React from 'react';
import { AIInterviewerStatus } from '@/types/interview';
import { Bot, Volume2, Mic, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AIAvatarProps {
  status: AIInterviewerStatus;
  name?: string;
  className?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  status,
  name = 'Alex — AI Interviewer',
  className,
}) => {
  const statusConfig = {
    idle: {
      label: 'Ready to Start',
      color: 'bg-slate-500',
      textColor: 'text-slate-400',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: Bot,
    },
    speaking: {
      label: 'Speaking...',
      color: 'bg-blue-500 animate-pulse',
      textColor: 'text-blue-400',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800',
      icon: Volume2,
    },
    listening: {
      label: 'Listening to you...',
      color: 'bg-emerald-500 animate-ping',
      textColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      icon: Mic,
    },
    thinking: {
      label: 'Evaluating & Thinking...',
      color: 'bg-indigo-500 animate-pulse',
      textColor: 'text-indigo-400',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
      icon: Brain,
    },
  };

  const current = statusConfig[status];
  const StatusIcon = current.icon;

  return (
    <div className={cn('relative rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center overflow-hidden', className)}>
      {/* Background radial glow */}
      <div className={`absolute w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${
        status === 'speaking' ? 'bg-blue-500' : status === 'listening' ? 'bg-emerald-500' : status === 'thinking' ? 'bg-indigo-500' : 'bg-slate-600'
      }`} />

      {/* Avatar Circle with Rings */}
      <div className="relative mb-4">
        {status === 'speaking' && (
          <div className="absolute inset-0 -m-3 rounded-full border-2 border-blue-500/40 animate-ping" />
        )}
        {status === 'listening' && (
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-emerald-500/50 animate-pulse" />
        )}

        <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-900 border-2 flex items-center justify-center shadow-xl transition-all duration-300 ${
          status === 'speaking' ? 'border-blue-500 shadow-blue-500/20' : status === 'listening' ? 'border-emerald-500 shadow-emerald-500/20' : 'border-slate-700'
        }`}>
          <Bot className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-300 ${current.textColor}`} />
        </div>
      </div>

      <h3 className="text-base font-bold text-white">{name}</h3>
      
      {/* Status Badge */}
      <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.badgeColor}`}>
        <span className={`w-2 h-2 rounded-full ${current.color}`} />
        <StatusIcon className="w-3.5 h-3.5" />
        <span>{current.label}</span>
      </div>

      {/* Dynamic Sound Wave indicator when speaking */}
      {status === 'speaking' && (
        <div className="flex items-end gap-1 h-5 mt-4">
          <span className="w-1 bg-blue-400 rounded-full animate-soundwave-1"></span>
          <span className="w-1 bg-blue-300 rounded-full animate-soundwave-2"></span>
          <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-3"></span>
          <span className="w-1 bg-blue-400 rounded-full animate-soundwave-4"></span>
          <span className="w-1 bg-indigo-400 rounded-full animate-soundwave-5"></span>
        </div>
      )}
    </div>
  );
};
