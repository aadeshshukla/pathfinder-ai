import dotenv from 'dotenv';
import path from 'path';

console.log('--- Running Environment Check ---');
console.log('Current working directory:', process.cwd());

const envPath = path.resolve(process.cwd(), '.env');
console.log('Attempting to load .env file from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error.message);
} else {
  console.log('✅ .env file loaded successfully.');
  console.log('Parsed variables:', result.parsed);
}

console.log('--- Checking for GROQ_API_KEY ---');
if (process.env.GROQ_API_KEY) {
  console.log('✅ SUCCESS: GROQ_API_KEY was found!');
} else {
  console.error('❌ FAILURE: GROQ_API_KEY is missing or empty.');
}
console.log('---------------------------------');