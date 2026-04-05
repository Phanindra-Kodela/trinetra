import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCl0cl_OVuIJqpqOwVEcBhc_0fQ0lUwnls",
  authDomain: "trinetra-game.firebaseapp.com",
  projectId: "trinetra-game",
  storageBucket: "trinetra-game.firebasestorage.app",
  messagingSenderId: "125179785125",
  appId: "1:125179785125:web:64f0eefe8b906a0146424c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Logged in silently! Player ID:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Auth Error:", error);
  }
};