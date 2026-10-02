import React from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface CandidateSectionProps {
  isRecording: boolean;
  isMuted: boolean;
  transcript: string;
  onToggleMic: () => void;
  onSubmitAnswer: () => void;
  onTranscriptChange: (text: string) => void;
  userName?: string | null;
  disabled?: boolean;
}

export const CandidateSection: React.FC<CandidateSectionProps> = ({
  isRecording,
  isMuted,
  transcript,
  onToggleMic,
  onSubmitAnswer,
  onTranscriptChange,
  userName = 'Candidate',
  disabled = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
              isRecording && !isMuted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}>
              {isMuted ? <MicOff className="w-5 h-5 text-rose-500" /> : <Mic className="w-5 h-5" />}
            </div>
            {isRecording && !isMuted && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{userName || 'You'} (Candidate)</h4>
            <p className="text-xs text-slate-400">
              {isMuted ? 'Microphone Muted' : isRecording ? 'Listening for speech...' : 'Microphone Ready'}
            </p>
          </div>
        </div>

        {/* Mic toggle */}
        <button
          onClick={onToggleMic}
          disabled={disabled}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
            isMuted
              ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-600" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
        </button>
      </div>

      {/* Answer Speech/Text Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Live Voice Recognition & Edit:</span>
          {isRecording && !isMuted && (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Capturing Audio
            </span>
          )}
        </div>

        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={
            isRecording
              ? 'Speak your answer clearly into your microphone... (or type here to augment your response)'
              : 'Click "Start Recording" or type your response here...'
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-sans"
        />
      </div>

      {/* Submit Answer CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] text-slate-400">
          Press submit when finished with this question
        </span>
        <Button
          size="sm"
          onClick={onSubmitAnswer}
          disabled={disabled || !transcript.trim()}
          rightIcon={<Send className="w-3.5 h-3.5" />}
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};
