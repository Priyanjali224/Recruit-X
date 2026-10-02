'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AIAvatar } from '@/components/interview/AIAvatar';
import { QuestionDisplay } from '@/components/interview/QuestionDisplay';
import { CandidateSection } from '@/components/interview/CandidateSection';
import { TranscriptPanel } from '@/components/interview/TranscriptPanel';
import { Controls } from '@/components/interview/Controls';
import { LoadingState } from '@/components/ui/LoadingState';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { 
  InterviewSession, 
  AIInterviewerStatus, 
  TranscriptMessage,
  CandidateAnswer 
} from '@/types/interview';
import { getInterviewSession, saveInterviewSession, saveFeedbackReport } from '@/lib/firebase/firestore';
import { BrowserVoiceEngine } from '@/lib/vapi/speech-fallback';
import { getVapiInstance, isVapiConfigured } from '@/lib/vapi/client';
import { generateInterviewFeedback } from '@/lib/gemini/feedback';
import { FALLBACK_QUESTIONS } from '@/lib/utils/mock-data';

export default function LiveInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  
  // Voice & Interaction State
  const [aiStatus, setAiStatus] = useState<AIInterviewerStatus>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCandidateInput, setCurrentCandidateInput] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [confirmEndModal, setConfirmEndModal] = useState(false);

  const voiceEngineRef = useRef<BrowserVoiceEngine | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Voice Engine
  useEffect(() => {
    voiceEngineRef.current = new BrowserVoiceEngine();
    return () => {
      voiceEngineRef.current?.stopAll();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Load Session
  useEffect(() => {
    async function loadSession() {
      if (!interviewId) return;
      try {
        setLoading(true);
        const data = await getInterviewSession(interviewId);
        if (data) {
          setSession(data);
          setElapsedSeconds(data.durationSeconds || 0);
        } else {
          // Fallback session if opened directly or demo mode
          const fallback: InterviewSession = {
            id: interviewId,
            userId: user?.uid || 'demo-user',
            type: 'Technical Interview',
            topic: 'Java & OOP',
            difficulty: 'Medium',
            totalQuestions: 3,
            currentQuestionIndex: 0,
            status: 'in_progress',
            questions: FALLBACK_QUESTIONS.java,
            answers: [],
            transcript: [
              {
                id: 'msg-0',
                sender: 'ai',
                text: 'Welcome to your AI technical interview session! I am your interviewer today. When you are ready, click "Start / Resume Voice" to begin.',
                timestamp: new Date().toISOString(),
              },
            ],
            startedAt: new Date().toISOString(),
          };
          setSession(fallback);
        }
      } catch (err) {
        console.error('Error loading interview session:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [interviewId, user]);

  // Session Timer
  useEffect(() => {
    if (isSessionActive && !isFinishing) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, isFinishing]);

  // Speak AI Question
  const speakAIQuestion = (text: string) => {
    if (!voiceEngineRef.current) return;
    setAiStatus('speaking');
    voiceEngineRef.current.speak(
      text,
      () => setAiStatus('speaking'),
      () => {
        setAiStatus('listening');
        if (!isMuted) {
          startListeningCandidate();
        }
      },
      () => setAiStatus('idle')
    );
  };

  // Candidate Voice Recognition
  const startListeningCandidate = () => {
    if (!voiceEngineRef.current || isMuted) return;
    setIsRecording(true);
    voiceEngineRef.current.startListening(
      (speechText, isFinal) => {
        setCurrentCandidateInput(speechText);
      },
      (err) => {
        console.warn('Speech recognition warning:', err);
      }
    );
  };

  const stopListeningCandidate = () => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopListening();
    }
    setIsRecording(false);
  };

  const handleToggleSession = () => {
    if (!session) return;

    if (!isSessionActive) {
      setIsSessionActive(true);
      const currentQ = session.questions[session.currentQuestionIndex];
      const intro = session.currentQuestionIndex === 0
        ? `Hello! Let us begin your ${session.topic} technical interview. Here is question 1: ${currentQ?.question}`
        : `Here is question ${session.currentQuestionIndex + 1}: ${currentQ?.question}`;

      // Append to transcript if not already there
      const msg: TranscriptMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: intro,
        timestamp: new Date().toISOString(),
        questionIndex: session.currentQuestionIndex,
      };

      setSession((prev) => prev ? { ...prev, transcript: [...prev.transcript, msg] } : prev);
      speakAIQuestion(intro);
    } else {
      setIsSessionActive(false);
      voiceEngineRef.current?.stopAll();
      setAiStatus('idle');
      setIsRecording(false);
    }
  };

  const handleRepeatQuestion = () => {
    if (!session) return;
    const currentQ = session.questions[session.currentQuestionIndex];
    if (currentQ) {
      speakAIQuestion(`Let me repeat the question: ${currentQ.question}`);
    }
  };

  const handleToggleMic = () => {
    if (isMuted) {
      setIsMuted(false);
      if (isSessionActive && aiStatus === 'listening') {
        startListeningCandidate();
      }
    } else {
      setIsMuted(true);
      stopListeningCandidate();
    }
  };

  // Submit Answer for current question
  const handleSubmitAnswer = async () => {
    if (!session || !currentCandidateInput.trim()) return;

    stopListeningCandidate();
    setAiStatus('thinking');

    const currentQ = session.questions[session.currentQuestionIndex];
    const answerText = currentCandidateInput.trim();

    // 1. Add Candidate Message to transcript
    const candMsg: TranscriptMessage = {
      id: `cand_${Date.now()}`,
      sender: 'candidate',
      text: answerText,
      timestamp: new Date().toISOString(),
      questionIndex: session.currentQuestionIndex,
    };

    // 2. Save Answer record
    const newAnswer: CandidateAnswer = {
      id: `ans_${Date.now()}`,
      interviewId: session.id,
      questionId: currentQ?.id || `q_${session.currentQuestionIndex}`,
      questionText: currentQ?.question || '',
      transcript: answerText,
      answeredAt: new Date().toISOString(),
    };

    const updatedAnswers = [...session.answers, newAnswer];
    const updatedTranscript = [...session.transcript, candMsg];

    setCurrentCandidateInput('');

    // Check if more questions remain
    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex < session.questions.length) {
      const nextQ = session.questions[nextIndex];
      const aiResponseText = `Thank you. That is noted. Moving to question ${nextIndex + 1}: ${nextQ.question}`;

      const aiNextMsg: TranscriptMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toISOString(),
        questionIndex: nextIndex,
      };

      const updatedSession: InterviewSession = {
        ...session,
        currentQuestionIndex: nextIndex,
        answers: updatedAnswers,
        transcript: [...updatedTranscript, aiNextMsg],
        durationSeconds: elapsedSeconds,
      };

      setSession(updatedSession);
      await saveInterviewSession(updatedSession);
      speakAIQuestion(aiResponseText);
    } else {
      // Completed all questions
      await finishInterview({
        ...session,
        answers: updatedAnswers,
        transcript: updatedTranscript,
        durationSeconds: elapsedSeconds,
        currentQuestionIndex: session.questions.length - 1,
      });
    }
  };

  const handleNextQuestion = async () => {
    if (!session) return;
    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex < session.questions.length) {
      const nextQ = session.questions[nextIndex];
      const aiResponseText = `Skipping to question ${nextIndex + 1}: ${nextQ.question}`;

      const aiNextMsg: TranscriptMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toISOString(),
        questionIndex: nextIndex,
      };

      const updatedSession: InterviewSession = {
        ...session,
        currentQuestionIndex: nextIndex,
        transcript: [...session.transcript, aiNextMsg],
        durationSeconds: elapsedSeconds,
      };

      setSession(updatedSession);
      await saveInterviewSession(updatedSession);
      speakAIQuestion(aiResponseText);
    } else {
      await finishInterview(session);
    }
  };

  const finishInterview = async (finalSession: InterviewSession) => {
    try {
      setIsFinishing(true);
      voiceEngineRef.current?.stopAll();
      setAiStatus('thinking');

      const completedSession: InterviewSession = {
        ...finalSession,
        status: 'completed',
        completedAt: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
      };

      // 1. Generate Structured Feedback using Gemini
      const feedback = await generateInterviewFeedback(completedSession);
      completedSession.score = feedback.overallScore;
      completedSession.feedbackId = feedback.id;

      // 2. Save both to Firestore
      await saveInterviewSession(completedSession);
      await saveFeedbackReport(feedback);

      // 3. Redirect to Feedback Report page
      router.push(`/interview/${finalSession.id}/feedback`);
    } catch (err) {
      console.error('Failed to complete interview feedback:', err);
      router.push(`/interview/${finalSession.id}/feedback`);
    }
  };

  if (loading || !session) {
    return <LoadingState fullScreen title="Setting up Live AI Interview Room" description="Connecting to voice synthesizer and speech recognition engine..." />;
  }

  if (isFinishing) {
    return (
      <LoadingState
        fullScreen
        title="Generating Comprehensive AI Feedback"
        description="Evaluating your responses against technical benchmarks with Google Gemini..."
      />
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isLastQuestion = session.currentQuestionIndex >= session.questions.length - 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Controls Bar */}
      <Controls
        elapsedSeconds={elapsedSeconds}
        isActive={isSessionActive}
        onToggleActive={handleToggleSession}
        onRepeatQuestion={handleRepeatQuestion}
        onNextQuestion={handleNextQuestion}
        onEndInterview={() => setConfirmEndModal(true)}
        isLastQuestion={isLastQuestion}
      />

      {/* Main Interview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Area (7 cols): AI Interviewer & Question & Candidate Speech */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Avatar */}
          <AIAvatar
            status={aiStatus}
            name="Alex — Senior AI Interviewer"
          />

          {/* Current Question Display */}
          <QuestionDisplay
            question={currentQuestion}
            currentIndex={session.currentQuestionIndex}
            totalQuestions={session.totalQuestions}
            topic={session.topic}
          />

          {/* Candidate Voice / Input Section */}
          <CandidateSection
            isRecording={isRecording}
            isMuted={isMuted}
            transcript={currentCandidateInput}
            onToggleMic={handleToggleMic}
            onSubmitAnswer={handleSubmitAnswer}
            onTranscriptChange={setCurrentCandidateInput}
            userName={user?.displayName}
            disabled={!isSessionActive}
          />
        </div>

        {/* Right Area (5 cols): Dynamic Live Transcript Panel */}
        <div className="lg:col-span-5">
          <TranscriptPanel
            messages={session.transcript}
            currentSpeech={isRecording && !isMuted ? currentCandidateInput : undefined}
            isAiSpeaking={aiStatus === 'speaking'}
          />
        </div>
      </div>

      {/* Confirmation Modal to End Interview */}
      <Modal
        isOpen={confirmEndModal}
        onClose={() => setConfirmEndModal(false)}
        title="End Mock Interview?"
        description="Are you sure you want to conclude this session early? Gemini will generate your feedback based on questions answered so far."
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setConfirmEndModal(false)}>
            Resume Interview
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setConfirmEndModal(false);
              finishInterview(session);
            }}
          >
            Conclude & View Feedback
          </Button>
        </div>
      </Modal>
    </div>
  );
}
