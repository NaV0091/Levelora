import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './services/db.js';
import { questsRouter } from './routes/quests.js';
import { habitsRouter } from './routes/habits.js';
import { characterRouter } from './routes/character.js';
import { skillsRouter } from './routes/skills.js';
import { rewardsRouter } from './routes/rewards.js';
import { analyticsRouter } from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'LEVELORA RPG Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Full state endpoint
app.get('/api/state', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getState() });
});

// Reset state endpoint
app.post('/api/state/reset', (_req: Request, res: Response) => {
  const fresh = db.resetState();
  res.json({ success: true, data: fresh });
});

// Sub-routers
app.use('/api/quests', questsRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/character', characterRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/analytics', analyticsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✨ LEVELORA RPG Backend is running on http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
