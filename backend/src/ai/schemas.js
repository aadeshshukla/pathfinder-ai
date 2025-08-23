// JSON schema definitions for roadmap validation
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

// This is the actual schema object for the AI prompt
export const roadmapSchema = {
  "type": "object",
  "required": ["milestones", "timeline", "resources"],
  "properties": {
    "milestones": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "title", "description", "estimatedDays", "tasks"],
        "properties": {
          "id": {
            "type": "string",
            "description": "stable slug, kebab-case"
          },
          "title": {
            "type": "string",
            "description": "milestone title"
          },
          "description": {
            "type": "string",
            "description": "detailed description of the milestone"
          },
          "estimatedDays": {
            "type": "number",
            "description": "integer number of days estimated for this milestone"
          },
          "tasks": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "array of actionable tasks for this milestone"
          }
        }
      }
    },
    "timeline": {
      "type": "object",
      "required": ["totalDays"],
      "properties": {
        "totalDays": {
          "type": "number",
          "description": "total estimated days for the entire roadmap"
        },
        "rationale": {
          "type": "string",
          "description": "explanation of timeline calculation"
        }
      }
    },
    "resources": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "type", "link"],
        "properties": {
          "name": {
            "type": "string",
            "description": "name of the resource"
          },
          "type": {
            "type": "string",
            "enum": ["Video", "Article", "Course", "Documentation", "Book", "Tool", "Repository"],
            "description": "type of the resource"
          },
          "link": {
            "type": "string",
            "format": "uri",
            "description": "valid URL to the resource"
          }
        }
      }
    },
    "tips": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "optional learning tips"
    }
  }
};

export const ROADMAP_OUTPUT_SPEC = `
Return ONLY JSON matching this exact structure:

{
  "milestones": [
    {
      "id": "milestone-1",
      "title": "Milestone Title",
      "description": "Detailed description of what this milestone covers",
      "estimatedDays": 14,
      "tasks": [
        "Specific task 1",
        "Specific task 2",
        "Specific task 3"
      ]
    }
  ],
  "timeline": {
    "totalDays": 42,
    "rationale": "Explanation of how the timeline was calculated"
  },
  "resources": [
    {
      "name": "Resource Name",
      "type": "Video",
      "link": "https://example.com/resource"
    }
  ],
  "tips": [
    "Helpful learning tip 1",
    "Helpful learning tip 2"
  ]
}

CRITICAL: The "timeline" object MUST include BOTH "totalDays" (number) AND "rationale" (string) fields.
No prose, no markdown fences, no extra keys — only that JSON object.
`;
  