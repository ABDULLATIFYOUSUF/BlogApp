import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3fUZXVUny2zJ-pKsqDZyYWK4z60fPGKE",
  authDomain: "ndprojectfirebase.firebaseapp.com",
  projectId: "ndprojectfirebase",
  storageBucket: "ndprojectfirebase.appspot.com",
  messagingSenderId: "646198723982",
  appId: "1:646198723982:web:366110f2cbc1229d5190df",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

export {
  storage,
  app,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  db,
  setDoc,
  signOut,
  onAuthStateChanged,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
};
