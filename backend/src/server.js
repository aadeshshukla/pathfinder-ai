// The VERY FIRST line of your application should be to load the config.
import './config.js';

import express from 'express';
import cors from 'cors';
import roadmapRouter from './routes/roadmap.js';

// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/roadmap', roadmapRouter);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running and listening on port ${PORT}`);
  if (process.env.GROQ_API_KEY) {
    console.log('✅ Groq API Key loaded successfully.');
  } else {
    // This error should now be impossible to hit.
    console.error('❌ FATAL ERROR: GROQ_API_KEY not found!');
  }
});
