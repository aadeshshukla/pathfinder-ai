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
    } else {
      // Calculate manually if missing
      totalDays = data.milestones.reduce((sum, milestone) => {
        const days = typeof milestone.estimatedDays === 'number' ? milestone.estimatedDays : 0;
        return sum + days;
      }, 0);
    }

    // 5. Process milestones and preserve milestone-level resources
    const processedMilestones = data.milestones.map(milestone => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      estimatedDays: milestone.estimatedDays,
      tasks: milestone.tasks || [],
      // Preserve milestone-level resources if they exist
      ...(milestone.resources && Array.isArray(milestone.resources) && { resources: milestone.resources })
    }));

    // 6. Validate global resources
    if (!Array.isArray(data.resources)) {
      data.resources = [];
    }

    // 7. Return the fully validated roadmap object
    return {
      milestones: processedMilestones,
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