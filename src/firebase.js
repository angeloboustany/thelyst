// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  addDoc,
  getDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,  
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWt063Z30bd9YUmLCrUemEMRPA9uf6IOI",
  authDomain: "thelyst-firebase.firebaseapp.com",
  projectId: "thelyst-firebase",
  storageBucket: "thelyst-firebase.firebasestorage.app",
  messagingSenderId: "928071509454",
  appId: "1:928071509454:web:85c4f33cfba55c4324779f",
  measurementId: "G-9FYRKEY9MC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  signOut,
  db,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  analytics,
};