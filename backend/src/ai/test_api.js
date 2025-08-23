import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from your .env file
dotenv.config();

const testApiKey = async () => {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error('\n❌ ERROR: GOOGLE_API_KEY not found in .env file.');
    return;
  }

  console.log(`\n🔑 Found API Key ending in: ...${apiKey.slice(-4)}`);
  console.log('Attempting to make a single API call to Google AI...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Using a basic model for a simple test

    const prompt = "In one sentence, what is a large language model?";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ SUCCESS! The API call worked.');
    console.log('API Response:', text);

  } catch (error) {
    console.error('\n❌ FAILURE: The API call failed.');
    // Check if it's the 429 error
    if (error.message && error.message.includes('429')) {
      console.error('Error Details: You are still being rate-limited by Google. This confirms the issue is with your Google Cloud Project quota, not the application code.');
    } else {
      console.error('Error Details:', error);
    }
  }
};

testApiKey();