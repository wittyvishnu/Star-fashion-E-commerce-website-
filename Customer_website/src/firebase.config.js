import { getAuth } from 'firebase/auth';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB82dNRrywo7YEqFFpajN6yaZtTk4jYmZU",
  authDomain: "online-boutique-5bd4e.firebaseapp.com",
  projectId: "online-boutique-5bd4e",
  storageBucket: "online-boutique-5bd4e.firebasestorage.app",
  messagingSenderId: "869265948572",
  appId: "1:869265948572:web:b90e10343eb624a3795259",
  measurementId: "G-V5FBJW07S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const  auth = getAuth(app);


