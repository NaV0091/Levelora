import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

export const analyticsRouter = Router();

// GET analytics overview
analyticsRouter.get('/', (_req: Request, res: Response) => {
  const state = db.getState();

  // Category counts
  const categoryCounts: Record<string, number> = {};
  state.completionHistory.forEach(c => {
    const q = state.quests.find(item => item.id === c.questId);
    const cat = q ? q.category : 'health';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      lifetimeXp: state.profile.lifetimeXp,
      currentLevel: state.profile.currentLevel,
      longestStreak: state.profile.longestStreak,
      totalQuestsCompleted: state.completionHistory.length,
      totalHabitCompletions: state.habitCompletions.length,
      categoryCounts,
      recentTransactions: state.xpTransactions.slice(0, 20),
    }
  });
});
