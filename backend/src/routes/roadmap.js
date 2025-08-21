import express from "express";
import { validateRoadmapInput } from "../ai/schemas.js";
import { buildPrompt } from "../ai/promptBuilder.js";         // Renamed from buildRoadmapPrompt
import { generateContent } from "../ai/modelAdapter.js";      // Renamed from callGeminiJSON
import { parseRoadmapJSON } from "../ai/parse.js";                   // Renamed from parseRoadmapJSON

const router = express.Router();

// POST /api/roadmap
router.post("/", async (req, res) => {
  const input = req.body || {};
  const { ok, errors } = validateRoadmapInput(input);
  if (!ok) return res.status(400).json({ ok: false, error: "INVALID_INPUT", details: errors });

  const prompt = buildPrompt(input); // Use the correct function name

  try {
    const raw = await generateContent(prompt); // Use the correct function name
    const data = parseJson(raw); // Use the correct function name
    return res.json({ ok: true, data });
    
  } catch (err) {
    console.error("[/api/roadmap] error:", err);
    return res
      .status(502)
      .json({ ok: false, error: "MODEL_ERROR", message: String(err.message || err) });
  }
});

export default router;
