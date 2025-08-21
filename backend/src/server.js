// Express server setup
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import roadmapRouter from "./routes/roadmap.js";

dotenv.config();
console.log("--- Verifying Environment Variables ---");
console.log("Loaded GEMINI_API_KEY:", process.env.GOOGLE_API_KEY ? `...${process.env.GOOGLE_API_KEY.slice(-4)}` : "Not Found!");
console.log("------------------------------------");

const app = express();
app.use(cors()); // allow localhost frontend, tighten later in prod
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/roadmap", roadmapRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Pathfinder AI backend (Gemini) running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running...");
});
