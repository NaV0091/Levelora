import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

export const characterRouter = Router();

// GET character profile & attributes
characterRouter.get('/', (_req: Request, res: Response) => {
  const state = db.getState();
  res.json({
    success: true,
    data: {
      profile: state.profile,
      attributes: state.attributes,
    }
  });
});

// PUT update profile
characterRouter.put('/profile', (req: Request, res: Response) => {
  const updated = db.updateProfile(req.body);
  res.json({ success: true, data: updated });
});
