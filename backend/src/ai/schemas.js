// JSON schema definitions for roadmap validation
// Minimal input validation and output schema spec

export function validateRoadmapInput(payload = {}) {
    const errors = [];
    const isStr = (v) => typeof v === "string";
    const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  
    if (!isStr(payload.goal) || !payload.goal.trim()) {
      errors.push("goal must be a non-empty string");
    }
  
    if (payload.skills && !Array.isArray(payload.skills)) {
      errors.push("skills must be an array of strings");
    } else if (Array.isArray(payload.skills)) {
      if (payload.skills.some((s) => typeof s !== "string"))
        errors.push("every skill in skills must be a string");
      if (payload.skills.length > 30)
        errors.push("too many skills (max 30)");
    }
  
    if (payload.time && !isObj(payload.time)) {
      errors.push("time must be an object");
    } else if (isObj(payload.time)) {
      const { hoursPerDay, duration, unit } = payload.time;
      if (hoursPerDay != null && typeof hoursPerDay !== "number")
        errors.push("time.hoursPerDay must be a number");
      if (duration != null && typeof duration !== "number")
        errors.push("time.duration must be a number");
      if (unit != null && !["days", "weeks", "months"].includes(unit))
        errors.push("time.unit must be one of days|weeks|months");
    }
  
    if (payload.preferences && !isObj(payload.preferences)) {
      errors.push("preferences must be an object");
    }
  
    if (payload.goal && payload.goal.length > 200) {
      errors.push("goal is too long (max 200 chars)");
    }
  
    return { ok: errors.length === 0, errors };
  }
  
  export const ROADMAP_OUTPUT_SPEC = `
  Return ONLY JSON matching this type:
  
  {
    "milestones": Array<{
      "id": string,                 // stable slug, kebab-case
      "title": string,
      "description": string,
      "estimatedDays": number,      // integer
      "tasks": string[]             // actionable items
    }>,
    "timeline": {
      "totalDays": number,
      "rationale": string
    },
    "resources": Array<{
      "name": string,
      "type": "course"|"doc"|"video"|"tool"|"repo",
      "link": string
    }>,
    "tips": string[]
  }
  
  No prose, no markdown fences, no extra keys — only that JSON object.
  `;
  