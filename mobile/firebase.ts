import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const env = process.env as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBVg_P3GUIDTFZ7kmKRFE-IbQ8p0FnjaPo",
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "fizfeed.firebaseapp.com",
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "fizfeed",
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "fizfeed.firebasestorage.app",
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "828025740508",
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:828025740508:web:8ccbdfa33dee458163e819",
  measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LSGLE1BRFK",
};

// Prevent duplicate initialization in Expo's hot-reload environment
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
