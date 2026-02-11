// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_AUTH_API_KEY,
  authDomain: "outfit-d910e.firebaseapp.com",
  projectId: "outfit-d910e",
  storageBucket: "outfit-d910e.firebasestorage.app",
  messagingSenderId: "89814172211",
  appId: "1:89814172211:web:594d9f5fe71d18df215946"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
// const analytics = getAnalytics(app);