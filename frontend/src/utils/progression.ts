/**
 * LEVELORA Progression Formula:
 * XP required to move from level L to level L+1: 100 * L
 * 
 * Level 1 -> 2: 100 XP (cumulative: 100)
 * Level 2 -> 3: 200 XP (cumulative: 300)
 * Level 3 -> 4: 300 XP (cumulative: 600)
 * Level 4 -> 5: 400 XP (cumulative: 1000)
 * Level 5 -> 6: 500 XP (cumulative: 1500)
 * Level 10: cumulative 4500 XP
 * 
 * Cumulative XP to reach level L:
 * TotalXP(L) = 50 * (L - 1) * L
 */

export interface LevelInfo {
  level: number;
  lifetimeXp: number;
  currentLevelBaseXp: number;
  nextLevelThresholdXp: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
  title: string;
}

/**
 * Total cumulative XP required to reach a specific level
 */
export function getCumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * (level - 1) * level;
}

/**
 * Calculates current level from lifetime XP
 */
export function calculateLevelFromLifetimeXp(lifetimeXp: number): number {
  if (lifetimeXp <= 0) return 1;
  // 50 * L^2 - 50 * L - X = 0
  // L = (50 + sqrt(2500 + 200 * X)) / 100 = (1 + sqrt(1 + (8 * X / 100))) / 2
  const discriminant = 1 + (8 * lifetimeXp) / 100;
  const level = Math.floor((1 + Math.sqrt(discriminant)) / 2);
  return Math.max(1, level);
}

/**
 * Titles according to player level
 */
export function getPlayerTitle(level: number): string {
  if (level >= 25) return 'Celestial Panda Sage';
  if (level >= 20) return 'Legendary Guardian';
  if (level >= 15) return 'Forest Grandmaster';
  if (level >= 10) return 'Bamboo Master';
  if (level >= 8) return 'Elite Trailblazer';
  if (level >= 6) return 'Quest Champion';
  if (level >= 4) return 'Brisk Explorer';
  if (level >= 2) return 'Cozy Adventurer';
  return 'Novice Sprout';
}

/**
 * Get detailed level and progress information from lifetime XP
 */
export function getLevelProgress(lifetimeXp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(lifetimeXp));
  const level = calculateLevelFromLifetimeXp(safeXp);
  
  const currentLevelBaseXp = getCumulativeXpForLevel(level);
  const nextLevelThresholdXp = getCumulativeXpForLevel(level + 1);
  
  // XP required for this specific step (100 * level)
  const xpNeededForNextLevel = 100 * level;
  
  // XP gained within the current level bracket
  const xpInCurrentLevel = safeXp - currentLevelBaseXp;
  
  // Progress percentage (clamped between 0 and 100)
  const progressPercent = Math.min(
    100, 
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    level,
    lifetimeXp: safeXp,
    currentLevelBaseXp,
    nextLevelThresholdXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
    title: getPlayerTitle(level)
  };
}

/**
 * Calculate stage and level for Skill Garden
 */
export function getSkillLevelAndStage(xp: number): {
  level: number;
  stage: 'seed' | 'sprout' | 'sapling' | 'blooming' | 'ancient_bonsai';
  stageName: string;
  progressPercent: number;
  nextLevelXp: number;
} {
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const xpInLevel = xp % 100;
  const progressPercent = Math.min(100, Math.round((xpInLevel / 100) * 100));

  let stage: 'seed' | 'sprout' | 'sapling' | 'blooming' | 'ancient_bonsai' = 'seed';
  let stageName = 'Seedling';

  if (level >= 10) {
    stage = 'ancient_bonsai';
    stageName = 'Ancient Bonsai';
  } else if (level >= 7) {
    stage = 'blooming';
    stageName = 'Blooming Flower';
  } else if (level >= 4) {
    stage = 'sapling';
    stageName = 'Growing Sapling';
  } else if (level >= 2) {
    stage = 'sprout';
    stageName = 'Fresh Sprout';
  }

  return {
    level,
    stage,
    stageName,
    progressPercent,
    nextLevelXp: 100 - xpInLevel
  };
}
