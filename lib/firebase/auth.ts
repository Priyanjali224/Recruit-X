import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from './client';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '@/types/auth';
import { isFirebaseConfigured } from './config';

const DEMO_USER_KEY = 'recruit_x_local_user';

export async function signUpWithEmail(name: string, email: string, password: string): Promise<UserProfile> {
  if (!isFirebaseConfigured()) {
    // Local demo mode for quick testing if Firebase is not connected yet
    const demoUser: UserProfile = {
      uid: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      experienceLevel: 'Mid',
      targetRole: 'Full Stack Engineer',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    }
    return demoUser;
  }

  if (!auth) throw new Error('Firebase Auth is not initialized');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name,
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  });

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: name,
    photoURL: user.photoURL,
    createdAt: new Date().toISOString(),
    experienceLevel: 'Mid',
    targetRole: 'Software Engineer',
  };

  if (db) {
    try {
      await setDoc(doc(db, 'users', user.uid), profile);
    } catch (err) {
      console.warn('Could not save user profile doc in Firestore:', err);
    }
  }

  return profile;
}

export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  if (!isFirebaseConfigured()) {
    // Local demo authentication
    const existing = typeof window !== 'undefined' ? localStorage.getItem(DEMO_USER_KEY) : null;
    let profile: UserProfile;
    if (existing) {
      profile = JSON.parse(existing);
      profile.email = email;
    } else {
      profile = {
        uid: 'demo-user-123',
        email,
        displayName: email.split('@')[0] || 'Candidate',
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        createdAt: new Date().toISOString(),
        experienceLevel: 'Mid',
        targetRole: 'Software Engineer',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(profile));
      }
    }
    return profile;
  }

  if (!auth) throw new Error('Firebase Auth is not initialized');

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  let profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Candidate',
    photoURL: user.photoURL,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        profile = userDoc.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Could not fetch user profile from Firestore:', err);
    }
  }

  return profile;
}

export async function signOutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_USER_KEY);
  }
  if (isFirebaseConfigured() && auth) {
    await fbSignOut(auth);
  }
}

export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(DEMO_USER_KEY);
      if (local) {
        try {
          callback(JSON.parse(local));
          return () => {};
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
    return () => {};
  }

  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      let profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Candidate',
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      };
      if (db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            profile = userDoc.data() as UserProfile;
          }
        } catch (e) {
          console.warn('Error reading user profile', e);
        }
      }
      callback(profile);
    } else {
      callback(null);
    }
  });
}
