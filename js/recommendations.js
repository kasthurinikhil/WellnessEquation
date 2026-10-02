// ==========================================================================
// THE WELLNESS EQUATION - RECOMMENDATIONS ENGINE (js/recommendations.js)
// Responsibility: ONLY rule-based wellness recommendations, food database,
// daily nutrition targets, foods to limit, and personalized 4-meal plan.
// ==========================================================================

/**
 * Structured Food Knowledge Base
 * Uses everyday, simple food names familiar to users (including Indian staples)
 */
export const FOOD_DATABASE = [
  // 1. Plant Proteins & Legumes
  {
    id: "dal_lentils",
    name: "Dal / Lentils",
    serving: "150 g (1 bowl)",
    calories: 175,
    protein: 14,
    carbs: 30,
    fat: 1,
    fiber: 8,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "High in plant protein and dietary fiber for steady energy and digestion."
  },
  {
    id: "roasted_chana",
    name: "Roasted Chana",
    serving: "50 g (1/2 cup)",
    calories: 180,
    protein: 10,
    carbs: 28,
    fat: 3,
    fiber: 8,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "Crunchy low-fat snack rich in complex carbs and slow-digesting protein."
  },
  {
    id: "sprouts",
    name: "Moong Sprouts",
    serving: "100 g (1 bowl)",
    calories: 105,
    protein: 9,
    carbs: 18,
    fat: 1,
    fiber: 5,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "Enzyme-rich sprouted legume promoting gut health and vitality."
  },
  {
    id: "chickpeas_chana",
    name: "Chickpeas / Chole",
    serving: "130 g (1 bowl)",
    calories: 210,
    protein: 11,
    carbs: 35,
    fat: 3,
    fiber: 9,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "Complex carbohydrates that release glucose gradually throughout the day."
  },
  {
    id: "rajma",
    name: "Rajma / Kidney Beans",
    serving: "150 g (1 bowl)",
    calories: 190,
    protein: 13,
    carbs: 34,
    fat: 1,
    fiber: 12,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "High in antioxidants, iron, and soluble fiber for gut health."
  },
  {
    id: "tofu",
    name: "Tofu",
    serving: "150 g",
    calories: 140,
    protein: 17,
    carbs: 3,
    fat: 8,
    fiber: 2,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Soy"],
    benefit: "Complete plant protein containing all 9 essential amino acids and calcium."
  },
  {
    id: "soya_chunks",
    name: "Soya Chunks",
    serving: "50 g (dry weight)",
    calories: 170,
    protein: 26,
    carbs: 16,
    fat: 1,
    fiber: 6,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: ["Soy"],
    benefit: "Super-dense vegetarian protein aiding muscle maintenance and repair."
  },

  // 2. Dairy & Animal Proteins
  {
    id: "paneer",
    name: "Paneer",
    serving: "100 g",
    calories: 265,
    protein: 18,
    carbs: 3,
    fat: 20,
    fiber: 0,
    diets: ["Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Milk/Dairy"],
    benefit: "Rich in calcium and slow-release casein protein for muscle nourishment."
  },
  {
    id: "curd",
    name: "Curd / Yogurt",
    serving: "150 g (1 cup)",
    calories: 100,
    protein: 6,
    carbs: 7,
    fat: 4,
    fiber: 0,
    diets: ["Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Milk/Dairy"],
    benefit: "Natural probiotics supporting healthy intestinal flora and cooling digestion."
  },
  {
    id: "eggs",
    name: "Eggs",
    serving: "2 whole eggs",
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
    fiber: 0,
    diets: ["Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Eggs"],
    benefit: "High-quality complete protein with choline for brain and nerve function."
  },
  {
    id: "grilled_chicken",
    name: "Grilled Chicken",
    serving: "150 g",
    calories: 240,
    protein: 45,
    carbs: 0,
    fat: 5,
    fiber: 0,
    diets: ["Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: [],
    benefit: "Lean, low-fat protein essential for muscle growth and recovery."
  },
  {
    id: "fish",
    name: "Fish / Salmon",
    serving: "150 g",
    calories: 250,
    protein: 32,
    carbs: 0,
    fat: 12,
    fiber: 0,
    diets: ["Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Fish"],
    benefit: "Rich in Omega-3 fatty acids for cardiovascular and joint health."
  },

  // 3. Whole Grains & Staples
  {
    id: "roti",
    name: "Roti / Chapati",
    serving: "2 rotis (70 g)",
    calories: 160,
    protein: 5,
    carbs: 32,
    fat: 1,
    fiber: 4,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: ["Wheat/Gluten"],
    benefit: "Traditional whole wheat staple supplying steady daily carbohydrates."
  },
  {
    id: "rice",
    name: "Brown Rice / Rice",
    serving: "150 g (1 cup cooked)",
    calories: 165,
    protein: 4,
    carbs: 35,
    fat: 1,
    fiber: 3,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "Easy-to-digest wholesome carbohydrate for daytime vitality."
  },
  {
    id: "oats",
    name: "Oats",
    serving: "40 g (dry)",
    calories: 155,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: ["Wheat/Gluten"],
    benefit: "Contains beta-glucan soluble fiber to help maintain healthy cholesterol."
  },
  {
    id: "sweet_potato",
    name: "Sweet Potato",
    serving: "150 g (1 medium)",
    calories: 130,
    protein: 3,
    carbs: 30,
    fat: 0,
    fiber: 4,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean"],
    allergens: [],
    benefit: "Rich in Vitamin A, potassium, and slow-burning carbohydrates."
  },

  // 4. Vegetables & Greens
  {
    id: "mixed_vegetables",
    name: "Mixed Vegetables / Sabzi",
    serving: "150 g (1 bowl)",
    calories: 60,
    protein: 3,
    carbs: 11,
    fat: 1,
    fiber: 4,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: [],
    benefit: "Provides essential vitamins, minerals, and dietary fiber with low calories."
  },
  {
    id: "spinach_palak",
    name: "Spinach / Palak",
    serving: "100 g",
    calories: 25,
    protein: 3,
    carbs: 4,
    fat: 0,
    fiber: 2,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: [],
    benefit: "High in iron, folate, and magnesium supporting cellular function."
  },
  {
    id: "broccoli_gobhi",
    name: "Broccoli / Cauliflower",
    serving: "120 g",
    calories: 40,
    protein: 3,
    carbs: 7,
    fat: 0,
    fiber: 3,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: [],
    benefit: "Cruciferous vegetable rich in antioxidants and Vitamin C."
  },

  // 5. Healthy Fats, Seeds & Nuts
  {
    id: "almonds",
    name: "Almonds / Badam",
    serving: "20 g (approx. 15 nuts)",
    calories: 120,
    protein: 4,
    carbs: 4,
    fat: 10,
    fiber: 2,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Tree Nuts"],
    benefit: "Vitamin E and magnesium supporting cellular defense and heart health."
  },
  {
    id: "walnuts",
    name: "Walnuts / Akhrot",
    serving: "20 g (approx. 5 halves)",
    calories: 130,
    protein: 3,
    carbs: 3,
    fat: 13,
    fiber: 1,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: ["Tree Nuts"],
    benefit: "Plant Omega-3s (ALA) promoting vascular and cognitive health."
  },
  {
    id: "chia_flax_seeds",
    name: "Chia / Flax Seeds",
    serving: "15 g (1 tbsp)",
    calories: 75,
    protein: 3,
    carbs: 5,
    fat: 5,
    fiber: 4,
    diets: ["Vegan", "Vegetarian", "Pescatarian", "Omnivore / Standard", "Mediterranean", "Keto / Low-Carb"],
    allergens: [],
    benefit: "Rich in soluble fiber that supports gut microbiome and satiety."
  }
];

/**
 * Calculates Body Mass Index (BMI)
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return { bmi: null, category: "N/A" };
  
  const heightMeters = heightCm / 100;
  const bmiValue = (weightKg / (heightMeters * heightMeters)).toFixed(1);
  const bmi = parseFloat(bmiValue);

  let category = "Balanced / Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 18.5 && bmi < 25) category = "Balanced / Normal";
  else if (bmi >= 25 && bmi < 30) category = "Overweight range";
  else category = "Obese range";

  return { bmi, category };
}

/**
 * Calculates Estimated Daily Nutrition Targets
 * Uses Mifflin-St Jeor Formula for BMR and activity multipliers for TDEE
 */
export function calculateDailyNutritionTargets(profile) {
  const weight = Number(profile.weight) || 70;
  const height = Number(profile.height) || 175;
  const age = Number(profile.age) || 25;
  const gender = profile.gender || "Male";
  const exercise = profile.exerciseLevel || "Moderate";
  const goal = profile.goal || "Weight Maintenance";
  const diet = profile.dietPreference || "Omnivore / Standard";

  // 1. Basal Metabolic Rate (BMR)
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === "Female") {
    bmr -= 161;
  } else if (gender === "Male") {
    bmr += 5;
  } else {
    bmr -= 80;
  }

  // 2. Activity Multiplier -> TDEE
  let activityMultiplier = 1.55;
  if (exercise === "Sedentary") activityMultiplier = 1.2;
  else if (exercise === "Light") activityMultiplier = 1.375;
  else if (exercise === "Moderate") activityMultiplier = 1.55;
  else if (exercise === "Active") activityMultiplier = 1.725;
  else if (exercise === "Very Active") activityMultiplier = 1.9;

  const tdee = Math.round(bmr * activityMultiplier);

  // 3. Goal Calorie Adjustment
  let estimatedCalories = tdee;
  if (goal.includes("Weight Loss")) {
    estimatedCalories = Math.max(1250, tdee - 400);
  } else if (goal.includes("Muscle Gain")) {
    estimatedCalories = tdee + 350;
  }

  // 4. Macronutrient Targets
  let proteinMultiplier = 1.3;
  if (goal.includes("Muscle Gain")) proteinMultiplier = 1.8;
  else if (goal.includes("Weight Loss")) proteinMultiplier = 1.5;

  const proteinGrams = Math.round(weight * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;

  let fatPercent = 0.28;
  if (diet.includes("Keto")) fatPercent = 0.65;

  const fatCalories = estimatedCalories * fatPercent;
  const fatGrams = Math.round(fatCalories / 9);

  let carbCalories = estimatedCalories - (proteinCalories + fatCalories);
  if (carbCalories < 0) carbCalories = 0;
  let carbGrams = Math.round(carbCalories / 4);

  if (diet.includes("Keto")) {
    carbGrams = Math.min(45, carbGrams);
  }

  // 5. Fiber & Water
  const fiberGrams = Math.round((estimatedCalories / 1000) * 14);
  
  let waterLiters = (weight * 0.035);
  if (exercise === "Active" || exercise === "Very Active") waterLiters += 0.5;

  return [
    {
      label: "Estimated Calories",
      value: estimatedCalories,
      unit: "kcal / day",
      explanation: "Estimated daily energy requirement based on your body metrics and activity."
    },
    {
      label: "Protein Target",
      value: proteinGrams,
      unit: "g / day",
      explanation: "Supports muscle recovery, cellular repair, and daily satiety."
    },
    {
      label: "Carbohydrates",
      value: carbGrams,
      unit: "g / day",
      explanation: "Clean energy fuel for active muscles and brain function."
    },
    {
      label: "Healthy Fats",
      value: fatGrams,
      unit: "g / day",
      explanation: "Essential for hormone balance, joint lubrication, and nutrient absorption."
    },
    {
      label: "Dietary Fiber",
      value: Math.max(25, fiberGrams),
      unit: "g / day",
      explanation: "Promotes digestive motility, gut microbiome diversity, and heart health."
    },
    {
      label: "Daily Hydration",
      value: waterLiters.toFixed(1),
      unit: "L / day",
      explanation: "Baseline water target to support organ function and physical performance."
    }
  ];
}

/**
 * Generates a Personalized 4-Meal Plan (Breakfast, Lunch, Snacks, Dinner)
 * Respects user's diet, wellness goal, activity, allergies, and health conditions
 */
export function generateMealPlan(profile, activeAllergies = []) {
  const diet = profile.dietPreference || "Omnivore / Standard";
  const goal = profile.goal || "Weight Maintenance";
  const isVegan = diet.includes("Vegan");
  const isVegetarian = diet.includes("Vegetarian");
  const isPescatarian = diet.includes("Pescatarian");
  const isKeto = diet.includes("Keto");

  const hasAllergy = (allergenKeyword) => {
    return activeAllergies.some(a => a.toLowerCase().includes(allergenKeyword.toLowerCase()));
  };

  const hasDairyAllergy = hasAllergy("dairy") || hasAllergy("milk") || hasAllergy("curd") || hasAllergy("paneer");
  const hasGlutenAllergy = hasAllergy("wheat") || hasAllergy("gluten");
  const hasEggAllergy = hasAllergy("egg");
  const hasNutAllergy = hasAllergy("nut") || hasAllergy("peanut");
  const hasSoyAllergy = hasAllergy("soy");

  // --- 1. Breakfast ---
  let breakfast = {
    title: "Breakfast",
    time: "8:00 AM – 9:00 AM",
    items: [],
    note: ""
  };

  if (isKeto) {
    if (!hasEggAllergy && !isVegan) {
      breakfast.items = ["2-3 Egg Omelette with spinach & mushrooms", "1/2 Avocado with pinch of black pepper", "Green tea or black coffee (no sugar)"];
    } else if (!hasDairyAllergy) {
      breakfast.items = ["Grilled Paneer (100g) with sautéed capsicum & palak", "10-12 Almonds or Walnuts", "Warm lemon water"];
    } else {
      breakfast.items = ["Tofu scramble with spinach, tomatoes & olive oil", "Chia seed pudding with water/almond milk", "Green tea"];
    }
    breakfast.note = "High healthy fats and low net carbs to maintain ketosis.";
  } else if (isVegan) {
    if (goal.includes("Muscle Gain")) {
      breakfast.items = [
        !hasSoyAllergy ? "Tofu Scramble with mixed vegetables & turmeric" : "Sprouts Chaat with onions, tomatoes & lemon",
        !hasGlutenAllergy ? "2 Whole Wheat Rotis or Toast" : "1 bowl Warm Oats / Poha",
        !hasNutAllergy ? "Handful of Almonds & Walnuts" : "1 tbsp Chia / Flax Seeds"
      ];
      breakfast.note = "High plant-based protein with complex carbs for muscle building.";
    } else {
      breakfast.items = [
        "Vegetable Poha or Upma with mixed peas & carrots",
        "1 bowl of Steamed Moong Sprouts with lemon juice",
        "1 Fresh seasonal fruit (Apple / Banana / Papaya)"
      ];
      breakfast.note = "Light, energizing breakfast with good fiber and micronutrients.";
    }
  } else if (isVegetarian) {
    if (goal.includes("Muscle Gain")) {
      breakfast.items = [
        !hasDairyAllergy ? "1 Paneer stuffed Roti / Paratha with 1 cup fresh Curd" : "Sprouts salad with boiled chickpeas & lemon",
        !hasGlutenAllergy ? "1 bowl of Oats Porridge with seeds & sliced fruit" : "3 Steamed Idlis with Vegetable Sambar",
        !hasNutAllergy ? "10-12 Almonds & Walnuts" : "1 tbsp Chia seeds"
      ];
      breakfast.note = "Protein-rich vegetarian start to support muscle protein synthesis.";
    } else if (goal.includes("Weight Loss")) {
      breakfast.items = [
        "2 Steamed Idlis with Vegetable Sambar (rich in drumsticks & veggies)",
        !hasDairyAllergy ? "1 small cup Curd / Yogurt" : "1 small bowl Moong Sprouts",
        "Green Tea or Warm Cumin (Jeera) Water"
      ];
      breakfast.note = "Steamed, fermented, low-oil breakfast promoting gentle satiety.";
    } else {
      breakfast.items = [
        "Vegetable Upma or Poha with grated coconut & lemon",
        !hasDairyAllergy ? "1 cup fresh Curd or Chaas (Buttermilk)" : "1 bowl Fruit Salad",
        !hasNutAllergy ? "Handful of soaked Almonds" : "1 tbsp Flax seeds"
      ];
      breakfast.note = "Wholesome, balanced breakfast with steady carbohydrate release.";
    }
  } else {
    // Non-Vegetarian / Mixed / Pescatarian
    if (goal.includes("Muscle Gain")) {
      breakfast.items = [
        !hasEggAllergy ? "3 Eggs (2 whole + 1 white, boiled or scrambled)" : "1 bowl Moong Sprouts with Paneer",
        !hasGlutenAllergy ? "2 Whole Wheat Rotis or Toast" : "1 bowl Oatmeal with seeds",
        "1 Banana or Apple with a glass of water"
      ];
      breakfast.note = "Complete animal and complex grain protein for early muscle fueling.";
    } else if (goal.includes("Weight Loss")) {
      breakfast.items = [
        !hasEggAllergy ? "2 Boiled Eggs with sautéed spinach and black pepper" : "Vegetable Poha with roasted chana",
        !hasGlutenAllergy ? "1 slice Whole Wheat Toast or 1 small Roti" : "1 bowl fresh fruit",
        "Warm Green Tea with lemon"
      ];
      breakfast.note = "High protein and fiber with modest calories to sustain energy.";
    } else {
      breakfast.items = [
        !hasEggAllergy ? "2 Eggs (Omelette with onion, tomato & green chilies)" : "2 Steamed Idlis with Sambar",
        !hasGlutenAllergy ? "2 Whole Wheat Rotis" : "1 bowl Poha with vegetables",
        "1 cup seasonal fresh fruit"
      ];
      breakfast.note = "Balanced start providing steady protein and clean carbohydrates.";
    }
  }

  // --- 2. Lunch ---
  let lunch = {
    title: "Lunch",
    time: "1:00 PM – 2:00 PM",
    items: [],
    note: ""
  };

  if (isKeto) {
    lunch.items = [
      !isVegan && !isVegetarian ? "Grilled Chicken or Fish (150g)" : (!hasDairyAllergy ? "Paneer Tikka (120g)" : "Grilled Tofu (150g)"),
      "Large Green Salad (Cucumber, Spinach, Olive Oil, Lemon)",
      "Sautéed Broccoli, Zucchini, and Bell Peppers"
    ];
    lunch.note = "Nutrient-dense, low-carb meal with clean protein and green leafy vegetables.";
  } else if (isVegan) {
    lunch.items = [
      !hasGlutenAllergy ? "2 Whole Wheat Rotis or 1 cup Brown Rice" : "1.5 cups Brown Rice / Quinoa",
      "1 large bowl of Dal, Rajma, or Chole (Chickpeas)",
      "1 bowl Mixed Vegetable Sabzi (Palak, Gobhi, Bhindi, or Beans)",
      "Fresh Cucumber, Tomato, and Carrot Salad with lemon"
    ];
    lunch.note = "Classic wholesome combination of grains and legumes forming complete proteins.";
  } else if (isVegetarian) {
    lunch.items = [
      !hasGlutenAllergy ? "2 Whole Wheat Rotis and 1/2 cup Rice" : "1 cup Brown Rice / Millets",
      "1 bowl Dal / Sambar / Rajma",
      !hasDairyAllergy ? "1 bowl Paneer Sabzi or 1 cup Curd (Dahi)" : "1 bowl Mixed Vegetable Sabzi",
      "Fresh Green Salad with lemon squeeze"
    ];
    lunch.note = "Balanced plate model: 1/2 vegetables & salad, 1/4 lentils/protein, 1/4 grains.";
  } else {
    // Non-Vegetarian / Mixed
    lunch.items = [
      "150g Grilled Chicken Curry or Fish Curry",
      !hasGlutenAllergy ? "2 Whole Wheat Rotis or 1 cup Rice" : "1 cup Steamed Rice / Quinoa",
      "1 bowl Dal or Vegetable Sambar",
      "Fresh Cucumber & Onion Salad with lemon"
    ];
    lunch.note = "Lean animal protein paired with whole grains, legumes, and fresh fiber.";
  }

  // --- 3. Evening Snacks ---
  let snacks = {
    title: "Evening Snack",
    time: "4:30 PM – 5:30 PM",
    items: [],
    note: ""
  };

  if (goal.includes("Weight Loss")) {
    snacks.items = [
      "1 small bowl Roasted Chana with a pinch of chaat masala",
      "1 cup Green Tea or Spiced Buttermilk (Chaas)",
      "1 small seasonal fruit (Apple, Guava, or Orange)"
    ];
    snacks.note = "Low-calorie crunchy snack providing fiber and keeping evening cravings away.";
  } else if (goal.includes("Muscle Gain")) {
    snacks.items = [
      "1 bowl Boiled Moong Sprouts Chaat with tomatoes & coriander",
      !hasDairyAllergy && !isVegan ? "1 cup Curd or Paneer cubes (50g)" : (!hasNutAllergy ? "Handful of roasted peanuts / almonds" : "1 bowl Roasted Chana"),
      !hasEggAllergy && !isVegan && !isVegetarian ? "2 Boiled Egg Whites" : "1 Banana with water"
    ];
    snacks.note = "Post-afternoon protein recharge to support tissue repair.";
  } else {
    snacks.items = [
      !hasNutAllergy ? "Handful of mixed nuts (Almonds, Walnuts)" : "1 bowl Roasted Makhana (Foxnuts)",
      "1 cup Green Tea, Spiced Tea, or Lemon Ginger Water",
      "1 Fresh seasonal fruit"
    ];
    snacks.note = "Healthy fats and polyphenols to maintain steady afternoon alertness.";
  }

  // --- 4. Dinner ---
  let dinner = {
    title: "Dinner",
    time: "7:30 PM – 8:30 PM",
    items: [],
    note: ""
  };

  if (goal.includes("Weight Loss")) {
    dinner.items = [
      !hasGlutenAllergy ? "1-2 Whole Wheat Rotis OR 1 bowl Vegetable Moong Dal Khichdi" : "1 bowl Moong Dal Khichdi / Rice",
      "1 bowl Yellow Dal or Clear Vegetable Soup",
      "1 bowl Steamed Vegetables / Lauki / Tinda / Palak Sabzi"
    ];
    dinner.note = "Light, easily digestible meal allowing optimal overnight fat metabolism and restful sleep.";
  } else if (goal.includes("Muscle Gain")) {
    dinner.items = [
      !isVegan && !isVegetarian ? "150g Grilled Chicken or Fish" : (!hasDairyAllergy ? "100g Grilled Paneer with Sabzi" : "1 bowl Soya chunks / Tofu curry"),
      !hasGlutenAllergy ? "2 Whole Wheat Rotis or 1 cup Rice" : "1 cup Steamed Rice / Quinoa",
      "1 bowl Dal or Lentil Soup with fresh salad"
    ];
    dinner.note = "Sustained amino acid supply to fuel overnight muscle protein synthesis.";
  } else {
    dinner.items = [
      !hasGlutenAllergy ? "2 Whole Wheat Rotis" : "1 bowl Rice or Khichdi",
      "1 bowl Dal / Sambar",
      "1 bowl Seasoned Vegetable Sabzi (Bhindi, Methi, or Mixed Veggies)",
      "Light cucumber salad"
    ];
    dinner.note = "Comforting, balanced dinner spaced at least 2 hours before bedtime.";
  }

  return [breakfast, lunch, snacks, dinner];
}

/**
 * Master Rule-Based Recommendation Generator
 * Takes user profile from Firestore and returns structured, sectioned recommendations
 */
export function generateWellnessRecommendations(profile) {
  if (!profile) return null;

  const diet = profile.dietPreference || "Omnivore / Standard";
  const goal = profile.goal || "Weight Maintenance";
  const exercise = profile.exerciseLevel || "Moderate";
  const weight = Number(profile.weight) || 70;
  const height = Number(profile.height) || 175;

  // Normalize Allergies Array
  let rawAllergies = [];
  if (Array.isArray(profile.foodAllergies)) {
    rawAllergies = profile.foodAllergies;
  } else if (typeof profile.foodAllergies === "string") {
    rawAllergies = profile.foodAllergies.split(",").map(s => s.trim());
  }
  const activeAllergies = rawAllergies.filter(item => item && item.toLowerCase() !== "none" && item.toLowerCase() !== "no");

  // Normalize Health Conditions Array
  let rawConditions = [];
  if (Array.isArray(profile.healthIssues)) {
    rawConditions = profile.healthIssues;
  } else if (typeof profile.healthIssues === "string") {
    rawConditions = profile.healthIssues.split(",").map(s => s.trim());
  }
  const activeConditions = rawConditions.filter(item => item && item.toLowerCase() !== "none" && item.toLowerCase() !== "no");

  const { bmi, category: bmiCategory } = calculateBMI(weight, height);
  const nutritionTargets = calculateDailyNutritionTargets(profile);

  // ------------------------------------------------------------------------
  // 1. Filter Foods by Diet & Goal Affinity
  // ------------------------------------------------------------------------
  let matchedFoods = FOOD_DATABASE.filter(food => {
    return food.diets.some(d => diet.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(diet.toLowerCase()));
  });

  // ------------------------------------------------------------------------
  // 2. Strict Multi-Allergen Filtering
  // ------------------------------------------------------------------------
  if (activeAllergies.length > 0) {
    matchedFoods = matchedFoods.filter(food => {
      const foodNameLower = food.name.toLowerCase();
      const foodAllergens = food.allergens.map(a => a.toLowerCase());

      return !activeAllergies.some(userAllergy => {
        const ua = userAllergy.toLowerCase();

        // 1. Check food.allergens metadata array
        if (foodAllergens.some(fa => fa.includes(ua) || ua.includes(fa))) return true;

        // 2. Keyword checks on name
        if (ua.includes("peanut") && foodNameLower.includes("peanut")) return true;
        if ((ua.includes("tree nut") || ua.includes("nut")) && (foodNameLower.includes("almond") || foodNameLower.includes("walnut") || foodNameLower.includes("nut") || foodNameLower.includes("badam") || foodNameLower.includes("akhrot"))) return true;
        if ((ua.includes("dairy") || ua.includes("milk") || ua.includes("curd") || ua.includes("paneer")) && (foodNameLower.includes("yogurt") || foodNameLower.includes("cheese") || foodNameLower.includes("curd") || foodNameLower.includes("paneer") || foodNameLower.includes("milk"))) return true;
        if ((ua.includes("egg") || ua.includes("eggs")) && foodNameLower.includes("egg")) return true;
        if ((ua.includes("wheat") || ua.includes("gluten")) && (foodNameLower.includes("wheat") || foodNameLower.includes("oats") || foodNameLower.includes("roti") || foodNameLower.includes("bread"))) return true;
        if (ua.includes("soy") && (foodNameLower.includes("tofu") || foodNameLower.includes("tempeh") || foodNameLower.includes("soya") || foodNameLower.includes("soy"))) return true;
        if ((ua.includes("fish") || ua.includes("seafood") || ua.includes("shellfish")) && (foodNameLower.includes("salmon") || foodNameLower.includes("fish") || foodNameLower.includes("cod") || foodNameLower.includes("shrimp"))) return true;
        if (ua.includes("sesame") && foodNameLower.includes("sesame")) return true;

        return foodNameLower.includes(ua);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Condition-Sensitive Food Sorting
  // ------------------------------------------------------------------------
  if (activeConditions.some(c => c.includes("High Blood Pressure") || c.includes("Heart Disease"))) {
    matchedFoods.sort((a, b) => (b.name.includes("Fish") || b.name.includes("Spinach") || b.name.includes("Dal")) ? 1 : -1);
  } else if (activeConditions.some(c => c.includes("Diabetes") || c.includes("Insulin"))) {
    matchedFoods.sort((a, b) => b.fiber - a.fiber);
  }

  // Select top 6 distinct, structured foods
  const finalRecommendedFoods = matchedFoods.slice(0, 6);

  // ------------------------------------------------------------------------
  // 4. Personalized 4-Meal Plan
  // ------------------------------------------------------------------------
  const mealPlan = generateMealPlan(profile, activeAllergies);

  // ------------------------------------------------------------------------
  // 5. Foods to Avoid / Limit (Consider Carefully)
  // ------------------------------------------------------------------------
  const foodsToLimit = [];

  // A. Prominent Allergen Alerts
  if (activeAllergies.length > 0) {
    activeAllergies.forEach(allergen => {
      foodsToLimit.push({
        type: "allergen",
        item: `⚠️ Strict Allergen: ${allergen.toUpperCase()}`,
        reason: "Zero tolerance. Avoid all food items and packaged goods containing or processed with this ingredient."
      });
    });
  }

  // B. Standard & Goal-Based Limitations
  foodsToLimit.push({
    type: "general",
    item: "Sugar-Sweetened Beverages & Commercial Sodas",
    reason: "Causes sharp glycemic spikes with zero micronutrient density."
  });

  foodsToLimit.push({
    type: "general",
    item: "Deep-Fried Snacks & Reheated Seed Oils",
    reason: "High in oxidized trans-fats and excess calories that promote inflammation."
  });

  foodsToLimit.push({
    type: "general",
    item: "Ultra-Processed Packaged Snacks & Sodium-Heavy Goods",
    reason: "Contains artificial emulsifiers, excess sodium, and preservative additives."
  });

  if (goal.includes("Weight Loss")) {
    foodsToLimit.push({
      type: "goal",
      item: "Commercial High-Calorie Coffee Drinks & Creamy Dressings",
      reason: "High caloric density with minimal satiety benefit."
    });
  } else if (activeConditions.some(c => c.includes("Blood Pressure") || c.includes("Heart"))) {
    foodsToLimit.push({
      type: "health",
      item: "Excessively Salty / Cured Packaged Foods",
      reason: "High sodium concentrations can elevate arterial pressure."
    });
  } else if (activeConditions.some(c => c.includes("Digestive"))) {
    foodsToLimit.push({
      type: "health",
      item: "Excessive Caffeine & Artificial Non-Nutritive Sweeteners",
      reason: "Can irritate the mucosal lining of the gastrointestinal tract."
    });
  }

  // ------------------------------------------------------------------------
  // 6. Lifestyle & Daily Habit Tips
  // ------------------------------------------------------------------------
  const lifestyleTips = [
    {
      category: "Movement & Exercise",
      icon: "🏃",
      tip: exercise === "Sedentary"
        ? "Aim for 20–30 minutes of continuous brisk walking daily with hourly posture breaks."
        : "Maintain 150+ minutes of weekly aerobic movement combined with 2 full-body resistance sessions."
    },
    {
      category: "Restorative Sleep",
      icon: "🌙",
      tip: "Target 7–8.5 hours of dark, cool, screen-free sleep to facilitate metabolic repair and hormonal balance."
    },
    {
      category: "Hydration Strategy",
      icon: "💧",
      tip: "Pace your water intake evenly throughout the day to support cellular hydration and digestive function."
    },
    {
      category: "Mindful Nutrition",
      icon: "🥗",
      tip: "Chew meals slowly in a calm setting to optimize digestive enzyme activation and satiety signaling."
    }
  ];

  // ------------------------------------------------------------------------
  // 7. Condition-Sensitive Disclaimer
  // ------------------------------------------------------------------------
  let conditionDisclaimer = "";
  if (activeConditions.length > 0) {
    conditionDisclaimer = `You noted health considerations: "${activeConditions.join(", ")}". These recommendations represent general wellness and educational guidance, not medical prescriptions. Always consult a qualified healthcare professional or dietitian for condition-specific advice.`;
  }

  const disclaimer = "The Wellness Equation provides educational lifestyle guidelines based on general health principles. This information does not constitute medical diagnosis, treatment, or prescription. Always consult a qualified healthcare professional before beginning any major dietary or physical activity changes.";

  return {
    metrics: {
      name: profile.name || "Wellness Member",
      age: profile.age,
      gender: profile.gender,
      height,
      weight,
      bmi,
      bmiCategory,
      dietPreference: diet,
      exerciseLevel: exercise,
      goal,
      allergies: activeAllergies.length ? activeAllergies.join(", ") : "None declared",
      conditions: activeConditions.length ? activeConditions.join(", ") : "None declared",
      conditionDisclaimer
    },
    nutritionTargets,
    recommendedFoods: finalRecommendedFoods,
    mealPlan,
    foodsToLimit,
    lifestyleTips,
    disclaimer
  };
}
