import dotenv from 'dotenv';
import path from 'path'; // Import the 'path' module
import { fileURLToPath } from 'url'; // Import helper for ES modules
import { generateRoadmap } from './modelAdapter.js';

// --- Start of new, robust path configuration ---
// This safely constructs the correct path to your .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env'); // Go up two directories from /src/ai to /backend
dotenv.config({ path: envPath });
// --- End of new configuration ---

async function runTest() {
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ ERROR: GROQ_API_KEY not found!');
    console.error('Please double-check the following:');
    console.error('1. Is your .env file located in the root of the /backend folder?');
    console.error('2. Is the variable name exactly GROQ_API_KEY ?');
    console.error('3. Did you save the .env file?');
    return;
  }
  console.log('✅ Groq API Key loaded.');

  const testInput = {
    goal: 'Learn about Quantum Computing',
    skillLevel: 'Absolute Beginner',
    learningStyle: 'Video Lectures',
    timeCommitment: '3 hours per week',
  };

  try {
    const roadmap = await generateRoadmap(testInput);
    console.log('\n✅ SUCCESS! Received roadmap from Groq:\n');
    console.log(JSON.stringify(roadmap, null, 2));
  } catch (error) {
    console.error('\n❌ FAILED to get roadmap from Groq.');
    console.error('Error Details:', error.message);
  }
}

runTest();