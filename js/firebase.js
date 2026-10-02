// ==========================================================================
// THE WELLNESS EQUATION - FIREBASE CONFIGURATION (js/firebase.js)
// Responsibility: ONLY Firebase SDK initialization, Auth reference & Firestore reference
// ==========================================================================

// Import the official Firebase Modular SDK (v10) via standard CDN ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcizidyGxdCbeGS9mW35qm58lYMOCJYog",
  authDomain: "the-wellness-equation-86367.firebaseapp.com",
  projectId: "the-wellness-equation-86367",
  storageBucket: "the-wellness-equation-86367.firebasestorage.app",
  messagingSenderId: "32292411991",
  appId: "1:32292411991:web:27f5c00d0908dd5f95e112",
  measurementId: "G-H85V6YQ98N"
};

// Initialize Firebase App instance
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication service
export const auth = getAuth(app);

// Initialize Cloud Firestore with long-polling fallback to prevent WebChannel offline locks
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});

// Export the initialized app instance
export default app;
