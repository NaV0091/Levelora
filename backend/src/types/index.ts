export type QuestCategory = 
  | 'study' 
  | 'fitness' 
  | 'health' 
  | 'career' 
  | 'creativity' 
  | 'growth' 
  | 'social' 
  | 'productivity';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export type CharacterAttributeType = 
  | 'strength' 
  | 'intelligence' 
  | 'discipline' 
  | 'vitality' 
  | 'charisma';

export type SkillStage = 'seed' | 'sprout' | 'sapling' | 'blooming' | 'ancient_bonsai';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  duration?: string;
  deadline?: string; // YYYY-MM-DD
  associatedSkillId?: string;
  associatedAttribute: CharacterAttributeType;
  isCompleted: boolean;
  completedAt?: string; // ISO string
  isDaily?: boolean;
}

export interface QuestCompletionRecord {
  id: string;
  questId: string;
  questTitle: string;
  completedAt: string; // ISO
  dateStr: string; // YYYY-MM-DD
  xpAwarded: number;
  associatedAttribute: CharacterAttributeType;
  associatedSkillId?: string;
  reversed?: boolean;
  reversedAt?: string;
}

export interface XPTransaction {
  id: string;
  timestamp: string;
  amount: number;
  source: 'quest' | 'habit' | 'achievement' | 'streak_milestone';
  description: string;
  relatedId?: string;
  reversed?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;
  frequency: 'daily';
  xpReward: number;
  associatedAttribute: CharacterAttributeType;
  createdAt: string;
  // Map of YYYY-MM-DD -> boolean
  history: Record<string, boolean>;
}

export interface HabitCompletionRecord {
  id: string;
  habitId: string;
  dateStr: string; // YYYY-MM-DD
  completedAt: string;
  xpAwarded: number;
}

export interface CharacterAttribute {
  name: string;
  type: CharacterAttributeType;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  description: string;
  icon: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  category: QuestCategory;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  stage: SkillStage;
  icon: string;
  color: string;
  description: string;
  associatedAttribute: CharacterAttributeType;
  totalQuestsCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeCode: string;
  category: 'quests' | 'streak' | 'levels' | 'skills' | 'habits';
  xpReward: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerProfile {
  id: string;
  username: string;
  title: string;
  avatar: string;
  lifetimeXp: number;
  currentLevel: number;
  createdAt: string;
  longestStreak: number;
  perfectDaysCount: number;
}

export interface AppSettings {
  displayName: string;
  avatarVariant: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  dailyGoalQuests: number;
  displayMode: 'frame' | 'fullscreen';
  firstDayOfWeek: 'monday' | 'sunday';
}

export interface LeveloraState {
  profile: PlayerProfile;
  quests: Quest[];
  completionHistory: QuestCompletionRecord[];
  xpTransactions: XPTransaction[];
  habits: Habit[];
  habitCompletions: HabitCompletionRecord[];
  attributes: Record<CharacterAttributeType, CharacterAttribute>;
  skills: Skill[];
  achievements: Achievement[];
  settings: AppSettings;
  version: number;
}
