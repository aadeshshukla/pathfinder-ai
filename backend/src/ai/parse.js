/**
 * Cleans and parses the raw JSON string from the AI.
 * @param {string} text - The raw string response from the AI.
 * @returns {object} - The parsed and validated roadmap object.
 */
export function parseRoadmapJSON(text) {
  // 1. Clean the raw text by removing markdown formatting
  const cleanedText = text.replace(/```json\n|```/g, '').trim();

  // 2. Parse the cleaned text into a JavaScript object
  const data = JSON.parse(cleanedText);

  // 3. Validate and sanitize the data to ensure it meets our schema
  
  // Validate milestones
  if (!Array.isArray(data.milestones)) {
    throw new Error('Milestones data is missing or not an array.');
  }

  // --- START OF NEW, MORE ROBUST LOGIC ---

  // Validate timeline and calculate totalDays if it's missing
  let totalDays = 0;
  if (data.timeline && typeof data.timeline.totalDays === 'number') {
    totalDays = data.timeline.totalDays;
  } else {
    // If totalDays is missing, calculate it by summing up milestone days
    console.warn('Warning: timeline.totalDays missing from AI response. Calculating manually.');
    totalDays = data.milestones.reduce((sum, milestone) => {
      // Ensure estimatedDays is a number before adding
      const days = typeof milestone.estimatedDays === 'number' ? milestone.estimatedDays : 0;
      return sum + days;
    }, 0);
  }

  // --- END OF NEW LOGIC ---

  // Validate resources
  if (!Array.isArray(data.resources)) {
    // If resources are missing, create an empty array to prevent crashes
    console.warn('Warning: Resources array missing from AI response. Defaulting to empty.');
    data.resources = [];
  }

  // 4. Return the fully validated and sanitized roadmap object
  return {
    milestones: data.milestones,
    timeline: {
      totalDays: totalDays, // Use the calculated or original value
    },
    resources: data.resources,
  };
}