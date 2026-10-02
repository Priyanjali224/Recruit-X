'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { InterviewType, InterviewDifficulty, InterviewSession } from '@/types/interview';
import { generateInterviewQuestions } from '@/lib/gemini/questions';
import { saveInterviewSession } from '@/lib/firebase/firestore';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Flame, 
  Sliders, 
  Bot, 
  ShieldCheck, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const INTERVIEW_TYPES: { value: InterviewType; label: string; desc: string }[] = [
  { value: 'Technical Interview', label: 'Technical Core', desc: 'Deep dive into language syntax, concurrency, internal mechanics, and architecture.' },
  { value: 'Coding Interview', label: 'Data Structures & Algorithms', desc: 'Algorithmic complexity, optimal patterns, data structures, and edge cases.' },
  { value: 'Full Stack Interview', label: 'Full Stack & System Design', desc: 'End-to-end APIs, frontend state, microservices, databases, and scalability.' },
  { value: 'HR Interview', label: 'Behavioral & Leadership', desc: 'Culture fit, STAR framework scenarios, conflict resolution, and career vision.' },
];

const PRESET_TOPICS = [
  'Java & OOP',
  'Data Structures & Algorithms',
  'React.js & Next.js',
  'Modern JavaScript (ES6+)',
  'SQL & Database Design',
  'DBMS Internals',
  'Operating Systems',
  'Computer Networks',
  'Full Stack & System Design',
  'Python & Backend Development',
  'Go & Microservices',
];

function InterviewSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [selectedType, setSelectedType] = useState<InterviewType>('Technical Interview');
  const [selectedTopic, setSelectedTopic] = useState<string>('Java & OOP');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      if (PRESET_TOPICS.includes(topicParam)) {
        setSelectedTopic(topicParam);
        setIsCustomTopic(false);
      } else {
        setSelectedTopic('Other');
        setCustomTopic(topicParam);
        setIsCustomTopic(true);
      }
    }
  }, [searchParams]);

  const handleStartInterview = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const finalTopic = isCustomTopic ? (customTopic.trim() || 'General Engineering') : selectedTopic;

    try {
      setIsGenerating(true);
      setError(null);

      // 1. Generate questions using Gemini layer
      const questions = await generateInterviewQuestions({
        type: selectedType,
        topic: finalTopic,
        difficulty,
        count: questionCount,
      });

      // 2. Create Interview Session
      const interviewId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newSession: InterviewSession = {
        id: interviewId,
        userId: user.uid,
        type: selectedType,
        topic: finalTopic,
        difficulty,
        totalQuestions: questions.length,
        currentQuestionIndex: 0,
        status: 'in_progress',
        questions,
        answers: [],
        transcript: [
          {
            id: `msg_init`,
            sender: 'ai',
            text: `Hello ${user.displayName || 'Candidate'}, welcome to your ${difficulty} level ${selectedType} on ${finalTopic}. Whenever you are ready, I will ask your first question.`,
            timestamp: new Date().toISOString(),
          },
        ],
        startedAt: new Date().toISOString(),
      };

      // 3. Save to Firestore
      await saveInterviewSession(newSession);

      // 4. Navigate to live interview room
      router.push(`/interview/${interviewId}`);
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setError(err.message || 'Failed to initialize AI interview. Please try again.');
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return <LoadingState fullScreen title="Verifying Authentication" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <Badge variant="primary" className="mb-2">Session Customizer</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your interview track, topic depth, and difficulty to match your upcoming hiring bar.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <Card className="p-6 sm:p-8 space-y-8 bg-white border-slate-200/80 shadow-md">
        {/* 1. Track Type */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            1. Select Interview Track
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTERVIEW_TYPES.map((type) => {
              const isSelected = selectedType === type.value;
              return (
                <div
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{type.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Technical Topic */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            2. Topic & Engineering Focus
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_TOPICS.map((topic) => {
              const isSelected = !isCustomTopic && selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setIsCustomTopic(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsCustomTopic(true)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                isCustomTopic
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              + Custom Topic...
            </button>
          </div>

          {isCustomTopic && (
            <div className="mt-3 animate-in fade-in duration-150">
              <Input
                label="Specify Custom Subject or Technology"
                placeholder="e.g. Distributed Caching with Redis & Kafka"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* 3. Difficulty Level & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as InterviewDifficulty[]).map((level) => {
                const isSelected = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? level === 'Easy'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : level === 'Medium'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              4. Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((cnt) => {
                const isSelected = questionCount === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Action */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Voice & Audio will be enabled in next screen</span>
          </div>

          <Button
            size="lg"
            className="w-full sm:w-auto px-8"
            onClick={handleStartInterview}
            isLoading={isGenerating}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {isGenerating ? 'Generating AI Questions...' : 'Start AI Interview'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function InterviewSetupPage() {
  return (
    <React.Suspense fallback={<LoadingState fullScreen title="Loading Interview Setup" />}>
      <InterviewSetupContent />
    </React.Suspense>
  );
}
