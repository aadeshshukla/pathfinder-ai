// Express route for /api/roadmap
import express from "express";
import { validateRoadmapInput } from "../ai/schemas.js";
import { buildRoadmapPrompt } from "../ai/promptBuilder.js";
import { callGeminiJSON } from "../ai/modelAdapter.js";
import { parseRoadmapJSON } from "../ai/parse.js";

const router = express.Router();

// POST /api/roadmap
router.post("/", async (req, res) => {
  const input = req.body || {};
  const { ok, errors } = validateRoadmapInput(input);
  if (!ok) return res.status(400).json({ ok: false, error: "INVALID_INPUT", details: errors });

  const prompt = buildRoadmapPrompt(input);

  try {
    const raw = await callGeminiJSON({ prompt });
    const data = parseRoadmapJSON(raw);
    return res.json({ ok: true, data });
  } catch (err) {
    console.error("[/api/roadmap] error:", err);
    return res
      .status(502)
      .json({ ok: false, error: "MODEL_ERROR", message: String(err.message || err) });
  }
});

export default router;
