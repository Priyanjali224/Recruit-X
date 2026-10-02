import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { INTERVIEW_CATEGORIES } from '@/lib/utils/mock-data';
import { 
  Coffee, 
  Binary, 
  Database, 
  Layers, 
  Cpu, 
  Network, 
  Code2, 
  Atom, 
  Server, 
  Play, 
  Sparkles 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Coffee,
  Binary,
  Database,
  Layers,
  Cpu,
  Network,
  Code2,
  Atom,
  Server,
};

export const CategoryGrid: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Choose Interview Category</h2>
          <p className="text-xs text-slate-500">
            Select a specialized technical module to start an AI mock interview
          </p>
        </div>
        <Link href="/interview/setup">
          <Button size="sm" variant="outline" rightIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}>
            Custom Setup
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INTERVIEW_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Server;
          return (
            <Card
              key={cat.id}
              hoverEffect
              className="flex flex-col justify-between p-5 border-slate-200/80 bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={cat.difficulty === 'Hard' ? 'danger' : 'warning'}>
                    {cat.difficulty}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                  {cat.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">~{cat.questionCount} Questions</span>
                <Link href={`/interview/setup?topic=${encodeURIComponent(cat.name)}`}>
                  <Button size="sm" rightIcon={<Play className="w-3.5 h-3.5" />}>
                    Start Interview
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
