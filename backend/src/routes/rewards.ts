import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

export const rewardsRouter = Router();

// GET all achievements & badges
rewardsRouter.get('/', (_req: Request, res: Response) => {
  const state = db.getState();
  res.json({ success: true, data: state.achievements });
});
