/// <reference types="vite/client" />
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Client-side Firebase configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyDemoDummyKeyForPlaskaPreviewClient123',
  authDomain:
    (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN ||
    `${(import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'plaska-app'}.firebaseapp.com`,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'plaska-app',
  storageBucket: `${(import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'plaska-app'}.appspot.com`,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function getClientFirebase() {
  if (typeof window === 'undefined') return { app: null, auth: null, firestore: null, googleProvider: null };

  if (!app) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
      firestore = getFirestore(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
    } catch (err) {
      console.warn('Firebase client initialization note:', err);
    }
  }

  return { app, auth, firestore, googleProvider };
}

export async function loginWithGoogle(): Promise<{ user: User | null; error?: string }> {
  const apiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
  if (!apiKey || apiKey.includes('DemoDummyKey')) {
    console.warn('VITE_FIREBASE_API_KEY tidak dikonfigurasi atau menggunakan dummy key. Masuk ke mode simulasi akun demo.');
    return {
      user: {
        uid: 'demo_user_plaska_123',
        displayName: 'Siswa Plaska (Demo Mode)',
        email: 'siswa.plaska@sekolah.sch.id',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      } as any
    };
  }

  const { auth, googleProvider } = getClientFirebase();
  if (!auth || !googleProvider) {
    return { user: null, error: 'Firebase Auth belum terhubung dengan API key asli.' };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (err: any) {
    console.warn('Google Sign-In popup notice:', err.code, err.message);
    if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/unauthorized-domain') {
      return {
        user: {
          uid: 'demo_user_plaska_123',
          displayName: 'Siswa Plaska (Demo Mode)',
          email: 'siswa.plaska@sekolah.sch.id',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        } as any,
        error: 'API Key Firebase belum valid untuk domain ini. Masuk menggunakan akun demo.'
      };
    }
    return { user: null, error: err.message || 'Login gagal.' };
  }
}

export async function logoutUser(): Promise<void> {
  const { auth } = getClientFirebase();
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut note:', err);
    }
  }
}
