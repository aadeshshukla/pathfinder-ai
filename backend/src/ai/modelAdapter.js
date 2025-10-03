import Groq from 'groq-sdk';
import { buildPrompt } from './promptBuilder.js';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates a learning roadmap by calling the Groq API.
 * @param {object} userInput - The user's input from the frontend.
 * @returns {Promise<string>} - A promise that resolves to the raw JSON string from the AI.
 */
async function generateRoadmap(userInput) {
  const prompt = buildPrompt(userInput);
  console.log('Sending request to Groq API...');

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }, // Ask for JSON
      temperature: 0.5,
      max_tokens: 4096,
    });

    const jsonString = chatCompletion.choices[0]?.message?.content;

    if (!jsonString) {
      throw new Error('Received an empty response from Groq API.');
    }
    
    console.log('Successfully received response from Groq API.');
    return jsonString; // Return the raw string

  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to generate roadmap via Groq API.');
  }
}

export { generateRoadmap };
