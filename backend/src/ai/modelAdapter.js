// Adapter to call AI provider APIs
import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = process.env.MODEL_NAME || "gemini-1.5-pro";

function getModel() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY missing in environment");
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  // Use systemInstruction + JSON-only response
  return genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction:
      "You are Pathfinder AI. You must return ONLY valid JSON with no markdown or commentary.",
  });
}

export async function callGeminiJSON({ prompt }) {
  const model = getModel();
  const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 1500,
    // Ask Gemini to emit JSON, which reduces fence issues a lot
    responseMimeType: process.env.STRICT_JSON === "false" ? undefined : "application/json",
  };

  // One-shot request (no multi-turn needed here)
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const text = result?.response?.text?.();
  if (!text || typeof text !== "string") {
    throw new Error("Empty model response");
  }
  return text.trim();
}
