import type { LeveloraState } from '../types';
import { getInitialSeedData } from './seedData';
import { prunePastCompletedQuests } from '../utils/dates';

const DEFAULT_STORAGE_KEY = 'levelora_app_state_v3';

export class StorageService {
  /**
   * Helper to derive storage key for a user
   */
  public static getUserStorageKey(userId?: string): string {
    if (!userId || userId === 'guest' || userId === 'player-default') {
      return DEFAULT_STORAGE_KEY;
    }
    return `levelora_user_state_v3_${userId}`;
  }

  /**
   * Loads state for a specific user ID or falls back to default
   */
  public static loadUserState(userId?: string, fallbackName: string = 'Adventurer'): LeveloraState {
    if (typeof window === 'undefined') {
      return getInitialSeedData(fallbackName, userId);
    }

    const key = this.getUserStorageKey(userId);

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        // If this user has no saved state yet, create a fresh seed state
        const initial = getInitialSeedData(fallbackName, userId);
        StorageService.saveUserState(userId, initial);
        return initial;
      }

      const parsed = JSON.parse(raw) as LeveloraState;
      
      // Basic schema health check
      if (
        !parsed ||
        typeof parsed.version !== 'number' ||
        !parsed.profile ||
        !Array.isArray(parsed.quests) ||
        !Array.isArray(parsed.habits)
      ) {
        console.warn(`Storage state for ${key} invalid, reinitializing with seed data`);
        const initial = getInitialSeedData(fallbackName, userId);
        StorageService.saveUserState(userId, initial);
        return initial;
      }

      // Automatically prune quests completed on previous days
      const prunedQuests = prunePastCompletedQuests(parsed.quests);
      if (prunedQuests.length !== parsed.quests.length) {
        parsed.quests = prunedQuests;
        StorageService.saveUserState(userId, parsed);
      }

      return parsed;
    } catch (e) {
      console.error(`Failed to parse Levelora state from localStorage (${key}):`, e);
      return getInitialSeedData(fallbackName, userId);
    }
  }

  /**
   * Saves state for a specific user ID
   */
  public static saveUserState(userId: string | undefined, state: LeveloraState): void {
    if (typeof window === 'undefined') return;
    const key = this.getUserStorageKey(userId);
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(`Failed to write Levelora state to localStorage (${key}):`, e);
    }
  }

  /**
   * Loads state from localStorage (legacy/fallback)
   */
  public static loadState(): LeveloraState {
    return StorageService.loadUserState();
  }

  /**
   * Saves state to localStorage (legacy/fallback)
   */
  public static saveState(state: LeveloraState): void {
    StorageService.saveUserState(state.profile.id, state);
  }

  /**
   * Resets data for a specific user to initial state
   */
  public static resetUserState(userId?: string, username: string = 'Adventurer'): LeveloraState {
    const initial = getInitialSeedData(username, userId);
    StorageService.saveUserState(userId, initial);
    return initial;
  }

  /**
   * Resets data to initial demo state
   */
  public static resetToSeed(): LeveloraState {
    return StorageService.resetUserState();
  }

  /**
   * Exports data as a downloadable JSON string
   */
  public static exportData(state: LeveloraState): string {
    return JSON.stringify(state, null, 2);
  }

  /**
   * Imports valid JSON state
   */
  public static importData(jsonString: string, userId?: string): LeveloraState | null {
    try {
      const parsed = JSON.parse(jsonString) as LeveloraState;
      if (parsed && parsed.profile && Array.isArray(parsed.quests)) {
        StorageService.saveUserState(userId || parsed.profile.id, parsed);
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }
}
