// ==========================================================================
// THE WELLNESS EQUATION - SURVEY FUNCTIONALITY (js/survey.js)
// Responsibility: ONLY survey input validation, data preparation, & Firestore profile saving
// ==========================================================================

import { auth, db } from "./firebase.js";
import { logoutUser } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* --------------------------------------------------------------------------
   1. Helper: Translate Firestore Error Codes
   -------------------------------------------------------------------------- */
function getFirestoreErrorMessage(error) {
  const code = error?.code || "";
  const msg = error?.message || "";

  switch (code) {
    case "permission-denied":
      return "Permission Denied: Your Firestore Security Rules are blocking writes. Please update your Firestore Rules in Firebase Console (Rules tab).";
    case "unavailable":
      return "Firestore Service Unavailable: The database is unreachable or offline. Please check if Firestore Database is created in your Firebase Console.";
    case "not-found":
      return "Firestore Database not found. Please click 'Create database' under Firestore Database in your Firebase Console.";
    case "unauthenticated":
      return "Your session has expired. Please log in again.";
    default:
      if (msg.includes("Timeout")) {
        return "Firestore write timed out. This almost always means the Firestore Database has not been created yet in the Firebase Console (the-wellness-equation-86367).";
      }
      return `Database Error (${code || "Unknown"}): ${msg}`;
  }
}

/* --------------------------------------------------------------------------
   2. UI Helper: Display / Clear Alerts
   -------------------------------------------------------------------------- */
function showSurveyMessage(element, text, type = "error") {
  if (!element) return;
  element.textContent = text;
  element.className = `survey-message survey-message-${type}`;
  element.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearSurveyMessage(element) {
  if (!element) return;
  element.textContent = "";
  element.className = "survey-message survey-message-hidden";
}

/**
 * Timeout helper to prevent hanging promises
 */
function withTimeout(promise, ms = 8000) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout: Firestore operation took longer than ${ms / 1000} seconds.`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/* --------------------------------------------------------------------------
   3. Checkbox Group Interactivity & Mutual Exclusivity
   -------------------------------------------------------------------------- */
function setupCheckboxInteractivity() {
  // A. Health Conditions Mutual Exclusivity
  const healthNone = document.getElementById("health-none");
  const healthCheckboxes = document.querySelectorAll('input[name="healthCondition"]');
  const healthOtherCb = document.getElementById("health-other-cb");
  const healthOtherContainer = document.getElementById("health-other-container");
  const healthOtherInput = document.getElementById("survey-health-other");

  healthCheckboxes.forEach(cb => {
    cb.addEventListener("change", (e) => {
      if (cb === healthNone && cb.checked) {
        // "None" was checked -> uncheck all others
        healthCheckboxes.forEach(otherCb => {
          if (otherCb !== healthNone) otherCb.checked = false;
        });
        if (healthOtherContainer) healthOtherContainer.style.display = "none";
        if (healthOtherInput) healthOtherInput.value = "";
      } else if (cb !== healthNone && cb.checked) {
        // A specific condition was checked -> uncheck "None"
        if (healthNone) healthNone.checked = false;
      }

      // Handle "Other" input visibility
      if (healthOtherCb && healthOtherContainer) {
        healthOtherContainer.style.display = healthOtherCb.checked ? "block" : "none";
      }
    });
  });

  // B. Allergies Mutual Exclusivity
  const allergyNone = document.getElementById("allergy-none");
  const allergyCheckboxes = document.querySelectorAll('input[name="allergy"]');
  const allergyOtherCb = document.getElementById("allergy-other-cb");
  const allergyOtherContainer = document.getElementById("allergy-other-container");
  const allergyOtherInput = document.getElementById("survey-allergy-other");

  allergyCheckboxes.forEach(cb => {
    cb.addEventListener("change", (e) => {
      if (cb === allergyNone && cb.checked) {
        // "None" was checked -> uncheck all others
        allergyCheckboxes.forEach(otherCb => {
          if (otherCb !== allergyNone) otherCb.checked = false;
        });
        if (allergyOtherContainer) allergyOtherContainer.style.display = "none";
        if (allergyOtherInput) allergyOtherInput.value = "";
      } else if (cb !== allergyNone && cb.checked) {
        // A specific allergy was checked -> uncheck "None"
        if (allergyNone) allergyNone.checked = false;
      }

      // Handle "Other" input visibility
      if (allergyOtherCb && allergyOtherContainer) {
        allergyOtherContainer.style.display = allergyOtherCb.checked ? "block" : "none";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Survey Controller Initialization
   -------------------------------------------------------------------------- */
function initSurvey() {
  console.log("[1/7] [Survey] Initializing survey controller...");

  setupCheckboxInteractivity();

  const surveyForm = document.getElementById("survey-form");
  const messageBox = document.getElementById("survey-message");
  const submitBtn = document.getElementById("survey-submit-btn");
  const logoutBtn = document.getElementById("survey-logout-btn");

  let currentAuthenticatedUser = null;

  // Attach Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logoutUser();
    });
  }

  // Authentication State Observer & Profile Pre-fill
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentAuthenticatedUser = user;
      console.log(`[2/7] [Survey] Authenticated user active: ${user.email} (UID: ${user.uid})`);

      // Attempt to pre-fill form if profile already exists in Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await withTimeout(getDoc(userDocRef), 4000);

        if (docSnap.exists() && docSnap.data()?.profile) {
          console.log("[Survey] Existing profile found in Firestore. Pre-filling form fields...");
          const existingData = docSnap.data().profile;

          if (existingData.name) document.getElementById("survey-name").value = existingData.name;
          if (existingData.age) document.getElementById("survey-age").value = existingData.age;
          if (existingData.gender) document.getElementById("survey-gender").value = existingData.gender;
          if (existingData.height) document.getElementById("survey-height").value = existingData.height;
          if (existingData.weight) document.getElementById("survey-weight").value = existingData.weight;
          if (existingData.dietPreference) document.getElementById("survey-diet").value = existingData.dietPreference;
          if (existingData.exerciseLevel) document.getElementById("survey-exercise").value = existingData.exerciseLevel;
          if (existingData.goal) document.getElementById("survey-goal").value = existingData.goal;

          // Pre-fill Health Conditions Checkboxes
          const healthIssues = Array.isArray(existingData.healthIssues)
            ? existingData.healthIssues
            : (typeof existingData.healthIssues === "string" ? existingData.healthIssues.split(",").map(s => s.trim()) : []);

          if (healthIssues.length > 0 && !healthIssues.includes("None")) {
            const healthNone = document.getElementById("health-none");
            if (healthNone) healthNone.checked = false;

            document.querySelectorAll('input[name="healthCondition"]').forEach(cb => {
              if (healthIssues.includes(cb.value)) {
                cb.checked = true;
              }
            });

            // Check if there were custom "Other" values
            const standardConditions = ["None", "Diabetes", "High Blood Pressure", "High Cholesterol", "Anemia", "Thyroid Disorder", "PCOS", "Heart Disease", "Kidney Disease", "Liver Disease", "Digestive/Gastrointestinal Issues", "Other"];
            const customConditions = healthIssues.filter(item => !standardConditions.includes(item));
            if (customConditions.length > 0) {
              const otherCb = document.getElementById("health-other-cb");
              const otherContainer = document.getElementById("health-other-container");
              const otherInput = document.getElementById("survey-health-other");
              if (otherCb) otherCb.checked = true;
              if (otherContainer) otherContainer.style.display = "block";
              if (otherInput) otherInput.value = customConditions.join(", ");
            }
          }

          // Pre-fill Allergies Checkboxes
          const allergies = Array.isArray(existingData.foodAllergies)
            ? existingData.foodAllergies
            : (typeof existingData.foodAllergies === "string" ? existingData.foodAllergies.split(",").map(s => s.trim()) : []);

          if (allergies.length > 0 && !allergies.includes("None")) {
            const allergyNone = document.getElementById("allergy-none");
            if (allergyNone) allergyNone.checked = false;

            document.querySelectorAll('input[name="allergy"]').forEach(cb => {
              if (allergies.includes(cb.value)) {
                cb.checked = true;
              }
            });

            const standardAllergies = ["None", "Peanuts", "Tree Nuts", "Milk/Dairy", "Eggs", "Soy", "Wheat/Gluten", "Fish", "Shellfish", "Sesame", "Other"];
            const customAllergies = allergies.filter(item => !standardAllergies.includes(item));
            if (customAllergies.length > 0) {
              const otherCb = document.getElementById("allergy-other-cb");
              const otherContainer = document.getElementById("allergy-other-container");
              const otherInput = document.getElementById("survey-allergy-other");
              if (otherCb) otherCb.checked = true;
              if (otherContainer) otherContainer.style.display = "block";
              if (otherInput) otherInput.value = customAllergies.join(", ");
            }
          }

          if (submitBtn) {
            submitBtn.innerHTML = "<span>Update Profile & View Recommendations →</span>";
          }
        }
      } catch (err) {
        console.warn("[Survey] Notice during pre-fill check:", err.message);
      }

    } else {
      // User is not authenticated -> Route guard redirect
      console.warn("[Survey] Unauthenticated access attempt. Redirecting to login.html...");
      window.location.href = "login.html";
    }
  });

  // Handle Form Submission
  if (surveyForm) {
    surveyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearSurveyMessage(messageBox);

      console.log("[1/7] [Survey] Submit handler triggered.");

      if (!currentAuthenticatedUser) {
        console.error("[2/7] [Survey] Error: No authenticated user found.");
        showSurveyMessage(messageBox, "You must be logged in to submit this survey.", "error");
        return;
      }

      console.log(`[2/7] [Survey] Authenticated user exists: ${currentAuthenticatedUser.email}`);
      console.log(`[3/7] [Survey] Current user UID available: ${currentAuthenticatedUser.uid}`);

      // Read form inputs
      const name = document.getElementById("survey-name").value.trim();
      const age = document.getElementById("survey-age").value.trim();
      const gender = document.getElementById("survey-gender").value;
      const height = document.getElementById("survey-height").value.trim();
      const weight = document.getElementById("survey-weight").value.trim();
      const dietPreference = document.getElementById("survey-diet").value;
      const exerciseLevel = document.getElementById("survey-exercise").value;
      const goal = document.getElementById("survey-goal").value;

      // Collect Health Conditions Array
      const healthConditions = Array.from(document.querySelectorAll('input[name="healthCondition"]:checked'))
        .map(cb => cb.value)
        .filter(val => val !== "Other");

      const healthOtherInput = document.getElementById("survey-health-other");
      const healthOtherCb = document.getElementById("health-other-cb");
      if (healthOtherCb && healthOtherCb.checked && healthOtherInput && healthOtherInput.value.trim()) {
        healthConditions.push(healthOtherInput.value.trim());
      }
      if (healthConditions.length === 0) healthConditions.push("None");

      // Collect Food Allergies Array
      const foodAllergies = Array.from(document.querySelectorAll('input[name="allergy"]:checked'))
        .map(cb => cb.value)
        .filter(val => val !== "Other");

      const allergyOtherInput = document.getElementById("survey-allergy-other");
      const allergyOtherCb = document.getElementById("allergy-other-cb");
      if (allergyOtherCb && allergyOtherCb.checked && allergyOtherInput && allergyOtherInput.value.trim()) {
        foodAllergies.push(allergyOtherInput.value.trim());
      }
      if (foodAllergies.length === 0) foodAllergies.push("None");

      // Validation
      if (!name || !age || !gender || !height || !weight || !dietPreference || !exerciseLevel || !goal) {
        showSurveyMessage(messageBox, "Please complete all required fields marked with an asterisk (*).", "error");
        return;
      }

      const numAge = Number(age);
      const numHeight = Number(height);
      const numWeight = Number(weight);

      if (isNaN(numAge) || numAge < 12 || numAge > 120) {
        showSurveyMessage(messageBox, "Please enter a valid age between 12 and 120.", "error");
        return;
      }

      if (isNaN(numHeight) || numHeight < 50 || numHeight > 260) {
        showSurveyMessage(messageBox, "Please enter a valid height between 50 and 260 cm.", "error");
        return;
      }

      if (isNaN(numWeight) || numWeight < 20 || numWeight > 300) {
        showSurveyMessage(messageBox, "Please enter a valid weight between 20 and 300 kg.", "error");
        return;
      }

      // Construct Profile Payload (Passwords are NEVER stored in Firestore)
      const profileData = {
        name,
        age: numAge,
        gender,
        height: numHeight,
        weight: numWeight,
        dietPreference,
        exerciseLevel,
        healthIssues: healthConditions,
        foodAllergies: foodAllergies,
        goal,
        updatedAt: new Date().toISOString()
      };

      console.log("[4/7] [Survey] Correct survey data collected:", profileData);

      let saveSuccess = false;

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Saving Profile to Firestore...</span>`;

        console.log(`[5/7] [Survey] Calling Firestore setDoc for users/${currentAuthenticatedUser.uid}...`);

        // Write directly to users/{uid}
        const userDocRef = doc(db, "users", currentAuthenticatedUser.uid);
        await withTimeout(setDoc(userDocRef, {
          profile: profileData,
          email: currentAuthenticatedUser.email,
          updatedAt: profileData.updatedAt
        }, { merge: true }), 8000);

        saveSuccess = true;
        console.log("[6/7] [Survey] Firestore write completed successfully!");

        showSurveyMessage(
          messageBox,
          "✓ Profile saved successfully! Redirecting to your dashboard...",
          "success"
        );

        // Execute redirect
        console.log("[7/7] [Survey] Executing redirect to dashboard.html...");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);

      } catch (error) {
        console.error("[Survey] Firestore write FAILED:", error);
        showSurveyMessage(messageBox, getFirestoreErrorMessage(error), "error");
      } finally {
        if (!saveSuccess) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Save Profile & View Recommendations →</span>`;
        }
      }
    });
  }
}

// Resilient initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSurvey);
} else {
  initSurvey();
}
