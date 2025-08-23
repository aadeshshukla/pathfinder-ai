import express from "express";
import rateLimit from "express-rate-limit";
import { validateRoadmapInput } from "../ai/schemas.js";
import { buildPrompt } from "../ai/promptBuilder.js";
import { generateContent } from "../ai/modelAdapter.js";
import { parseRoadmapJSON } from "../ai/parse.js";

/**
 * Basic IP-level rate limiting (tune values as needed)
 * Prevents local bursts that could amplify upstream 429s.
 */
const roadmapLimiter = rateLimit({
  windowMs: 60 * 1000,          // 1 minute window
  max: 5,                       // max 5 roadmap generations / minute / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "RATE_LIMIT", message: "Too many roadmap requests. Please wait and retry." }
});

const router = express.Router();
router.use(roadmapLimiter);

// POST /api/roadmap
router.post("/", async (req, res) => {
  const input = req.body || {};
  const { ok, errors } = validateRoadmapInput(input);
  if (!ok) {
    return res.status(400).json({ ok: false, error: "INVALID_INPUT", details: errors });
  }

  const prompt = buildPrompt(input);

  try {
    const raw = await generateContent(prompt);
    const data = parseRoadmapJSON(raw);   // fixed function name
    return res.json({ ok: true, data });
  } catch (err) {
    // Distinguish different error categories if generateContent throws structured errors
    const status = err.status || err.code || 500;
    const isRateLimit = status === 429 || /rate limit/i.test(err.message);
    const clientStatus = isRateLimit ? 429 : (status >= 400 && status < 600 ? status : 502);

    if (isRateLimit && err.retryAfter) {
      res.setHeader("Retry-After", err.retryAfter);
    }

    console.error("[/api/roadmap] error:", {
      message: err.message,
      stack: err.stack,
      statusHint: status,
      provider: err.provider || "unknown"
    });

    return res.status(clientStatus).json({
      ok: false,
      error: isRateLimit ? "RATE_LIMITED" : "MODEL_ERROR",
      message: isRateLimit
        ? "Rate limit reached. Please wait before retrying."
        : (err.publicMessage || "Model processing failed."),
      details: process.env.NODE_ENV === "development" ? { rawMessage: err.message } : undefined
    });
  }
});

export default router;
