// src/firebase.js
// src/auth/firebase.jsx
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GithubAuthProvider, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics'; // Import Analytics functions


const firebaseConfig = {
  apiKey: "AIzaSyArLK5jZgRQWHBFKrg-EqwKj1fhZSDiXhA",
  authDomain: "multitools-7cd14.firebaseapp.com",
  projectId: "multitools-7cd14",
  storageBucket: "multitools-7cd14.appspot.com",
  messagingSenderId: "334591951841",
  appId: "1:334591951841:web:cbf23c369498ed0d5b88a0",
  measurementId: "G-TVB2LEP2C7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

let analytics = null;

// Conditionally initialize Analytics
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.error("Error initializing Firebase Analytics:", error);
  });
}

export { auth, githubProvider, facebookProvider, googleProvider, analytics };


