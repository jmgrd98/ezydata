import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZIHh4LbNVoWmDzpJG8Vyhltdb6H9qxlk",
  authDomain: "ezydata-82af5.firebaseapp.com",
  projectId: "ezydata-82af5",
  storageBucket: "ezydata-82af5.firebasestorage.app",
  messagingSenderId: "1039245567079",
  appId: "1:1039245567079:web:950b6dc65942087772a0c2",
  measurementId: "G-EP3NFWBBDC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export interface Project {
  id?: string;
  name: string;
  table: string;
  chart: string;
  ownerId: string;
  createdAt?: Date;
}

export { app, db, auth, storage };
