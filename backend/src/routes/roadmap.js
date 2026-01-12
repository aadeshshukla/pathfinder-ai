import { Router } from 'express';
import { generateRoadmap } from '../ai/modelAdapter.js';
import { parseRoadmapJSON } from '../ai/parse.js';
import { authenticate } from '../middleware/auth.js';
import Roadmap from '../models/Roadmap.js';

const router = Router();

// Generate roadmap (protected route)
router.post('/', authenticate, async (req, res) => {
  try {
    const userInput = req.body;
    if (!userInput) {
      return res.status(400).json({ error: 'No user input provided.' });
    }

    // 1. Get the raw JSON string from the AI
    const roadmapText = await generateRoadmap(userInput);

    // 2. Parse the string into a clean JavaScript object
    const roadmapJson = parseRoadmapJSON(roadmapText);

    // 3. Save to database
    const roadmap = new Roadmap({
      userId: req.userId,
      title: userInput.goal,
      goal: userInput. goal,
      skillLevel: userInput.skillLevel,
      timeCommitment: userInput.timeCommitment,
      learningStyle: userInput.learningStyle,
      roadmapData: roadmapJson
    });

    await roadmap.save();

    // 4. Send response with roadmap ID
    res.json({
      ... roadmapJson,
      roadmapId: roadmap._id
    });

  } catch (error) {
    console.error('Error in /api/roadmap route:', error);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

// Get all user's roadmaps
router.get('/', authenticate, async (req, res) => {
  try {
    const roadmaps = await Roadmap. find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-roadmapData'); // Exclude full roadmap data for list view

    res.json({ roadmaps });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
});

// Get specific roadmap
router.get('/:id', authenticate, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// Delete roadmap
router.delete('/: id', authenticate, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    res.status(500).json({ error: 'Failed to delete roadmap' });
  }
});

export default router;
