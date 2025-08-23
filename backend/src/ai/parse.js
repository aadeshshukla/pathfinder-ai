/**
 * Cleans and parses the raw JSON string from the AI.
 * @param {string} text - The raw string response from the AI.
 * @returns {object} - The parsed and validated roadmap object.
 */
export function parseRoadmapJSON(text) {
  try {
    // 1. Clean the raw text by removing markdown formatting
    const cleanedText = text.replace(/```json\n|```/g, '').trim();

    // 2. Parse the cleaned text into a JavaScript object
    const data = JSON.parse(cleanedText);

    // 3. Validate required fields
    if (!Array.isArray(data.milestones)) {
      throw new Error('Milestones data is missing or not an array.');
    }

    if (!data.timeline || typeof data.timeline !== 'object') {
      throw new Error('Timeline object is missing from AI response.');
    }

    // 4. Handle timeline.totalDays
    let totalDays = 0;
    if (typeof data.timeline.totalDays === 'number') {
      totalDays = data.timeline.totalDays;
      console.log('✅ AI provided timeline.totalDays:', totalDays);
    } else {
      // Calculate manually if missing
      console.warn('⚠️  Warning: timeline.totalDays missing from AI response. Calculating manually.');
      totalDays = data.milestones.reduce((sum, milestone) => {
        const days = typeof milestone.estimatedDays === 'number' ? milestone.estimatedDays : 0;
        return sum + days;
      }, 0);
      console.log('🔧 Calculated totalDays manually:', totalDays);
    }

    // 5. Validate resources
    if (!Array.isArray(data.resources)) {
      console.warn('⚠️  Warning: Resources array missing from AI response. Defaulting to empty.');
      data.resources = [];
    }

    // 6. Return the fully validated roadmap object
    return {
      milestones: data.milestones,
      timeline: {
        totalDays: totalDays,
        rationale: data.timeline.rationale || 'Timeline calculated based on milestone estimates'
      },
      resources: data.resources,
      tips: data.tips || []
    };

  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    console.error('Raw response:', text);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}