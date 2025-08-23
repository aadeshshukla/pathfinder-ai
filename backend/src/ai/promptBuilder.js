import { ROADMAP_OUTPUT_SPEC } from "./schemas.js";

export function buildPrompt(userInput) {
  const { goal, experience, timeCommitment, learningStyle } = userInput;

  const lines = [];
  lines.push("You are Pathfinder AI, an expert curriculum planner that generates personalized learning roadmaps. You must output only a single, minified JSON object with no markdown formatting (e.g., ```json).");
  lines.push("\n--- USER CONTEXT ---");
  lines.push(`Primary Goal: Learn how to ${goal}`);
  lines.push(`Current Experience Level: ${experience}`);
  lines.push(`Time Commitment: ${timeCommitment}`);
  lines.push(`Preferred Learning Style: ${learningStyle}`);
  
  lines.push("\n--- INSTRUCTIONS ---");
  lines.push("1. Create a detailed, step-by-step roadmap with multiple modules.");
  lines.push("2. Each module must contain several specific topics.");
  lines.push("3. Each topic must list 2-4 high-quality, real, and publicly accessible online resources (Articles, Videos, Courses, Documentation, Books).");
  lines.push("4. Ensure all resource URLs are valid and directly link to the content.");
  lines.push("5. The roadmap should be practical, project-centric, and incremental, starting with fundamentals and progressing to advanced topics.");
  lines.push("6. Adjust the complexity and depth of the content to match the user's experience level.");
  lines.push("7. Provide a brief, encouraging introduction for the user.");

  lines.push("\n--- MANDATORY JSON OUTPUT SCHEMA ---");
  lines.push("Your entire response must conform strictly to this JSON structure:");
  lines.push(ROADMAP_OUTPUT_SPEC);

  return lines.join("\n");
}


