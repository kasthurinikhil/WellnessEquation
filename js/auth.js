// ==========================================================================
// THE WELLNESS EQUATION - AUTHENTICATION LOGIC (js/auth.js)
// Responsibility: ONLY authentication handlers (sign up, login, logout, auth state guards)
// ==========================================================================

import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* --------------------------------------------------------------------------
   1. Helper: Format Firebase Auth Errors into Friendly Messages
   -------------------------------------------------------------------------- */
export function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-not-found":
      return "No account found with this email address. Please sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please double-check and try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again in a few minutes.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled. Please enable it in your Firebase Console (Authentication > Sign-in method).";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "Invalid Firebase API Key. Please paste your valid Firebase configuration keys in js/firebase.js.";
    case "auth/configuration-not-found":
      return "Firebase configuration not found. Please verify your settings in js/firebase.js.";
    default:
      return `Authentication error (${errorCode || "Unknown"}). Please verify your credentials or Firebase configuration.`;
  }
}

/* --------------------------------------------------------------------------
   2. UI Helper: Display / Clear Alerts
   -------------------------------------------------------------------------- */
function showAuthMessage(messageElement, text, type = "error") {
  if (!messageElement) return;
  messageElement.textContent = text;
  messageElement.className = `auth-message auth-message-${type}`;
}

function clearAuthMessage(messageElement) {
  if (!messageElement) return;
  messageElement.textContent = "";
  messageElement.className = "auth-message auth-message-hidden";
}

/* --------------------------------------------------------------------------
   3. Core Authentication Functions
   -------------------------------------------------------------------------- */

/**
 * Register a new user with Firebase Authentication
 * Note: Passwords are encrypted by Firebase and NEVER saved to Firestore.
 */
export async function signUpUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in an existing user with Firebase Authentication
 */
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the currently authenticated user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Failed to log out. Please try again.");
  }
}

/* --------------------------------------------------------------------------
   4. Form Listeners & Initialization
   -------------------------------------------------------------------------- */
function initAuth() {
  console.log("[The Wellness Equation] Initializing authentication listeners...");
  const messageBox = document.getElementById("auth-message");

  // A. Handle Sign Up Form Submission (signup.html)
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    console.log("[The Wellness Equation] Signup form found. Attaching submit listener.");
    const signupBtn = document.getElementById("signup-submit-btn");

    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearAuthMessage(messageBox);

      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;

      console.log(`[The Wellness Equation] Attempting sign-up for: ${email}`);

      // Client-side validation
      if (!email || !password || !confirmPassword) {
        showAuthMessage(messageBox, "Please fill in all fields.");
        return;
      }

      if (password.length < 6) {
        showAuthMessage(messageBox, "Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        showAuthMessage(messageBox, "Passwords do not match. Please verify.");
        return;
      }

      // Check if placeholder config is still present
      if (auth.app.options.apiKey === "YOUR_API_KEY") {
        showAuthMessage(
          messageBox,
          "Firebase is not configured yet. Please open js/firebase.js and replace the placeholder keys with your Firebase project keys.",
          "error"
        );
        return;
      }

      // Submit to Firebase Auth
      try {
        signupBtn.disabled = true;
        signupBtn.innerHTML = "<span>Creating Account...</span>";

        const userCredential = await signUpUser(email, password);
        const user = userCredential.user;

        console.log(`[The Wellness Equation] User created successfully: UID=${user.uid}`);

        showAuthMessage(
          messageBox,
          `Account created successfully for ${user.email}! Redirecting to survey...`,
          "success"
        );

        // Redirect new users directly to the intake survey
        setTimeout(() => {
          window.location.href = "survey.html";
        }, 1200);

      } catch (error) {
        console.error("[The Wellness Equation] Signup error:", error);
        showAuthMessage(messageBox, getAuthErrorMessage(error.code), "error");
        signupBtn.disabled = false;
        signupBtn.innerHTML = "<span>Create Account</span>";
      }
    });
  }

  // B. Handle Login Form Submission (login.html)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    console.log("[The Wellness Equation] Login form found. Attaching submit listener.");
    const loginBtn = document.getElementById("login-submit-btn");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearAuthMessage(messageBox);

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      console.log(`[The Wellness Equation] Attempting log-in for: ${email}`);

      // Client-side validation
      if (!email || !password) {
        showAuthMessage(messageBox, "Please enter both email and password.");
        return;
      }

      // Check if placeholder config is still present
      if (auth.app.options.apiKey === "YOUR_API_KEY") {
        showAuthMessage(
          messageBox,
          "Firebase is not configured yet. Please open js/firebase.js and replace the placeholder keys with your Firebase project keys.",
          "error"
        );
        return;
      }

      // Submit to Firebase Auth
      try {
        loginBtn.disabled = true;
        loginBtn.innerHTML = "<span>Logging In...</span>";

        const userCredential = await loginUser(email, password);
        const user = userCredential.user;

        console.log(`[The Wellness Equation] Login successful: UID=${user.uid}`);

        showAuthMessage(
          messageBox,
          `Welcome back, ${user.email}! Redirecting to dashboard...`,
          "success"
        );

        // Redirect returning users to dashboard
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);

      } catch (error) {
        console.error("[The Wellness Equation] Login error:", error);
        showAuthMessage(messageBox, getAuthErrorMessage(error.code), "error");
        loginBtn.disabled = false;
        loginBtn.innerHTML = "<span>Log In</span>";
      }
    });
  }
}

// Ensure initAuth runs regardless of whether DOM is loading or already parsed
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}

// Export auth state observer for protected routes
export { onAuthStateChanged, auth };
