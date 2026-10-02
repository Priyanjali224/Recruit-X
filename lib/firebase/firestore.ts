import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { db } from './client';
import { InterviewSession, CandidateAnswer, TranscriptMessage } from '@/types/interview';
import { FeedbackReport } from '@/types/feedback';
import { UserAnalytics } from '@/types/analytics';
import { isFirebaseConfigured } from './config';
import { SAMPLE_FEEDBACK_REPORT } from '../utils/mock-data';

const LOCAL_STORAGE_INTERVIEWS_KEY = 'recruit_x_interviews';
const LOCAL_STORAGE_FEEDBACK_KEY = 'recruit_x_feedback';

// Helper to get local data fallback
function getLocalInterviews(): InterviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INTERVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalInterviews(interviews: InterviewSession[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_INTERVIEWS_KEY, JSON.stringify(interviews));
}

function getLocalFeedbackList(): FeedbackReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFeedback(feedback: FeedbackReport) {
  if (typeof window === 'undefined') return;
  const list = getLocalFeedbackList().filter(f => f.id !== feedback.id && f.interviewId !== feedback.interviewId);
  list.push(feedback);
  localStorage.setItem(LOCAL_STORAGE_FEEDBACK_KEY, JSON.stringify(list));
}

export async function saveInterviewSession(session: InterviewSession): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    const list = getLocalInterviews().filter(i => i.id !== session.id);
    list.unshift(session);
    saveLocalInterviews(list);
    return;
  }

  const interviewRef = doc(db, 'interviews', session.id);
  await setDoc(interviewRef, session, { merge: true });
}

export async function getInterviewSession(interviewId: string): Promise<InterviewSession | null> {
  if (!isFirebaseConfigured() || !db) {
    const list = getLocalInterviews();
    const found = list.find(i => i.id === interviewId);
    return found || null;
  }

  const docSnap = await getDoc(doc(db, 'interviews', interviewId));
  if (docSnap.exists()) {
    return docSnap.data() as InterviewSession;
  }
  return null;
}

export async function getUserInterviews(userId: string): Promise<InterviewSession[]> {
  if (!isFirebaseConfigured() || !db) {
    const list = getLocalInterviews();
    return list.filter(i => !userId || i.userId === userId);
  }

  try {
    const q = query(
      collection(db, 'interviews'),
      where('userId', '==', userId),
      orderBy('startedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as InterviewSession);
  } catch (err) {
    console.warn('Error fetching user interviews:', err);
    return [];
  }
}

export async function saveFeedbackReport(feedback: FeedbackReport): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    saveLocalFeedback(feedback);
    return;
  }

  await setDoc(doc(db, 'feedback', feedback.id), feedback);
  // Also update interview status
  if (feedback.interviewId) {
    try {
      await updateDoc(doc(db, 'interviews', feedback.interviewId), {
        status: 'completed',
        score: feedback.overallScore,
        feedbackId: feedback.id,
        completedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not update interview status with feedback', e);
    }
  }
}

export async function getFeedbackReport(interviewId: string): Promise<FeedbackReport | null> {
  if (!isFirebaseConfigured() || !db) {
    const list = getLocalFeedbackList();
    const found = list.find(f => f.interviewId === interviewId || f.id === interviewId);
    if (found) return found;
    // Return sample feedback if demo interview
    if (interviewId.includes('demo') || list.length === 0) {
      return { ...SAMPLE_FEEDBACK_REPORT, interviewId };
    }
    return null;
  }

  try {
    const q = query(collection(db, 'feedback'), where('interviewId', '==', interviewId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as FeedbackReport;
    }
    const directSnap = await getDoc(doc(db, 'feedback', interviewId));
    if (directSnap.exists()) {
      return directSnap.data() as FeedbackReport;
    }
  } catch (e) {
    console.warn('Error retrieving feedback report', e);
  }
  return null;
}

export async function getUserAnalytics(userId: string): Promise<UserAnalytics> {
  const interviews = await getUserInterviews(userId);
  
  const completed = interviews.filter(i => i.status === 'completed' && typeof i.score === 'number');
  const totalInterviews = interviews.length;
  const completedCount = completed.length;
  
  const totalScore = completed.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 0;
  
  let totalQuestionsAnswered = 0;
  let totalTimeSpentSeconds = 0;
  
  const categoryPerformance: Record<string, { count: number; averageScore: number; sum: number }> = {};
  const difficultyPerformance: Record<string, { count: number; averageScore: number; sum: number }> = {};
  
  interviews.forEach(i => {
    totalQuestionsAnswered += i.answers?.length || 0;
    totalTimeSpentSeconds += i.durationSeconds || 0;
    
    // Category aggregation
    const cat = i.topic || 'General';
    if (!categoryPerformance[cat]) {
      categoryPerformance[cat] = { count: 0, averageScore: 0, sum: 0 };
    }
    categoryPerformance[cat].count += 1;
    if (typeof i.score === 'number') {
      categoryPerformance[cat].sum += i.score;
    }

    // Difficulty aggregation
    const diff = i.difficulty || 'Medium';
    if (!difficultyPerformance[diff]) {
      difficultyPerformance[diff] = { count: 0, averageScore: 0, sum: 0 };
    }
    difficultyPerformance[diff].count += 1;
    if (typeof i.score === 'number') {
      difficultyPerformance[diff].sum += i.score;
    }
  });

  const categoryResult: Record<string, { count: number; averageScore: number }> = {};
  Object.keys(categoryPerformance).forEach(cat => {
    const item = categoryPerformance[cat];
    categoryResult[cat] = {
      count: item.count,
      averageScore: item.count > 0 ? Math.round(item.sum / item.count) : 0,
    };
  });

  const difficultyResult: Record<string, { count: number; averageScore: number }> = {};
  Object.keys(difficultyPerformance).forEach(diff => {
    const item = difficultyPerformance[diff];
    difficultyResult[diff] = {
      count: item.count,
      averageScore: item.count > 0 ? Math.round(item.sum / item.count) : 0,
    };
  });

  const scoreHistory = completed.map(i => ({
    interviewId: i.id,
    date: i.completedAt || i.startedAt,
    topic: i.topic,
    score: i.score || 0,
    type: i.type,
  }));

  return {
    totalInterviews,
    completedInterviews: completedCount,
    averageScore,
    averageTechnicalScore: averageScore ? Math.min(100, Math.round(averageScore * 1.02)) : 0,
    averageCommunicationScore: averageScore ? Math.min(100, Math.round(averageScore * 0.98)) : 0,
    averageProblemSolvingScore: averageScore ? Math.min(100, Math.round(averageScore * 0.95)) : 0,
    totalQuestionsAnswered,
    totalTimeSpentSeconds,
    categoryPerformance: categoryResult,
    difficultyPerformance: difficultyResult,
    scoreHistory,
  };
}
