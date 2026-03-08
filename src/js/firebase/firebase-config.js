// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxoIf7psNn_zdYD7mbEsaQVMsO5Luqj2U",
    authDomain: "bonobo-store-v2.firebaseapp.com",
    projectId: "bonobo-store-v2",
    storageBucket: "bonobo-store-v2.firebasestorage.app",
    messagingSenderId: "534458348919",
    appId: "1:534458348919:web:88a203fda4270903ae9d72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export Firebase services
export { auth, db, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, limit };
