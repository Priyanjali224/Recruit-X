'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Bot, 
  Mic, 
  Sparkles, 
  BarChart3, 
  CheckCircle2, 
  BrainCircuit, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  Play, 
  ArrowRight,
  Terminal,
  Cpu,
  Flame,
  Award,
  Zap,
  MessageSquareCode
} from 'lucide-react';
import { INTERVIEW_CATEGORIES } from '@/lib/utils/mock-data';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 blur-3xl overflow-hidden -z-10">
        <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
        <div className="absolute top-[100px] right-[15%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500"></div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Next-Gen AI Mock Interview Platform for Software Engineers</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.12]">
            Ace Your Next Tech Interview with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Realistic Voice AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Practice real-time technical rounds with an intelligent voice interviewer. Get dynamically generated questions, instant speech evaluations, detailed performance rubrics, and targeted growth insights.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/interview/setup" : "/signup"}>
              <Button size="lg" className="w-full sm:w-auto px-8 text-base shadow-xl shadow-blue-500/25" rightIcon={<ArrowRight className="w-5 h-5" />}>
                {user ? "Start Mock Interview" : "Get Started Free"}
              </Button>
            </Link>
            <Link href={user ? "/dashboard" : "/signin"}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Play className="w-4 h-4 text-blue-600" />}>
                {user ? "Open Dashboard" : "Candidate Sign In"}
              </Button>
            </Link>
          </div>

          {/* Social Proof / Trust Banner */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-6">
              Tailored tracks across core engineering domains
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-500 font-medium text-sm">
              <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-blue-600" /> Java & OOP</span>
              <span className="flex items-center gap-1.5"><BrainCircuit className="w-4 h-4 text-indigo-600" /> DSA & Algorithms</span>
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-cyan-600" /> React & Frontend</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-purple-600" /> System Design & OS</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> SQL & DBMS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Voice AI Demo Preview Screen */}
      <section className="py-12 bg-gradient-to-b from-transparent via-slate-100/60 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl p-4 sm:p-8 backdrop-blur-xl overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono text-slate-400">recruit-x.app/interview/live</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">● AI Voice Connected</Badge>
                <Badge variant="primary">Question 2 of 5</Badge>
              </div>
            </div>

            {/* Simulated Live Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: AI Avatar & Question */}
              <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                      <Bot className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Alex — Senior Technical Interviewer</h4>
                      <p className="text-xs text-blue-300">Speaking to Candidate...</p>
                    </div>
                  </div>
                  {/* Sound waves animation */}
                  <div className="flex items-end gap-1 h-6">
                    <span className="w-1 bg-blue-400 rounded-full animate-soundwave-1"></span>
                    <span className="w-1 bg-blue-400 rounded-full animate-soundwave-2"></span>
                    <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-3"></span>
                    <span className="w-1 bg-blue-400 rounded-full animate-soundwave-4"></span>
                    <span className="w-1 bg-indigo-400 rounded-full animate-soundwave-5"></span>
                  </div>
                </div>

                <div className="my-8 bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Current Question</span>
                  <p className="text-base sm:text-lg font-medium text-slate-100 mt-1">
                    "What is the fundamental difference between an interface and an abstract class in Java, and when would you use default methods introduced in Java 8?"
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Topic: Core Java & OOP</span>
                  <span>Target Difficulty: Medium</span>
                </div>
              </div>

              {/* Right: Live Transcript & Candidate Audio */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Transcript</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Real-Time Sync</span>
                  </div>

                  <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1 text-xs">
                    <div className="bg-blue-50/70 border border-blue-100 p-2.5 rounded-xl">
                      <span className="font-semibold text-blue-700 block mb-0.5">AI Interviewer</span>
                      <p className="text-slate-700">"Welcome! Let us dive into Java object-oriented design principles."</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xs">
                      <span className="font-semibold text-slate-900 block mb-0.5">You (Candidate)</span>
                      <p className="text-slate-700">"An interface defines a behavioral contract without state, whereas an abstract class can maintain instance state and constructors..."</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                    <span>Listening for answer...</span>
                  </div>
                  <Link href="/interview/setup">
                    <Button size="sm">Try Sample</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">Simulated Hiring Pipeline</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How RECRUIT X Works
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            A frictionless, 4-step workflow designed to build muscle memory and interview confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Select Track & Level',
              desc: 'Choose from Java, DSA, React, System Design, SQL, and set your target difficulty level from Easy to Hard.',
              icon: Layers,
            },
            {
              step: '02',
              title: 'AI Generates Questions',
              desc: 'Google Gemini dynamically generates realistic, context-aware technical questions testing core depth.',
              icon: BrainCircuit,
            },
            {
              step: '03',
              title: 'Interactive Voice Round',
              desc: 'Vapi.ai powers low-latency conversational audio. Speak your answers naturally and field follow-up questions.',
              icon: Mic,
            },
            {
              step: '04',
              title: 'Comprehensive Feedback',
              desc: 'Receive category-by-category scorecards, key missed points, and actionable guidance for career growth.',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                <Card hoverEffect className="h-full border-slate-200/80 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="info" className="mb-3">Full Suite of Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Production Interview Readiness
            </h2>
            <p className="mt-4 text-slate-600">
              Everything you need to master technical discussions, articulate trade-offs, and track interview performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Natural Voice Conversations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Powered by Vapi.ai and browser speech engines. Experience human-like verbal cadence, interruptions, and intelligent follow-ups.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-5">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Gemini-Powered Intelligence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dynamically constructs questions targeting core software fundamentals, concurrency, memory architectures, and complex data structures.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Performance Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track historical scores across categories, difficulty curves, response times, and identify blind spots with Firestore analytics.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-600 flex items-center justify-center mb-5">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Detailed Question Rubrics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review exact question transcripts, key points you covered, key points you missed, and customized improvement tips.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Difficulty Flexibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Easily toggle between Easy, Medium, and Hard challenges to test your progression from junior engineer to senior architect.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Firebase Infrastructure</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Protected user profiles, encrypted tokens, strict Firestore security rules, and confidential interview history storage.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Explore Topics Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge variant="primary" className="mb-2">Category Catalog</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900">Explore Interview Tracks</h2>
            <p className="text-slate-600 mt-2 text-sm">Choose from curated technical modules or customize your own session.</p>
          </div>
          <Link href="/interview/setup" className="mt-4 md:mt-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Configure Custom Track
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTERVIEW_CATEGORIES.slice(0, 6).map((cat) => (
            <Card key={cat.id} hoverEffect className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {cat.category}
                  </span>
                  <Badge variant={cat.difficulty === 'Hard' ? 'danger' : 'warning'}>
                    {cat.difficulty}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{cat.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cat.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={`/interview/setup?topic=${encodeURIComponent(cat.name)}`}>
                <Button variant="outline" size="sm" className="w-full" rightIcon={<Play className="w-3 h-3 text-blue-600" />}>
                  Start Practice
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Ace Your Next Technical Interview?
          </h2>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of developers leveling up their technical interview skills with real-time AI voice feedback.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create Free Account
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
