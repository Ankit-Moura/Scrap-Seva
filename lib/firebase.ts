// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2sSl0BnyLDYTrX6WGy2tMcFBj8KHBz8Q",
  authDomain: "scrap-seva.firebaseapp.com",
  projectId: "scrap-seva",
  storageBucket: "scrap-seva.firebasestorage.app",
  messagingSenderId: "45313352100",
  appId: "1:45313352100:web:038da8318bebfa43332131",
  measurementId: "G-KS0CN74NHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);