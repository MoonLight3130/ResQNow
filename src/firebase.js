import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu68po0dW7zhRN_e9_xvnr_nkS1pyb-uc",
  authDomain: "resqnow-9e907.firebaseapp.com",
  projectId: "resqnow-9e907",
  storageBucket: "resqnow-9e907.firebasestorage.app",
  messagingSenderId: "424989665504",
  appId: "1:424989665504:web:62f30ffe98a67030f84885"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
