import type { LeveloraState, Quest, PlayerProfile } from '../types';

const API_BASE = '/api';

export class ApiClient {
  public static async isBackendAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async fetchState(): Promise<LeveloraState | null> {
    try {
      const res = await fetch(`${API_BASE}/state`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data as LeveloraState;
    } catch {
      return null;
    }
  }

  public static async createQuest(quest: Omit<Quest, 'id' | 'isCompleted'>): Promise<Quest | null> {
    try {
      const res = await fetch(`${API_BASE}/quests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  public static async completeQuest(questId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/quests/${questId}/complete`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async reverseQuest(questId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/quests/${questId}/reverse`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async toggleHabit(habitId: string, dateStr?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateStr }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async updateProfile(profile: Partial<PlayerProfile>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/character/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async resetBackendState(): Promise<LeveloraState | null> {
    try {
      const res = await fetch(`${API_BASE}/state/reset`, { method: 'POST' });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }
}
