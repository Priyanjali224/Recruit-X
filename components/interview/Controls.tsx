import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Square, 
  Clock, 
  Volume2, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { formatDuration } from '@/lib/utils/formatters';

interface ControlsProps {
  elapsedSeconds: number;
  isActive: boolean;
  onToggleActive: () => void;
  onRepeatQuestion: () => void;
  onNextQuestion: () => void;
  onEndInterview: () => void;
  isLastQuestion: boolean;
  disabled?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  elapsedSeconds,
  isActive,
  onToggleActive,
  onRepeatQuestion,
  onNextQuestion,
  onEndInterview,
  isLastQuestion,
  disabled = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      {/* Session Timer */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold">
        <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
        <span>Session Time: {formatDuration(elapsedSeconds)}</span>
      </div>

      {/* Main Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onRepeatQuestion}
          disabled={disabled}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Repeat Question
        </Button>

        <Button
          variant={isActive ? 'secondary' : 'primary'}
          size="sm"
          onClick={onToggleActive}
          disabled={disabled}
          leftIcon={isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        >
          {isActive ? 'Pause AI' : 'Start / Resume Voice'}
        </Button>

        <Button
          size="sm"
          onClick={onNextQuestion}
          disabled={disabled}
          rightIcon={<SkipForward className="w-3.5 h-3.5" />}
        >
          {isLastQuestion ? 'Finish Round' : 'Next Question'}
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onEndInterview}
          leftIcon={<Square className="w-3.5 h-3.5" />}
        >
          End Interview
        </Button>
      </div>
    </div>
  );
};
