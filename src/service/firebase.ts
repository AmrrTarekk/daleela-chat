import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to emulators in development environment
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Check if we're in development and running locally
  const isEmulator = process.env.NEXT_USE_FIREBASE_EMULATOR === "true";

  if (isEmulator) {
    try {
      // Connect to Firebase Auth emulator
      connectAuthEmulator(auth, "http://localhost:9099");

      // Connect to Firestore emulator
      connectFirestoreEmulator(db, "localhost", 8080);

      // Connect to Functions emulator
      connectFunctionsEmulator(functions, "localhost", 5001);

      console.log("Connected to Firebase emulators");
    } catch (error) {
      console.log("Emulators already connected or error connecting:", error);
    }
  }
}

export default app;
