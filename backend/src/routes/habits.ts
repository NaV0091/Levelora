import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

export const habitsRouter = Router();

// GET all habits
habitsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getHabits() });
});

// POST create habit
habitsRouter.post('/', (req: Request, res: Response) => {
  const { title, description, icon, frequency, xpReward, associatedAttribute } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ success: false, error: 'Habit title is required' });
    return;
  }
  const newHabit = db.createHabit({
    title: title.trim(),
    description: description || '',
    icon: icon || 'droplet',
    frequency: frequency || 'daily',
    xpReward: Number(xpReward) || 15,
    associatedAttribute: associatedAttribute || 'discipline',
  });
  res.status(201).json({ success: true, data: newHabit });
});

// PUT update habit
habitsRouter.put('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updated = db.updateHabit(id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Habit not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// DELETE habit
habitsRouter.delete('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = db.deleteHabit(id);
  if (!deleted) {
    res.status(404).json({ success: false, error: 'Habit not found' });
    return;
  }
  res.json({ success: true, message: 'Habit removed successfully' });
});

// POST toggle habit for today or a specific date
habitsRouter.post('/:id/toggle', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { dateStr } = req.body;
  const result = db.toggleHabit(id, dateStr);
  if (!result) {
    res.status(404).json({ success: false, error: 'Habit not found' });
    return;
  }
  res.json({ success: true, data: result });
});
