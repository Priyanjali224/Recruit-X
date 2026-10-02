'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { InterviewSession } from '@/types/interview';
import { getUserInterviews } from '@/lib/firebase/firestore';
import { formatDate, formatDuration, getScoreBadgeClass, getDifficultyBadgeClass } from '@/lib/utils/formatters';
import { 
  History as HistoryIcon, 
  FileText, 
  Play, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    async function loadHistory() {
      if (!user) return;
      try {
        setLoading(true);
        const list = await getUserInterviews(user.uid);
        setInterviews(list);
      } catch (err) {
        console.error('Error fetching interview history:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadHistory();
    }
  }, [user, authLoading, router]);

  const filteredInterviews = interviews.filter((item) => {
    const matchesQuery = item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || item.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesQuery && matchesDifficulty && matchesType;
  });

  if (authLoading || loading) {
    return <LoadingState fullScreen title="Loading Interview History" description="Fetching all previous mock interview sessions from Firestore..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">Historical Records</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview History & Archives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past transcripts, evaluation scores, and track your practice progression.
          </p>
        </div>
        <Link href="/interview/setup">
          <Button size="sm" rightIcon={<Play className="w-3.5 h-3.5" />}>
            New Mock Interview
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search topic or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            options={[
              { value: 'all', label: 'All Difficulties' },
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Tracks' },
              { value: 'Technical Interview', label: 'Technical Interview' },
              { value: 'Coding Interview', label: 'Coding Interview' },
              { value: 'Full Stack Interview', label: 'Full Stack Interview' },
              { value: 'HR Interview', label: 'HR Interview' },
            ]}
          />
        </div>
      </Card>

      {/* Interviews Table / List */}
      {filteredInterviews.length === 0 ? (
        <EmptyState
          title="No interview records found"
          description={
            searchQuery || filterDifficulty !== 'all' || filterType !== 'all'
              ? 'Try changing your search query or reset filters.'
              : 'You have not conducted any mock interviews yet. Launch your first session now!'
          }
          actionLabel="Start Mock Interview"
          onAction={() => router.push('/interview/setup')}
          icon={<HistoryIcon className="w-7 h-7" />}
        />
      ) : (
        <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredInterviews.map((item) => {
            const isCompleted = item.status === 'completed';

            return (
              <div
                key={item.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{item.topic}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadgeClass(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                    <Badge variant={isCompleted ? 'success' : 'warning'}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.startedAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {item.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDuration(item.durationSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end lg:self-center">
                  {isCompleted && typeof item.score === 'number' && (
                    <div className={`px-3.5 py-1.5 rounded-xl border text-sm font-black ${getScoreBadgeClass(item.score)}`}>
                      {item.score}/100
                    </div>
                  )}

                  {isCompleted ? (
                    <Link href={`/interview/${item.id}/feedback`}>
                      <Button size="sm" variant="outline" leftIcon={<FileText className="w-3.5 h-3.5 text-blue-600" />}>
                        View Report
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/interview/${item.id}`}>
                      <Button size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
                        Resume Session
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
