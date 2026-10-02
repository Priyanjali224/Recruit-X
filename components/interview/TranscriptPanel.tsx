import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { TranscriptMessage } from '@/types/interview';
import { Bot, User, MessageSquare, Terminal } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

interface TranscriptPanelProps {
  messages: TranscriptMessage[];
  currentSpeech?: string;
  isAiSpeaking?: boolean;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  messages,
  currentSpeech,
  isAiSpeaking,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentSpeech]);

  return (
    <Card className="flex flex-col h-[520px] p-0 overflow-hidden bg-white border-slate-200/80 shadow-sm">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Live Interview Transcript</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Synchronized
        </span>
      </div>

      {/* Messages Stream */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 shadow-xs ${
                  isAI
                    ? 'bg-blue-50/70 border border-blue-100 text-slate-800 rounded-tl-none'
                    : 'bg-slate-900 text-white rounded-tr-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[11px] font-bold ${isAI ? 'text-blue-700' : 'text-slate-300'}`}>
                    {isAI ? 'AI Interviewer' : 'You (Candidate)'}
                  </span>
                  <span className={`text-[10px] ${isAI ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live Interim speech indicator */}
        {currentSpeech && (
          <div className="flex justify-end gap-3 animate-pulse">
            <div className="max-w-[82%] rounded-2xl p-3 bg-slate-100 border border-dashed border-slate-300 text-slate-600 rounded-tr-none">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Speaking now...</span>
              <p className="text-xs italic">{currentSpeech}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 flex-shrink-0 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
