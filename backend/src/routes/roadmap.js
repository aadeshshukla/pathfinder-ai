import { Router } from 'express';
import { generateRoadmap } from '../ai/modelAdapter.js';
import { parseRoadmapJSON } from '../ai/parse.js';

const router = Router();

// The POST route to generate a roadmap
router.post('/', async (req, res) => {
  try {
    const userInput = req.body;
    if (!userInput) {
      return res.status(400).json({ error: 'No user input provided.' });
    }

    // 1. Get the raw JSON string from the AI
    const roadmapText = await generateRoadmap(userInput);

    // 2. Parse the string into a clean JavaScript object
    const roadmapJson = parseRoadmapJSON(roadmapText);

    // 3. Send the final, clean object to the frontend
    res.json(roadmapJson);

  } catch (error) {
    console.error('Error in /api/roadmap route:', error);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

export default router;
