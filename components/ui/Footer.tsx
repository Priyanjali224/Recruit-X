import React from 'react';
import Link from 'next/link';
import { Bot, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                RECRUIT<span className="text-blue-600"> X</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise-grade AI-powered mock interview platform for technical candidates, engineering students, and hiring teams.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Interview Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/interview/setup?topic=Java" className="hover:text-blue-600">Java & OOP</Link></li>
              <li><Link href="/interview/setup?topic=DSA" className="hover:text-blue-600">Data Structures & Algo</Link></li>
              <li><Link href="/interview/setup?topic=React" className="hover:text-blue-600">React & Frontend</Link></li>
              <li><Link href="/interview/setup?topic=FullStack" className="hover:text-blue-600">Full Stack System Design</Link></li>
              <li><Link href="/interview/setup?topic=SQL" className="hover:text-blue-600">SQL & Database Internals</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Architecture & Stack
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>Next.js App Router (14+)</li>
              <li>Google Gemini 1.5 Flash AI</li>
              <li>Vapi.ai Voice Infrastructure</li>
              <li>Firebase Auth & Firestore</li>
              <li>Tailwind CSS Design System</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform & Verification
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/api-docs" className="hover:text-blue-600 font-medium text-blue-600 dark:text-blue-400">API Documentation & Tests</Link></li>
              <li><Link href="/history" className="hover:text-blue-600">Interview History</Link></li>
              <li><Link href="/analytics" className="hover:text-blue-600">Performance Analytics</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600">Candidate Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} RECRUIT X SaaS. Built with Next.js, Firebase, Gemini & Vapi.</p>
          <div className="flex items-center gap-1">
            <span>Designed for high-impact technical interview success</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
