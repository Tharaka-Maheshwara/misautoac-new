import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js වලදී Server-side rendering නිසා app එක double initialize වීම වැළැක්වීමට මෙසේ සිදු කරයි
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// අවශ්‍ය Firebase services export කරගැනීම
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Creates a user document in Firestore.
 * @param {import("firebase/auth").User} user - The user object from Firebase Auth.
 * @param {object} additionalData - Additional data to merge into the user document.
 */
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, "Users", user.uid);

  const userData = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
    role: "User",
    ...additionalData,
  };

  try {
    // Use setDoc to create or overwrite a document
    await setDoc(userRef, userData);
  } catch (error) {
    console.error("Error creating user document in Firestore:", error);
  }
};

export default app;
