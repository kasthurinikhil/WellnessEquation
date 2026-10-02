# The Wellness Equation

A personalized health and wellness web application built as a clean, responsive, modular student portfolio project. The platform features secure Firebase authentication, a comprehensive wellness intake survey, dynamic rule-based nutrition and meal planning, and an interactive dashboard built with vanilla HTML5, CSS3, JavaScript (ES6+ Modules), and Google Cloud Firestore.

---

## 📌 Project Overview
**The Wellness Equation** helps individuals understand and improve their daily wellness habits. By collecting user health metrics and lifestyle preferences through an interactive survey, the platform calculates estimated daily metabolic targets (BMR, TDEE, and macronutrient targets via the Mifflin-St Jeor formula), generates personalized 4-meal daily plans, recommends whole foods with everyday names, and applies strict allergen exclusions.

---

## 🚀 Key Features

- **🔐 User Authentication**:
  - Secure email/password sign-up, login, and session persistence powered by Firebase Authentication Modular SDK (v10).
  - Client-side auth route guards protecting authenticated pages (`dashboard.html`, `survey.html`).

- **📋 Wellness Profile Survey**:
  - Collects Name, Age, Gender, Height, Weight, Dietary Preference, Physical Activity Level, Primary Wellness Goal, Health Considerations (structured multi-select), and Food Allergies/Intolerances (structured multi-select).
  - Mutual exclusivity for "None" selections and custom "Other" text fields.
  - Automatic pre-fill of existing user parameters for simple "Edit Survey" updates.

- **🥗 Personalized Dashboard (5 Core Sections)**:
  1. **Recommended Everyday Foods**: Individual whole-food items (e.g. Dal / Lentils, Roasted Chana, Paneer, Curd / Yogurt, Tofu, Grilled Chicken, Fish / Salmon, Oats, Brown Rice, Roti / Chapati) with serving sizes, energy, macros, and benefits.
  2. **Personalized 4-Meal Plan**: Tailored options for Breakfast, Lunch, Evening Snacks, and Dinner aligned with the user's diet, goal, activity level, and allergies.
  3. **Estimated Daily Nutrition Targets**: Dynamic estimates for Calories (`kcal/day`), Protein (`g/day`), Carbohydrates (`g/day`), Healthy Fats (`g/day`), Dietary Fiber (`g/day`), and Daily Hydration (`L/day`).
  4. **Foods to Limit / Consider Carefully**: Strict allergen warnings and category limitations (e.g., sugar-sweetened drinks, deep-fried snacks, ultra-processed items) without sensationalized language.
  5. **Wellness & Lifestyle Recommendations**: Actionable daily guidelines for physical movement, sleep quality, hydration pacing, and mindful eating.

- **🩺 Health Safety & Educational Disclaimer**:
  - Conservative guidance for users with reported health conditions.
  - Prominent educational disclaimers reminding users that recommendations are for general wellness and not medical prescriptions.

---

## 🛠️ Tech Stack

- **Frontend**: Plain HTML5, Modern CSS3 (CSS Custom Properties `:root`, Flexbox, CSS Grid), Vanilla JavaScript (ES6+ Modules)
- **Backend & Database**: Firebase Authentication (v10 Modular), Cloud Firestore (long-polling enabled)
- **Tooling**: Built-in Python HTTP Server for local development / Firebase Hosting for production

---

## 📁 Project Structure

```text
The-Wellness-Equation/
│
├── index.html              # Landing page with hero, features & auth state header
├── login.html              # User login page with input validation
├── signup.html             # User registration page with confirm-password check
├── survey.html             # Comprehensive intake questionnaire
├── dashboard.html          # Main personalized dashboard
│
├── css/
│   ├── style.css           # Global typography, color tokens, navbar & footer
│   ├── auth.css            # Styles for login and signup forms
│   ├── survey.css          # Styles for survey cards & structured checkbox grids
│   └── dashboard.css       # Styles for dashboard grid, meal cards, nutrition & foods
│
├── js/
│   ├── firebase.js         # Firebase SDK initialization & Firestore configuration
│   ├── auth.js             # Authentication handlers (signup, login, logout, error mapping)
│   ├── survey.js           # Survey validation, pre-fill, & Firestore profile saving
│   ├── recommendations.js  # Transparent rule-based nutrition & meal plan engine
│   └── dashboard.js        # Dashboard UI controller & profile data flow
│
├── assets/
│   ├── images/             # Visual assets and illustrations
│   └── icons/              # UI icons
│
├── .gitignore              # Git ignored files (.env, system logs, node_modules)
└── README.md               # Comprehensive project documentation
```

---

## 🔄 How the Data Flows

```text
User Submits / Edits Survey
        ↓
Data Validated & Saved to Firestore (`users/{uid}`)
        ↓
Dashboard Loads Profile (`doc(db, "users", user.uid)`)
        ↓
Passed to `generateWellnessRecommendations(profile)`
  ├── 1. Calculates BMI & Daily Hydration Target
  ├── 2. Calculates BMR & TDEE (Mifflin-St Jeor)
  ├── 3. Filters Food Database by Diet & Allergies
  ├── 4. Generates 4-Meal Plan (Breakfast, Lunch, Snacks, Dinner)
  └── 5. Formulates Foods to Limit & Lifestyle Tips
        ↓
Rendered Dynamically on Dashboard (`renderDashboardUI`)
```

---

## 💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd The-Wellness-Equation
```

### 2. Configure Firebase
Update `js/firebase.js` with your Firebase project credentials from the Firebase Console:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run Locally
Because the project uses standard ES6 JavaScript Modules (`type="module"`), files must be served over HTTP:
```bash
# Using Python
python -m http.server 8000

# OR using Node.js npx
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🚀 Deployment to Firebase Hosting

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase Hosting in the project directory:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project.
   - Specify `.` (current directory) as the public root directory.
   - Configure as a single-page app? `No`.
4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

---

## 🛡️ Security & Privacy
- User passwords are processed directly by Firebase Authentication and are **never** stored in Firestore.
- Firestore Security Rules restrict each user's data access strictly to their authenticated UID:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

---

## 📄 License & Disclaimer
This project is for educational and portfolio demonstration purposes. All nutrition and lifestyle information provided is general guidance and does not constitute clinical medical diagnosis, prescription, or treatment.
