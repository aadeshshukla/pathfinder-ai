import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { generateRoadmap } from '../ai/modelAdapter.js';
import { parseRoadmapJSON } from '../ai/parse.js';
import { authenticate, authenticateOptional } from '../middleware/auth.js';
import Roadmap from '../models/Roadmap.js';

const router = Router();
const roadmapGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many roadmap requests. Please try again later.' }
});

// Generate roadmap (authenticated users are saved, guests are temporary)
router.post('/', roadmapGenerationLimiter, authenticateOptional, async (req, res) => {
  try {
    const userInput = req.body;
    if (!userInput) {
      return res.status(400).json({ error: 'No user input provided.' });
    }

    // 1. Get the raw JSON string from the AI
    const roadmapText = await generateRoadmap(userInput);

    // 2. Parse the string into a clean JavaScript object
    const roadmapJson = parseRoadmapJSON(roadmapText);

    // 3. Save only for authenticated users
    if (req.userId) {
      const roadmap = new Roadmap({
        userId: req.userId,
        title: userInput.goal,
        goal: userInput.goal,
        skillLevel: userInput.skillLevel,
        timeCommitment: userInput.timeCommitment,
        learningStyle: userInput.learningStyle,
        roadmapData: roadmapJson
      });

      await roadmap.save();

      return res.json({
        ... roadmapJson,
        roadmapId: roadmap._id
      });
    }

    // 4. Guest response (non-persistent)
    res.json({
      ...roadmapJson,
      guestMode: true
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

    // Convert progress Map to plain object for JSON serialization
    const roadmapObj = roadmap.toObject();
    roadmapObj.progress = roadmap.progress ? Object.fromEntries(roadmap.progress) : {};

    res.json(roadmapObj);
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

// Update progress for a task in a milestone
router.patch('/:id/progress', authenticate, async (req, res) => {
  try {
    const { milestoneIndex, taskIndex, completed } = req.body;
    
    if (typeof milestoneIndex !== 'number' || typeof taskIndex !== 'number' || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // Get current progress or initialize empty map
    const progress = roadmap.progress || new Map();
    const milestoneKey = milestoneIndex.toString();
    
    // Get current completed tasks for this milestone
    let completedTasks = progress.get(milestoneKey) || [];
    
    if (completed) {
      // Add task if not already in array
      if (!completedTasks.includes(taskIndex)) {
        completedTasks.push(taskIndex);
      }
    } else {
      // Remove task from array
      completedTasks = completedTasks.filter(t => t !== taskIndex);
    }
    
    // Update progress map
    progress.set(milestoneKey, completedTasks);
    roadmap.progress = progress;
    
    await roadmap.save();
    
    res.json({ 
      success: true,
      progress: Object.fromEntries(roadmap.progress)
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;
