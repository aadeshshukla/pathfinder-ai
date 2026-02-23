// The VERY FIRST line of your application should be to load the config.
import './config.js';

import express from 'express';
import cors from 'cors';
import roadmapRouter from './routes/roadmap.js';
import authRouter from './routes/auth.js';
import connectDB from './db/connection.js';

// --- Database Connection ---
connectDB();

// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3001;

/*
IMPORTANT:
Previous configuration was blocking Docker requests.
This dynamic CORS allows:
- Docker frontend
- localhost browser
- Vercel
without breaking security in development.
*/
app.use(cors({
  origin: true,
  credentials: true,
}));

// --- Middleware ---
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/roadmap', roadmapRouter);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// --- Start the Server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server is running and listening on port ${PORT}`);

  if (process.env.GROQ_API_KEY) {
    console.log('✅ Groq API Key loaded successfully.');
  } else {
    console.error('❌ FATAL ERROR: GROQ_API_KEY not found!');
  }
});
