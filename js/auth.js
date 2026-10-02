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
      return "Invalid Firebase API Key. Please verify your Firebase configuration in js/firebase.js.";
    case "auth/configuration-not-found":
      return "Firebase configuration not found. Please verify your settings in js/firebase.js.";
    default:
      return `Authentication error (${errorCode || "Unknown"}). Please verify your credentials.`;
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
    console.log("[Auth] Signing out current user...");
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("[Auth] Error signing out:", error);
    alert("Failed to log out. Please try again.");
  }
}

/* --------------------------------------------------------------------------
   4. Form Listeners & Initialization
   -------------------------------------------------------------------------- */
function initAuth() {
  console.log("[Auth] Initializing authentication listeners...");
  const messageBox = document.getElementById("auth-message");

  // A. Handle Sign Up Form Submission (signup.html)
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    console.log("[Signup] Form found. Attaching submit listener.");
    const signupBtn = document.getElementById("signup-submit-btn");

    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("[Signup] Form submitted");
      clearAuthMessage(messageBox);

      const emailInput = document.getElementById("signup-email");
      const passwordInput = document.getElementById("signup-password");
      const confirmPasswordInput = document.getElementById("signup-confirm-password");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

      // Client-side validation
      if (!email) {
        showAuthMessage(messageBox, "Please enter your email address.");
        return;
      }

      if (!password) {
        showAuthMessage(messageBox, "Please enter a password.");
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

      // Submit to Firebase Authentication
      try {
        if (signupBtn) {
          signupBtn.disabled = true;
          signupBtn.innerHTML = "<span>Creating Account...</span>";
        }

        console.log("[Signup] Creating Firebase account...");
        const userCredential = await signUpUser(email, password);
        const user = userCredential.user;

        console.log("[Signup] Account created:", user.uid);

        // Confirm that auth.currentUser exists and redirect
        if (auth.currentUser) {
          showAuthMessage(
            messageBox,
            `Account created successfully! Redirecting to dashboard...`,
            "success"
          );

          console.log("[Signup] Redirecting to dashboard...");
          window.location.href = "dashboard.html";
        } else {
          console.log("[Signup] Redirecting to dashboard...");
          window.location.href = "dashboard.html";
        }

      } catch (error) {
        console.error("[Signup] Error creating account:", error);
        showAuthMessage(messageBox, getAuthErrorMessage(error.code), "error");
        if (signupBtn) {
          signupBtn.disabled = false;
          signupBtn.innerHTML = "<span>Create Account</span>";
        }
      }
    });
  }

  // B. Handle Login Form Submission (login.html)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    console.log("[Login] Form found. Attaching submit listener.");
    const loginBtn = document.getElementById("login-submit-btn");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("[Login] Form submitted");
      clearAuthMessage(messageBox);

      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      // Client-side validation
      if (!email || !password) {
        showAuthMessage(messageBox, "Please enter both email and password.");
        return;
      }

      // Submit to Firebase Authentication
      try {
        if (loginBtn) {
          loginBtn.disabled = true;
          loginBtn.innerHTML = "<span>Logging In...</span>";
        }

        console.log("[Login] Authenticating with Firebase...");
        const userCredential = await loginUser(email, password);
        const user = userCredential.user;

        console.log("[Login] Login successful");

        showAuthMessage(
          messageBox,
          `Welcome back, ${user.email}! Redirecting to dashboard...`,
          "success"
        );

        console.log("[Login] Redirecting to dashboard...");
        window.location.href = "dashboard.html";

      } catch (error) {
        console.error("[Login] Error logging in:", error);
        showAuthMessage(messageBox, getAuthErrorMessage(error.code), "error");
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = "<span>Log In</span>";
        }
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
