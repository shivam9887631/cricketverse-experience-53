
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3sT4F1M4xPQvRgBou_oeaatJygISvpfk",
  authDomain: "local-cricket-app-20420.firebaseapp.com",
  projectId: "local-cricket-app-20420",
  storageBucket: "local-cricket-app-20420.firebasestorage.app",
  messagingSenderId: "182481594796",
  appId: "1:182481594796:web:e0cc34e4eba4bc1266f209",
  measurementId: "G-2S6YZH7FJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };
