// backend/src/ai/modelAdapter.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// Create a variable to hold the model, but don't initialize it yet.
let model;

/**
 * Initializes and returns the Generative AI model.
 * This function ensures the API key is loaded from the environment before the client is created.
 */
export const getModel = () => {
  // Only initialize the model if it hasn't been already.
  if (!model) {
    // Check if the API key exists. If not, throw a clear error.
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is missing in the environment. Please check your .env file.');
    }
    
    // Now that we've confirmed the key is loaded, create the client.
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
  }
  
  return model;
};

/**
 * Generates content using the AI model.
 * @param {string} prompt - The prompt to send to the model.
 * @returns {Promise<string>} - The generated text content.
 */
export const generateContent = async (prompt) => {
  const modelInstance = getModel();
  
  const result = await modelInstance.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  
  return text;
};
