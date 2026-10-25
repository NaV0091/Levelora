import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { 
  LeveloraState, 
  Quest, 
  Habit, 
  QuestCompletionRecord, 
  XPTransaction, 
  HabitCompletionRecord,
  PlayerProfile,
  AppSettings
} from '../types/index.js';
import { getInitialSeedData } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Level calculations
function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  const discriminant = 1 + (8 * xp) / 100;
  return Math.max(1, Math.floor((1 + Math.sqrt(discriminant)) / 2));
}

function getTitle(level: number): string {
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

class DatabaseService {
  private state: LeveloraState;

  constructor() {
    this.ensureDataDir();
    this.state = this.loadFromFile();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromFile(): LeveloraState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profile && Array.isArray(parsed.quests)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read db.json, initializing seed data:', e);
    }
    const seed = getInitialSeedData();
    this.saveToFile(seed);
    return seed;
  }

  private saveToFile(state: LeveloraState) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing to db.json:', e);
    }
  }

  public getState(): LeveloraState {
    return this.state;
  }

  public resetState(): LeveloraState {
    this.state = getInitialSeedData();
    this.saveToFile(this.state);
    return this.state;
  }

  // Quests CRUD
  public getQuests(): Quest[] {
    return this.state.quests;
  }

  public createQuest(questData: Omit<Quest, 'id' | 'isCompleted'>): Quest {
    const newQuest: Quest = {
      ...questData,
      id: 'quest-' + Date.now(),
      isCompleted: false,
    };
    this.state.quests.unshift(newQuest);
    this.saveToFile(this.state);
    return newQuest;
  }

  public updateQuest(id: string, updates: Partial<Quest>): Quest | null {
    const idx = this.state.quests.findIndex(q => q.id === id);
    if (idx === -1) return null;
    this.state.quests[idx] = { ...this.state.quests[idx], ...updates };
    this.saveToFile(this.state);
    return this.state.quests[idx];
  }

  public deleteQuest(id: string): boolean {
    const initialLen = this.state.quests.length;
    this.state.quests = this.state.quests.filter(q => q.id !== id);
    if (this.state.quests.length !== initialLen) {
      this.saveToFile(this.state);
      return true;
    }
    return false;
  }

  public completeQuest(id: string): { quest: Quest; xp: number; newLifetimeXp: number; level: number } | null {
    const quest = this.state.quests.find(q => q.id === id);
    if (!quest || quest.isCompleted) return null;

    const xp = quest.xpReward;
    const nowIso = new Date().toISOString();
    const today = nowIso.slice(0, 10);

    quest.isCompleted = true;
    quest.completedAt = nowIso;

    const record: QuestCompletionRecord = {
      id: 'comp-' + Date.now(),
      questId: quest.id,
      questTitle: quest.title,
      completedAt: nowIso,
      dateStr: today,
      xpAwarded: xp,
      associatedAttribute: quest.associatedAttribute,
      associatedSkillId: quest.associatedSkillId,
    };
    this.state.completionHistory.unshift(record);

    const tx: XPTransaction = {
      id: 'tx-' + Date.now(),
      timestamp: nowIso,
      amount: xp,
      source: 'quest',
      description: `Completed quest: ${quest.title}`,
      relatedId: quest.id,
    };
    this.state.xpTransactions.unshift(tx);

    const newLifetimeXp = this.state.profile.lifetimeXp + xp;
    const newLevel = calculateLevel(newLifetimeXp);

    this.state.profile.lifetimeXp = newLifetimeXp;
    this.state.profile.currentLevel = newLevel;
    this.state.profile.title = getTitle(newLevel);

    // Boost associated character attribute
    const attr = this.state.attributes[quest.associatedAttribute];
    if (attr) {
      attr.currentXp += xp;
      attr.level = Math.floor(attr.currentXp / 60) + 1;
    }

    this.saveToFile(this.state);
    return { quest, xp, newLifetimeXp, level: newLevel };
  }

  public reverseQuest(id: string): { quest: Quest; xp: number; newLifetimeXp: number } | null {
    const quest = this.state.quests.find(q => q.id === id);
    if (!quest || !quest.isCompleted) return null;

    const xp = quest.xpReward;
    quest.isCompleted = false;
    quest.completedAt = undefined;

    const newLifetimeXp = Math.max(0, this.state.profile.lifetimeXp - xp);
    const newLevel = calculateLevel(newLifetimeXp);

    this.state.profile.lifetimeXp = newLifetimeXp;
    this.state.profile.currentLevel = newLevel;
    this.state.profile.title = getTitle(newLevel);

    const attr = this.state.attributes[quest.associatedAttribute];
    if (attr) {
      attr.currentXp = Math.max(0, attr.currentXp - xp);
      attr.level = Math.max(1, Math.floor(attr.currentXp / 60) + 1);
    }

    this.saveToFile(this.state);
    return { quest, xp, newLifetimeXp };
  }

  // Habits CRUD
  public getHabits(): Habit[] {
    return this.state.habits;
  }

  public createHabit(habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>): Habit {
    const newHabit: Habit = {
      ...habitData,
      id: 'habit-' + Date.now(),
      createdAt: new Date().toISOString(),
      history: {},
    };
    this.state.habits.push(newHabit);
    this.saveToFile(this.state);
    return newHabit;
  }

  public updateHabit(id: string, updates: Partial<Habit>): Habit | null {
    const idx = this.state.habits.findIndex(h => h.id === id);
    if (idx === -1) return null;
    this.state.habits[idx] = { ...this.state.habits[idx], ...updates };
    this.saveToFile(this.state);
    return this.state.habits[idx];
  }

  public deleteHabit(id: string): boolean {
    const initialLen = this.state.habits.length;
    this.state.habits = this.state.habits.filter(h => h.id !== id);
    if (this.state.habits.length !== initialLen) {
      this.saveToFile(this.state);
      return true;
    }
    return false;
  }

  public toggleHabit(id: string, dateStr?: string): { habit: Habit; isDone: boolean; xpAwarded: number } | null {
    const habit = this.state.habits.find(h => h.id === id);
    if (!habit) return null;

    const dateKey = dateStr || new Date().toISOString().slice(0, 10);
    const wasDone = Boolean(habit.history[dateKey]);
    const xp = habit.xpReward;
    const isDone = !wasDone;

    habit.history[dateKey] = isDone;

    if (isDone) {
      const hcomp: HabitCompletionRecord = {
        id: 'hcomp-' + Date.now(),
        habitId: habit.id,
        dateStr: dateKey,
        completedAt: new Date().toISOString(),
        xpAwarded: xp,
      };
      this.state.habitCompletions.unshift(hcomp);
      this.state.profile.lifetimeXp += xp;
      this.state.profile.currentLevel = calculateLevel(this.state.profile.lifetimeXp);
    } else {
      this.state.habitCompletions = this.state.habitCompletions.filter(
        c => !(c.habitId === habit.id && c.dateStr === dateKey)
      );
      this.state.profile.lifetimeXp = Math.max(0, this.state.profile.lifetimeXp - xp);
      this.state.profile.currentLevel = calculateLevel(this.state.profile.lifetimeXp);
    }

    this.saveToFile(this.state);
    return { habit, isDone, xpAwarded: isDone ? xp : -xp };
  }

  // Profile & Settings
  public updateProfile(updates: Partial<PlayerProfile>): PlayerProfile {
    this.state.profile = { ...this.state.profile, ...updates };
    this.saveToFile(this.state);
    return this.state.profile;
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    this.state.settings = { ...this.state.settings, ...updates };
    this.saveToFile(this.state);
    return this.state.settings;
  }
}

export const db = new DatabaseService();
