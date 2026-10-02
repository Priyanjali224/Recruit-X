import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingStateProps {
  title?: string;
  description?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading...',
  description = 'Please wait while we process your request.',
  fullScreen = false,
  className,
}) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-950 border-t-blue-600 animate-spin" />
        <Loader2 className="w-8 h-8 text-blue-600 absolute animate-pulse" />
      </div>
      {title && <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h3>}
      {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
