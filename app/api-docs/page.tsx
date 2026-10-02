'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Send, 
  Database, 
  ShieldCheck, 
  Copy, 
  ExternalLink 
} from 'lucide-react';

interface EndpointTest {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  payload?: Record<string, any>;
  expectedStatus: number;
}

const ENDPOINTS: EndpointTest[] = [
  {
    id: 'start-interview',
    name: '1. Start Mock Interview & Generate Questions',
    method: 'POST',
    path: '/api/interview/start',
    description: 'Initializes an interview session and calls Gemini to generate structured technical questions.',
    expectedStatus: 200,
    payload: {
      userId: 'test-user-dev',
      type: 'Technical Interview',
      topic: 'Java & OOP',
      difficulty: 'Medium',
      totalQuestions: 3,
    },
  },
  {
    id: 'gen-question',
    name: '2. Dynamic Question Generation',
    method: 'POST',
    path: '/api/interview/question',
    description: 'Generates real-time interview questions on any computer science domain.',
    expectedStatus: 200,
    payload: {
      topic: 'React.js & Fiber Architecture',
      difficulty: 'Hard',
      count: 2,
    },
  },
  {
    id: 'evaluate-answer',
    name: '3. Evaluate Candidate Speech Response',
    method: 'POST',
    path: '/api/interview/evaluate',
    description: 'Assesses a single answer against technical rubrics and assigns scores and improvement tips.',
    expectedStatus: 200,
    payload: {
      question: 'What is the difference between an interface and an abstract class in Java?',
      answer: 'An interface defines a behavioral contract and supports default methods in Java 8+, while an abstract class can maintain internal state and constructors.',
      topic: 'Java & OOP',
      difficulty: 'Medium',
    },
  },
  {
    id: 'validation-error',
    name: '4. Error Validation Test (Missing Fields)',
    method: 'POST',
    path: '/api/interview/start',
    description: 'Tests API input validation when required parameters are omitted.',
    expectedStatus: 400,
    payload: {
      userId: 'test-user-invalid',
    },
  },
  {
    id: 'get-interviews',
    name: '5. Fetch User Interviews List',
    method: 'GET',
    path: '/api/interviews?userId=demo-user-123',
    description: 'Retrieves all historical interview sessions for a given user identifier.',
    expectedStatus: 200,
  },
];

export default function ApiDocsPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { status: number; body: any; time: number; passed: boolean }>>({});
  const [runningAll, setRunningAll] = useState(false);

  const runTest = async (test: EndpointTest) => {
    setActiveTest(test.id);
    const start = performance.now();
    try {
      const res = await fetch(test.path, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: test.method === 'POST' ? JSON.stringify(test.payload) : undefined,
      });

      const body = await res.json();
      const elapsed = Math.round(performance.now() - start);
      const passed = res.status === test.expectedStatus;

      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          status: res.status,
          body,
          time: elapsed,
          passed,
        },
      }));
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          status: 500,
          body: { error: err.message },
          time: elapsed,
          passed: false,
        },
      }));
    } finally {
      setActiveTest(null);
    }
  };

  const runAllTests = async () => {
    setRunningAll(true);
    for (const test of ENDPOINTS) {
      await runTest(test);
    }
    setRunningAll(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">API Verification & Report Screen</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            REST API & System Test Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live interactive runner for Figure 7.5 (Postman API Tests) and Figure 7.6 (Auth & Database Testing).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={runAllTests}
            isLoading={runningAll}
            rightIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Execute All API Tests
          </Button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-6">
        {ENDPOINTS.map((endpoint) => {
          const result = testResults[endpoint.id];
          const isRunning = activeTest === endpoint.id;

          return (
            <Card key={endpoint.id} className="p-6 bg-white border-slate-200/80 shadow-xs space-y-4">
              {/* Endpoint Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-black font-mono ${
                      endpoint.method === 'POST' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                  <span className="text-xs font-semibold text-slate-700">{endpoint.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Expected: {endpoint.expectedStatus}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runTest(endpoint)}
                    isLoading={isRunning}
                    leftIcon={<Send className="w-3.5 h-3.5 text-blue-600" />}
                  >
                    Send Request
                  </Button>
                </div>
              </div>

              <p className="text-xs text-slate-500">{endpoint.description}</p>

              {/* Request / Response Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Payload */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Request Body:
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                    {endpoint.payload ? JSON.stringify(endpoint.payload, null, 2) : '// No Request Body'}
                  </pre>
                </div>

                {/* Response Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live Server Response:
                    </span>
                    {result && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">{result.time}ms</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Status: {result.status} {result.passed ? '✓ PASSED' : '✗ FAILED'}
                        </span>
                      </div>
                    )}
                  </div>

                  <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                    {result ? JSON.stringify(result.body, null, 2) : '// Click "Send Request" to test endpoint live'}
                  </pre>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
