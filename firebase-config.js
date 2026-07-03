// 1. Import the Firebase tools we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. PASTE YOUR FIREBASE CODE HERE:
const firebaseConfig = {
  apiKey: "AIzaSyB_0DktwkDYgFRESLem9nn_X4z1pLz4Psk",
  authDomain: "news-d5bb0.firebaseapp.com",
  projectId: "news-d5bb0",
  storageBucket: "news-d5bb0.firebasestorage.app",
  messagingSenderId: "316261742727",
  appId: "1:316261742727:web:d7f1efbf31f538f7966022",
  measurementId: "G-XZ6QZHDFQK"
};

// 3. Initialize Firebase and the Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
