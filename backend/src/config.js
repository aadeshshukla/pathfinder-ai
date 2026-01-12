import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['GROQ_API_KEY'];
requiredEnvVars. forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ FATAL: Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// JWT and MongoDB are optional but recommended
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set.  Using default (insecure for production!)');
}

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  WARNING:  MONGODB_URI not set. Using default local MongoDB');
}

export default {
  port: process.env.PORT || 3001,
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:5173',
  groqApiKey: process.env. GROQ_API_KEY,
  jwtSecret: process. env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pathfinder-ai'
};
