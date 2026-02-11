// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_AUTH_API_KEY,
  authDomain: "outfit-ef2ce.firebaseapp.com",
  projectId: "outfit-ef2ce",
  storageBucket: "outfit-ef2ce.firebasestorage.app",
  messagingSenderId: "89064530732",
  appId: "1:89064530732:web:c89e3a3ebf18b1d6f50289"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// const analytics = getAnalytics(app);