import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVg_P3GUIDTFZ7kmKRFE-IbQ8p0FnjaPo",
  authDomain: "fizfeed.firebaseapp.com",
  projectId: "fizfeed",
  storageBucket: "fizfeed.firebasestorage.app",
  messagingSenderId: "828025740508",
  appId: "1:828025740508:web:8ccbdfa33dee458163e819",
  measurementId: "G-LSGLE1BRFK",
};

// Prevent duplicate initialization in Expo's hot-reload environment
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
