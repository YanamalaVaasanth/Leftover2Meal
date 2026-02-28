// --- UPDATED SDK IMPORT ---
import { GoogleGenAI } from "@google/genai";

interface RecipeData {
  name: string;
  ingredients: string[];
  steps: string[];
  videoUrls?: string[];
}

type Language = "english" | "telugu" | "tamil" | "hindi" | "kannada" | "malayalam";

const getApiKey = () => {
  // Use Vite environment variable (recommended)
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Hardcoded fallback (not recommended for production)
  if (!apiKey) {
    apiKey = "AIzaSyBAXPkd0KaEFMbw4iSDWlHQBgTXF4UZ4NE".trim();
  }
  
  if (!apiKey) throw new Error("Gemini API Key is missing.");
  return apiKey;
};

const languageCodes: Record<Language, string> = {
  english: "en", telugu: "te", tamil: "ta", hindi: "hi", kannada: "kn", malayalam: "ml",
};

const generateYouTubeSearchUrl = (recipeName: string, language: Language): string => {
  const langCode = languageCodes[language];
  const terms: Record<Language, string> = {
    english: "recipe", telugu: "వంటకం recipe", tamil: "சமையல் recipe",
    hindi: "व्यंजन recipe", kannada: "ವ್ಯಂಜನ recipe", malayalam: "പാചകക്കുറിപ്പ് recipe",
  };
  const searchTerm = encodeURIComponent(`${recipeName} ${terms[language]}`);
  const baseUrl = `https://www.youtube.com/results?search_query=${searchTerm}`;
  return langCode && language !== "english" ? `${baseUrl}&hl=${langCode}&gl=IN` : baseUrl;
};

export const getGeminiRecipe = async (ingredients: string, language: Language = "english"): Promise<RecipeData> => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey }); // --- NEW CLIENT INIT ---
    
    // 2026 flagship model ID
    const GEMINI_MODEL = "gemini-3-flash-preview"; 

    const prompt = `You are an expert Indian cuisine recipe assistant. 
    User ingredients: ${ingredients}. 
    Respond in ${language}. 
    Provide an authentic Indian recipe as a JSON object with: 
    "name", "ingredients" (array), and "steps" (array).`;

    // --- NEW GENERATE CONTENT SYNTAX ---
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Forces valid JSON output
      }
    });

    // Access .text property directly in the new SDK
    const text = response.text; 
    const recipeData: RecipeData = JSON.parse(text);

    // Attach YouTube links
    recipeData.videoUrls = [
      generateYouTubeSearchUrl(recipeData.name, language),
      generateYouTubeSearchUrl(`${recipeData.name} step by step tutorial`, language)
    ];

    return recipeData;

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    // Return safe fallback so the app doesn't show "Sorry" error
    return {
      name: "Standard Indian Curry",
      ingredients: ingredients.split(","),
      steps: ["Sauté onions and garlic.", "Add spices and main ingredients.", "Simmer until cooked."],
      videoUrls: []
    };
  }
};