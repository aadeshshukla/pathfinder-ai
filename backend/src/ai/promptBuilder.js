// Builds AI prompt from user input
import { ROADMAP_OUTPUT_SPEC } from "./schemas.js";

export function buildRoadmapPrompt({ goal, skills = [], time = {}, preferences = {} }) {
  const lines = [];
  lines.push("You are Pathfinder AI, a planner that outputs STRICT JSON only.");
  lines.push(`Goal: ${goal}`);
  if (skills.length) lines.push(`Known skills: ${skills.join(", ")}`);
  if (time && (time.hoursPerDay || time.duration || time.unit)) {
    lines.push(
      `Time: ${time.hoursPerDay ?? "?"} h/day for ${time.duration ?? "?"} ${time.unit ?? "days"}`
    );
  }
  if (Object.keys(preferences || {}).length) {
    lines.push(`Preferences: ${JSON.stringify(preferences)}`);
  }
  lines.push("Constraints: be practical, project-centric, incremental.");
  lines.push("Each milestone must have action-verb tasks (Build, Implement, Integrate...).");
  lines.push("Adjust difficulty to the provided skills and time.");
  lines.push("");
  lines.push("Schema (MANDATORY):");
  lines.push(ROADMAP_OUTPUT_SPEC);

  return lines.join("\n");
}
