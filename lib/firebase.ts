import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add these

const firebaseConfig = {
  apiKey: "AIzaSyD2sSl0BnyLDYTrX6WGy2tMcFBj8KHBz8Q",
  authDomain: "scrap-seva.firebaseapp.com",
  projectId: "scrap-seva",
  storageBucket: "scrap-seva.firebasestorage.app",
  messagingSenderId: "45313352100",
  appId: "1:45313352100:web:038da8318bebfa43332131",
  measurementId: "G-KS0CN74NHG"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app); // Initialize Auth
const googleProvider = new GoogleAuthProvider(); // Initialize Provider

export { app, auth, googleProvider };