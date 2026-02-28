import { GoogleGenAI } from "@google/genai";

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

const GEMINI_MODEL = "gemini-3-flash-preview";

export const testGeminiConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing Gemini API connection...");
    const apiKey = getApiKey();
    console.log("API Key:", apiKey.substring(0, 10) + "...");
    console.log("Model:", GEMINI_MODEL);

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Say "Hello! Gemini API is working correctly." in exactly 10 words or less.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    // Access .text property directly in the new SDK
    const text = response.text;

    console.log("✅ Gemini API Response:", text);
    console.log("✅ Connection successful!");
    return true;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message || error);
    console.error("Full error:", error);
    return false;
  }
};

