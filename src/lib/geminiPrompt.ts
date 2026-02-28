// Gemini API prompt for calorie-aware recipe suggestions
// Ensures strict JSON output for AI agent

export function buildGeminiRecipePrompt({
  ingredients,
  dietary,
  calorieTarget,
}: {
  ingredients: string[];
  dietary: "veg" | "non-veg";
  calorieTarget: number;
}) {
  return `
You are a metabolic AI chef. Given the following user context, return a single recipe as a JSON object with these fields:
- name (string)
- steps (array of strings)
- ingredients (array of strings)
- estimatedCalories (number, kcal)

User context:
- Ingredients: ${ingredients.join(", ")}
- Dietary: ${dietary === "veg" ? "Vegetarian" : "Non-Vegetarian"}
- Calorie Target: ${calorieTarget} kcal

Rules:
- Only return a valid JSON object, no extra text.
- The recipe's estimatedCalories must be as close as possible to the calorieTarget.
- If not possible, return the closest healthy meal.
- Use only the provided ingredients.

Example output:
{
  "name": "High Protein Veggie Bowl",
  "steps": ["Chop vegetables", "Sauté in olive oil", "Add spices", "Serve warm"],
  "ingredients": ["broccoli", "chickpeas", "olive oil", "spices"],
  "estimatedCalories": 480
}
`;
}
