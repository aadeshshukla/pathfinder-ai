import { ROADMAP_OUTPUT_SPEC } from './schemas.js';

export function buildPrompt(userInput) {
  const { goal, skillLevel, timeCommitment, learningStyle } = userInput;

  // Generate learning style specific instructions
  let resourceGuidance = '';
  if (learningStyle === 'Video Lectures') {
    resourceGuidance = 'PRIORITIZE video resources: YouTube tutorials, Udemy courses, Coursera videos, freeCodeCamp video series, and educational video platforms.';
  } else if (learningStyle === 'Reading/Articles') {
    resourceGuidance = 'PRIORITIZE written resources: MDN Web Docs, Dev.to articles, Medium posts, official documentation, technical books, and comprehensive guides.';
  } else if (learningStyle === 'Hands-on Projects') {
    resourceGuidance = 'PRIORITIZE practical resources: GitHub repositories, CodePen examples, interactive coding platforms, project-based tutorials, and hands-on tools.';
  } else {
    resourceGuidance = 'Provide a BALANCED MIX of videos, articles, and hands-on resources to support different learning preferences.';
  }

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
   - A "resources" array with 2-3 high-quality resources specifically for THIS milestone
     * ${resourceGuidance}
     * Each resource must have: "name", "type", and "link"
     * Types: "Video", "Article", "Course", "Documentation", "Book", "Tool", "Repository"
     * Use ONLY real, working URLs

3. CRITICAL: Create a "timeline" object with:
   - "totalDays": The total number of days (sum of all milestone estimatedDays)
   - "rationale": A string explaining how you calculated the timeline

4. Include a global "resources" section with 3-5 general/reference resources that apply across the entire learning journey.

5. Optionally include "tips" array with helpful learning advice.

${ROADMAP_OUTPUT_SPEC}
  `;

  return prompt;
}



