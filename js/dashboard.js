// ==========================================================================
// THE WELLNESS EQUATION - DASHBOARD CONTROLLER (js/dashboard.js)
// Responsibility: ONLY dashboard UI rendering, user profile retrieval,
// authentication state observer, and personalized wellness view generation.
// ==========================================================================

import { auth, db } from "./firebase.js";
import { logoutUser } from "./auth.js";
import { generateWellnessRecommendations } from "./recommendations.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* --------------------------------------------------------------------------
   1. UI Renderers
   -------------------------------------------------------------------------- */

/**
 * Render Empty State (User is logged in but hasn't completed survey)
 */
function renderEmptyState(container) {
  container.innerHTML = `
    <div class="welcome-card" id="welcome-state">
      <div class="welcome-icon" aria-hidden="true">✨</div>
      <h1 class="welcome-title">Welcome to The Wellness Equation</h1>
      <p class="welcome-subtitle">
        Your account is active! Complete your comprehensive wellness survey to generate personalized nutrition recommendations, tailored meal plans, and daily lifestyle targets.
      </p>
      <div class="welcome-actions">
        <a href="survey.html" class="btn btn-primary btn-lg" id="start-survey-btn">
          Take Wellness Survey
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  `;
}

/**
 * Render Error State (Firestore read failure)
 */
function renderErrorState(container, message) {
  container.innerHTML = `
    <div class="welcome-card" style="border-left: 4px solid var(--danger);">
      <div class="welcome-icon" aria-hidden="true">⚠️</div>
      <h1 class="welcome-title" style="color: var(--danger);">Unable to Load Profile</h1>
      <p class="welcome-subtitle">
        ${message || "An unexpected error occurred while communicating with Cloud Firestore."}
      </p>
      <div class="welcome-actions">
        <a href="survey.html" class="btn btn-primary">Go to Wellness Survey</a>
        <button type="button" class="btn btn-secondary" onclick="window.location.reload()">Retry</button>
      </div>
    </div>
  `;
}

/**
 * Render Complete Personalized Recommendations Dashboard
 */
function renderDashboardUI(container, profile, recs) {
  const { metrics, nutritionTargets, recommendedFoods, mealPlan, foodsToLimit, lifestyleTips, disclaimer } = recs;

  // 1. Recommended Foods HTML
  const foodsHTML = recommendedFoods.length
    ? recommendedFoods.map(item => `
        <article class="food-card">
          <div class="food-card-top">
            <h4 class="food-card-name">${item.name}</h4>
            <div class="food-card-serving">
              <span>⚖️ Serving:</span>
              <span>${item.serving}</span>
            </div>
          </div>

          <div class="food-macros-row">
            <div class="food-macro-item">
              <span>Energy</span>
              <span class="macro-val">${item.calories} kcal</span>
            </div>
            <div class="food-macro-item">
              <span>Protein</span>
              <span class="macro-val">${item.protein}g</span>
            </div>
            <div class="food-macro-item">
              <span>Carbs</span>
              <span class="macro-val">${item.carbs}g</span>
            </div>
            <div class="food-macro-item">
              <span>Fat</span>
              <span class="macro-val">${item.fat}g</span>
            </div>
          </div>

          <p class="food-card-benefit">
            <strong>Why:</strong> ${item.benefit}
          </p>
        </article>
      `).join("")
    : `<div class="welcome-card" style="padding: 2rem;"><p class="text-muted">No specific food items match your strict allergen exclusions. Please edit your survey if needed.</p></div>`;

  // 2. Personalized Meal Plan HTML (4 Meals)
  const mealPlanHTML = mealPlan && mealPlan.length
    ? mealPlan.map(meal => `
        <article class="meal-card">
          <div class="meal-card-header">
            <h4 class="meal-card-title">
              <span>${meal.title === "Breakfast" ? "🌅" : meal.title === "Lunch" ? "🍛" : meal.title === "Evening Snack" ? "☕" : "🌙"}</span>
              <span>${meal.title}</span>
            </h4>
            <span class="meal-time-badge">${meal.time}</span>
          </div>

          <ul class="meal-items-list">
            ${meal.items.map(item => `<li class="meal-item">${item}</li>`).join("")}
          </ul>

          <div class="meal-note">
            💡 ${meal.note}
          </div>
        </article>
      `).join("")
    : "";

  // 3. Daily Nutrition Targets HTML
  const nutritionHTML = nutritionTargets.map(target => `
    <article class="nutrition-target-card">
      <div class="target-header">
        <span class="target-label">${target.label}</span>
      </div>
      <div class="target-value-container">
        <span class="target-number">${target.value}</span>
        <span class="target-unit">${target.unit}</span>
      </div>
      <p class="target-explanation">${target.explanation}</p>
    </article>
  `).join("");

  // 4. Foods to Avoid / Consider Carefully HTML
  const avoidHTML = foodsToLimit.map(item => {
    const isAllergen = item.type === "allergen";
    return `
      <article class="avoid-card ${isAllergen ? "avoid-card-allergen" : ""}">
        <div class="avoid-card-title">
          <span>${isAllergen ? "🛑" : "🚫"}</span>
          <span>${item.item}</span>
        </div>
        <p class="avoid-card-reason">${item.reason}</p>
      </article>
    `;
  }).join("");

  // 5. Lifestyle Tips HTML
  const lifestyleHTML = lifestyleTips.map(item => `
    <article class="lifestyle-card">
      <div class="lifestyle-card-header">
        <span class="lifestyle-card-icon" aria-hidden="true">${item.icon}</span>
        <h4 class="lifestyle-card-category">${item.category}</h4>
      </div>
      <p class="lifestyle-card-tip">${item.tip}</p>
    </article>
  `).join("");

  // Condition Warning Banner
  const conditionBannerHTML = metrics.conditionDisclaimer
    ? `
      <aside class="condition-warning-banner" role="alert">
        <span style="font-size: 1.3rem;">🩺</span>
        <div>
          <strong>Health Considerations Notice:</strong><br>
          ${metrics.conditionDisclaimer}
        </div>
      </aside>
    `
    : "";

  // Render Full Structured Dashboard Layout
  container.innerHTML = `
    <!-- Top Profile Summary Banner -->
    <section class="profile-banner" aria-label="Profile Overview">
      <div class="profile-banner-top">
        <div class="profile-greeting">
          <h1 class="profile-user-name">Welcome, ${metrics.name}!</h1>
          <p class="profile-tagline">
            Your personalized wellness equation based on your goals, body metrics, and lifestyle.
          </p>
        </div>
        <a href="survey.html" class="btn btn-secondary profile-action-btn" title="Update your wellness survey">
          <span>✏️</span>
          <span>Edit Survey Profile</span>
        </a>
      </div>

      <!-- Metric Chips Overview -->
      <div class="metric-chips-grid">
        <div class="metric-chip">
          <span class="chip-label">Primary Goal</span>
          <span class="chip-value">${metrics.goal}</span>
          <span class="chip-subtext">Active focus</span>
        </div>

        <div class="metric-chip">
          <span class="chip-label">Activity Level</span>
          <span class="chip-value">${metrics.exerciseLevel}</span>
          <span class="chip-subtext">Weekly movement</span>
        </div>

        <div class="metric-chip">
          <span class="chip-label">Diet Preference</span>
          <span class="chip-value">${metrics.dietPreference}</span>
          <span class="chip-subtext">Allergies: ${metrics.allergies}</span>
        </div>

        <div class="metric-chip">
          <span class="chip-label">BMI Score</span>
          <span class="chip-value">${metrics.bmi || "--"}</span>
          <span class="chip-subtext">${metrics.bmiCategory}</span>
        </div>
      </div>
    </section>

    ${conditionBannerHTML}

    <!-- SECTION 1: RECOMMENDED FOODS -->
    <section class="dashboard-section" id="recommended-foods-section" aria-label="Recommended Foods">
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">
          <span>🍽️</span>
          <span>1. Recommended Everyday Foods</span>
        </h2>
        <p class="dashboard-section-subtitle">
          Individual whole-food suggestions tailored to your dietary preference, allergen exclusions, and wellness goal.
        </p>
      </div>

      <div class="foods-grid">
        ${foodsHTML}
      </div>
    </section>

    <!-- SECTION 2: PERSONALIZED DAILY MEAL PLAN -->
    <section class="dashboard-section" id="meal-plan-section" aria-label="Personalized Daily Meal Plan">
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">
          <span>🍛</span>
          <span>2. Personalized Daily Meal Plan</span>
        </h2>
        <p class="dashboard-section-subtitle">
          Wholesome meal suggestions for Breakfast, Lunch, Evening Snacks, and Dinner dynamically aligned with your survey profile.
        </p>
      </div>

      <div class="meal-plan-grid">
        ${mealPlanHTML}
      </div>
    </section>

    <!-- SECTION 3: DAILY NUTRITION TARGETS -->
    <section class="dashboard-section" id="nutrition-targets-section" aria-label="Daily Nutrition Targets">
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">
          <span>🧬</span>
          <span>3. Estimated Daily Nutrition Targets</span>
        </h2>
        <p class="dashboard-section-subtitle">
          Personalized daily energy and macronutrient estimates calculated using the Mifflin-St Jeor metabolic balance equation.
        </p>
      </div>

      <div class="nutrition-targets-grid">
        ${nutritionHTML}
      </div>
    </section>

    <!-- SECTION 4: FOODS TO AVOID / LIMIT -->
    <section class="dashboard-section" id="foods-avoid-section" aria-label="Foods to Avoid">
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">
          <span>🚫</span>
          <span>4. Foods to Limit / Consider Carefully</span>
        </h2>
        <p class="dashboard-section-subtitle">
          Strict allergen warnings and category limitations aligned with your declared health profile.
        </p>
      </div>

      <div class="avoid-grid">
        ${avoidHTML}
      </div>
    </section>

    <!-- SECTION 5: LIFESTYLE TIPS -->
    <section class="dashboard-section" id="lifestyle-section" aria-label="Lifestyle & Daily Habits">
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">
          <span>🌱</span>
          <span>5. Wellness & Lifestyle Recommendations</span>
        </h2>
        <p class="dashboard-section-subtitle">
          Actionable daily movement, hydration, and sleep guidelines to support sustainable vitality.
        </p>
      </div>

      <div class="lifestyle-grid">
        ${lifestyleHTML}
      </div>
    </section>

    <!-- Educational Disclaimer Banner -->
    <aside class="disclaimer-banner" role="note">
      <strong>ℹ️ General Educational Wellness Guidance:</strong> ${disclaimer}
    </aside>
  `;
}

/* --------------------------------------------------------------------------
   2. Dashboard Initialization Controller
   -------------------------------------------------------------------------- */
function initDashboard() {
  console.log("[Dashboard] Initializing dashboard controller...");

  const userEmailDisplay = document.getElementById("user-email-display");
  const userAvatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");
  const dashboardContainer = document.getElementById("dashboard-container");

  // Attach Logout Button Action
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      console.log("[Dashboard] Logging out current user...");
      await logoutUser();
    });
  }

  // Authentication State Observer (Route Guard)
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log(`[Dashboard] Authenticated user active: ${user.email} (UID: ${user.uid})`);
      
      if (userEmailDisplay) {
        userEmailDisplay.textContent = user.email;
      }

      if (userAvatar && user.email) {
        userAvatar.textContent = user.email.charAt(0).toUpperCase();
      }

      // Fetch Profile from Cloud Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data()?.profile) {
          const userProfile = docSnap.data().profile;
          console.log("[Dashboard] Profile loaded successfully from Firestore:", userProfile);

          // Generate personalized rule-based recommendations & meal plan
          const recommendations = generateWellnessRecommendations(userProfile);
          console.log("[Dashboard] Generated recommendations & meal plan:", recommendations);

          // Render structured 5-section dashboard UI
          renderDashboardUI(dashboardContainer, userProfile, recommendations);

        } else {
          console.log("[Dashboard] No profile found in Firestore. Rendering empty state...");
          renderEmptyState(dashboardContainer);
        }

      } catch (error) {
        console.error("[Dashboard] Error fetching profile from Firestore:", error);
        renderErrorState(dashboardContainer, error.message);
      }

    } else {
      // User is NOT logged in -> Route protection redirect
      console.warn("[Dashboard] Unauthenticated access attempt. Redirecting to login.html...");
      window.location.href = "login.html";
    }
  });
}

// Resilient initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}
