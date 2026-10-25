import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

export const questsRouter = Router();

// GET all quests
questsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getQuests() });
});

// POST create quest
questsRouter.post('/', (req: Request, res: Response) => {
  const { title, description, category, difficulty, xpReward, duration, deadline, isDaily, associatedAttribute, associatedSkillId } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ success: false, error: 'Quest title is required' });
    return;
  }
  const newQuest = db.createQuest({
    title: title.trim(),
    description: description || '',
    category: category || 'study',
    difficulty: difficulty || 'easy',
    xpReward: Number(xpReward) || 15,
    duration: duration || '30 min',
    deadline,
    isDaily: Boolean(isDaily),
    associatedAttribute: associatedAttribute || 'intelligence',
    associatedSkillId: associatedSkillId || 'skill-academic',
  });
  res.status(201).json({ success: true, data: newQuest });
});

// PUT update quest
questsRouter.put('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updated = db.updateQuest(id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Quest not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// DELETE delete quest
questsRouter.delete('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = db.deleteQuest(id);
  if (!deleted) {
    res.status(404).json({ success: false, error: 'Quest not found' });
    return;
  }
  res.json({ success: true, message: 'Quest deleted successfully' });
});

// POST complete quest
questsRouter.post('/:id/complete', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = db.completeQuest(id);
  if (!result) {
    res.status(400).json({ success: false, error: 'Quest cannot be completed (not found or already completed)' });
    return;
  }
  res.json({ success: true, data: result });
});

// POST reverse quest completion
questsRouter.post('/:id/reverse', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = db.reverseQuest(id);
  if (!result) {
    res.status(400).json({ success: false, error: 'Quest completion cannot be reversed (not found or not completed)' });
    return;
  }
  res.json({ success: true, data: result });
});
