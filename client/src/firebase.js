// src/firebase.js

// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF8eOJNCqRiAUY6Vie2FozFG9zEelwnJw",
  authDomain: "fastclaim-2932a.firebaseapp.com",
  projectId: "fastclaim-2932a",
  storageBucket: "fastclaim-2932a.appspot.com",
  messagingSenderId: "327517745362",
  appId: "1:327517745362:web:b6319286e851bbab157d0b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);         // 🔥 Firestore for user data
export const storage = getStorage(app);      // 📦 Firebase Storage for profile pics
