import { ROADMAP_OUTPUT_SPEC } from './schemas.js';

export function buildPrompt(userInput) {
  const { goal, skillLevel, timeCommitment, learningStyle } = userInput;

  const prompt = `
You are an expert curriculum designer and career mentor AI named Pathfinder. 
Your task is to generate a detailed, personalized learning roadmap based on the user's specific inputs.

User Inputs:
- Goal: "${goal}"
- Current Skill Level: "${skillLevel}"
- Weekly Time Commitment: "${timeCommitment}"
- Preferred Learning Style: "${learningStyle}"

Instructions:
1. Create a sequence of logical "milestones" to guide the user from their skill level to their goal.
2. For each milestone, provide:
   - A unique "id" (kebab-case slug)
   - A clear "title"
   - A detailed "description"
   - An "estimatedDays" number based on the user's time commitment
   - A "tasks" array with specific, actionable items

3. CRITICAL: Create a "timeline" object with:
   - "totalDays": The total number of days (sum of all milestone estimatedDays)
   - "rationale": A string explaining how you calculated the timeline

4. Include a "resources" section with at least 5 high-quality, real resources:
   - Each resource needs "name", "type", and "link"
   - Types: "Video", "Article", "Course", "Documentation", "Book", "Tool", "Repository"
   - Use ONLY real, working URLs (official docs, YouTube, freeCodeCamp, etc.)

5. Optionally include "tips" array with helpful learning advice.

${ROADMAP_OUTPUT_SPEC}
  `;

  return prompt;
}



