// The VERY FIRST line of your application should be to load the config.  
import './config. js';

import express from 'express';
import cors from 'cors';
import roadmapRouter from './routes/roadmap.js';
import authRouter from './routes/auth.js';
import connectDB from './db/connection.js';

// --- Database Connection ---
connectDB();

// --- Server Setup ---
const app = express();
const PORT = process.env. PORT || 3001;

// Updated CORS configuration for Vercel
const corsOptions = {
  origin: [
    'http://localhost:5173', // Development
    'https://pathfinder-ai-mu.vercel.app', // Production - replace with your actual Vercel URL
    process.env.FRONTEND_URL // From environment variable
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/roadmap', roadmapRouter);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running and listening on port ${PORT}`);
  if (process.env. GROQ_API_KEY) {
    console.log('✅ Groq API Key loaded successfully.');
  } else {
    console.error('❌ FATAL ERROR:  GROQ_API_KEY not found! ');
  }
});
