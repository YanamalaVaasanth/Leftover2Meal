export interface IngredientMatch {
  matchPercentage: number;
  availableIngredients: string[];
  missingIngredients: string[];
  totalIngredients: number;
}

export function calculateIngredientMatch(
  userIngredients: string[],
  recipeIngredients: string[]
): IngredientMatch {
  if (!userIngredients.length || !recipeIngredients.length) {
    return {
      matchPercentage: 0,
      availableIngredients: [],
      missingIngredients: recipeIngredients,
      totalIngredients: recipeIngredients.length,
    };
  }

  // Normalize ingredients for better matching
  const normalizeIngredient = (ing: string) => {
    return ing
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();
  };

  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);
  const available: string[] = [];
  const missing: string[] = [];

  recipeIngredients.forEach((recipeIng) => {
    const normalized = normalizeIngredient(recipeIng);
    const isAvailable = normalizedUserIngredients.some((userIng) =>
      normalized.includes(userIng) || userIng.includes(normalized)
    );

    if (isAvailable) {
      available.push(recipeIng);
    } else {
      missing.push(recipeIng);
    }
  });

  const matchPercentage = Math.round(
    (available.length / recipeIngredients.length) * 100
  );

  return {
    matchPercentage,
    availableIngredients: available,
    missingIngredients: missing,
    totalIngredients: recipeIngredients.length,
  };
}

export function extractRecipeIngredients(recipe: any): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim());
    }
  }
  return ingredients;
}
