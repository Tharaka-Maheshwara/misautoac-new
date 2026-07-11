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
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
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

/**
 * Adds a feedback document to the "Feedbacks" collection in Firestore.
 * @param {object} feedbackData - The feedback data to be saved.
 */
export const addFeedbackDocument = async (feedbackData) => {
  try {
    await addDoc(collection(db, "Feedbacks"), {
      ...feedbackData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding feedback document:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

/**
 * Fetches the latest feedbacks from Firestore.
 * @param {number} count - The number of feedbacks to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of feedback documents.
 */
export const getFeedbacks = async (count = 6) => {
  const feedbacksCol = collection(db, "Feedbacks");
  const q = query(feedbacksCol, orderBy("createdAt", "desc"), limit(count));
  const feedbackSnapshot = await getDocs(q);
  const feedbackList = feedbackSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return feedbackList;
};

export default app;
