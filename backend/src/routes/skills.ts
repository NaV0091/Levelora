import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

export const skillsRouter = Router();

// GET all skills in Skill Garden
skillsRouter.get('/', (_req: Request, res: Response) => {
  const state = db.getState();
  res.json({ success: true, data: state.skills });
});
