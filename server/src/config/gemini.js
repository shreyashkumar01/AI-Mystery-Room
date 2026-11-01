import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance = null;

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
};

export const getGeminiModelName = () => {
  return process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";
};
