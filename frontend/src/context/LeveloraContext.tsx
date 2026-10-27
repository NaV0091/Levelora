import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  LeveloraState,
  Quest,
  Habit,
  QuestCompletionRecord,
  XPTransaction,
  HabitCompletionRecord,
  Achievement
} from '../types';
import { StorageService } from '../services/storage';
import { useAuth } from './AuthContext';
import { cloudSaveUserData, cloudLoadUserData } from '../services/firebase';
import { getLevelProgress, getSkillLevelAndStage } from '../utils/progression';
import type { LevelInfo } from '../utils/progression';
import { getLocalDateString, calculateStreaks, isQuestCompletedOnPastDay, prunePastCompletedQuests } from '../utils/dates';
import { sounds } from '../utils/sound';
import { fireCozyConfetti } from '../utils/confetti';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  xp?: number;
  type?: 'success' | 'level-up' | 'achievement' | 'info';
}

interface LeveloraContextType {
  state: LeveloraState;
  levelInfo: LevelInfo;
  currentStreak: number;
  longestStreak: number;
  todayCompletedQuestsCount: number;
  todayCompletedHabitsCount: number;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  
  // Modals & Celebrations
  celebrationLevel: number | null;
  closeLevelCelebration: () => void;
  unlockedAchievement: Achievement | null;
  closeAchievementModal: () => void;
  isAddQuestOpen: boolean;
  setIsAddQuestOpen: (open: boolean) => void;
  isAddHabitOpen: boolean;
  setIsAddHabitOpen: (open: boolean) => void;
  editingQuest: Quest | null;
  setEditingQuest: (quest: Quest | null) => void;
  
  // Actions
  completeQuest: (questId: string) => void;
  reverseQuestCompletion: (questId: string) => void;
  createQuest: (quest: Omit<Quest, 'id' | 'isCompleted'>) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  deleteQuest: (questId: string) => void;
  
  toggleHabitToday: (habitId: string) => void;
  createHabit: (habit: Omit<Habit, 'id' | 'history' | 'createdAt'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;

  updateProfile: (updates: { username?: string; title?: string; avatar?: string }) => void;
  updateSettings: (updates: Partial<LeveloraState['settings']>) => void;
  resetAllProgress: () => void;
}

const LeveloraContext = createContext<LeveloraContextType | undefined>(undefined);

export const LeveloraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateAdventurerName } = useAuth();
  const [state, setState] = useState<LeveloraState>(() => {
    return StorageService.loadUserState(user?.uid, user?.displayName || 'Adventurer');
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Sync settings with sound manager
  useEffect(() => {
    sounds.setEnabled(state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  // Load user data on auth user change (login / signup / account switch)
  useEffect(() => {
    let isCancelled = false;

    if (!user) {
      const guestLocal = StorageService.loadUserState('guest', 'Adventurer');
      setState(guestLocal);
      return;
    }

    const currentName = user.displayName?.trim() || 'Adventurer';

    // 1. Immediately load local user-scoped state for zero latency
    const local = StorageService.loadUserState(user.uid, currentName);
    setState(local);

    // 2. Fetch latest cloud state from Firestore
    cloudLoadUserData(user.uid).then(cloudState => {
      if (!isCancelled && cloudState) {
        const prunedQuests = prunePastCompletedQuests(cloudState.quests);
        const mergedState: LeveloraState = {
          ...cloudState,
          quests: prunedQuests,
          profile: {
            ...cloudState.profile,
            username: user.displayName || cloudState.profile.username || 'Adventurer',
          },
          settings: {
            ...cloudState.settings,
            displayName: user.displayName || cloudState.settings.displayName || 'Adventurer',
          },
        };
        setState(mergedState);
        StorageService.saveUserState(user.uid, mergedState);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Automatically prune completed quests from previous days (midnight rollover or next day open)
  useEffect(() => {
    const pruneExpiredQuests = () => {
      const today = getLocalDateString();
      setState(prev => {
        const hasPastCompleted = prev.quests.some(q => isQuestCompletedOnPastDay(q, today));
        if (!hasPastCompleted) return prev;
        const cleaned = prunePastCompletedQuests(prev.quests, today);
        return {
          ...prev,
          quests: cleaned,
        };
      });
    };

    pruneExpiredQuests();
    const interval = setInterval(pruneExpiredQuests, 30000); // Check every 30s
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        pruneExpiredQuests();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, []);

  // Persist state updates to user-scoped storage & Firestore
  useEffect(() => {
    if (!user) return;
    StorageService.saveUserState(user.uid, state);

    // Debounced Cloud Sync
    const timer = setTimeout(() => {
      cloudSaveUserData(user.uid, state);
    }, 1200);

    return () => clearTimeout(timer);
  }, [state, user]);

  // Current Level & Progress Info calculated strictly from lifetime XP
  const levelInfo = useMemo(() => {
    return getLevelProgress(state.profile.lifetimeXp);
  }, [state.profile.lifetimeXp]);

  // Streak calculation from both quest completion dates and habit completion dates
  const { currentStreak, longestStreak } = useMemo(() => {
    const activeDates = new Set<string>();
    
    // Add quest completion dates (excluding reversed)
    state.completionHistory.forEach(record => {
      if (!record.reversed) {
        activeDates.add(record.dateStr);
      }
    });

    // Add habit completion dates
    state.habitCompletions.forEach(h => {
      activeDates.add(h.dateStr);
    });

    // Also check habit history keys
    state.habits.forEach(habit => {
      Object.entries(habit.history).forEach(([dateStr, done]) => {
        if (done) activeDates.add(dateStr);
      });
    });

    const calculated = calculateStreaks(activeDates);
    const bestEver = Math.max(calculated.longestStreak, state.profile.longestStreak || 0);

    return {
      currentStreak: calculated.currentStreak,
      longestStreak: bestEver,
    };
  }, [state.completionHistory, state.habitCompletions, state.habits, state.profile.longestStreak]);

  // Today's counts
  const todayStr = getLocalDateString();
  const todayCompletedQuestsCount = useMemo(() => {
    return state.quests.filter(q => q.isCompleted).length;
  }, [state.quests]);

  const todayCompletedHabitsCount = useMemo(() => {
    return state.habits.filter(h => h.history[todayStr] === true).length;
  }, [state.habits, todayStr]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper to check and unlock achievements based on updated state
  const checkAchievements = useCallback((
    _currentLifetimeXp: number,
    newLevel: number,
    totalQuestsCompleted: number,
    streakDays: number,
    learningQuestsCount: number,
    meditationCount: number,
    currentAchievements: Achievement[]
  ): Achievement[] => {
    let unlockedOne: Achievement | null = null;

    const updated = currentAchievements.map(ach => {
      if (ach.unlocked) return ach;

      let currentVal = ach.progress;

      if (ach.id === 'ach-first-step') {
        currentVal = totalQuestsCompleted;
      } else if (ach.id === 'ach-getting-started') {
        currentVal = totalQuestsCompleted;
      } else if (ach.id === 'ach-quest-collector') {
        currentVal = totalQuestsCompleted;
      } else if (ach.id === 'ach-week-wins') {
        currentVal = streakDays;
      } else if (ach.id === 'ach-consistency-star') {
        currentVal = streakDays;
      } else if (ach.id === 'ach-level-five') {
        currentVal = newLevel;
      } else if (ach.id === 'ach-knowledge-seeker') {
        currentVal = learningQuestsCount;
      } else if (ach.id === 'ach-zen-master') {
        currentVal = meditationCount;
      }

      const shouldUnlock = currentVal >= ach.maxProgress;

      if (shouldUnlock && !ach.unlocked) {
        unlockedOne = {
          ...ach,
          progress: ach.maxProgress,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        return unlockedOne;
      }

      return {
        ...ach,
        progress: Math.min(ach.maxProgress, currentVal)
      };
    });

    if (unlockedOne) {
      setUnlockedAchievement(unlockedOne);
      sounds.playAchievementUnlock();
      fireCozyConfetti();
      addToast({
        title: 'Achievement Unlocked!',
        message: `${(unlockedOne as Achievement).title}: ${(unlockedOne as Achievement).description}`,
        xp: (unlockedOne as Achievement).xpReward,
        type: 'achievement'
      });
    }

    return updated;
  }, [addToast]);

  // Complete Quest with duplicate protection and multi-level-up support
  const completeQuest = useCallback((questId: string) => {
    setState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.isCompleted) {
        return prev; // Already completed or not found - prevent duplicate awards
      }

      const xp = quest.xpReward;
      const today = getLocalDateString();
      const nowIso = new Date().toISOString();

      // Completion record
      const completionRecord: QuestCompletionRecord = {
        id: 'comp-' + Date.now(),
        questId: quest.id,
        questTitle: quest.title,
        completedAt: nowIso,
        dateStr: today,
        xpAwarded: xp,
        associatedAttribute: quest.associatedAttribute,
        associatedSkillId: quest.associatedSkillId,
      };

      // XP Transaction
      const transaction: XPTransaction = {
        id: 'tx-' + Date.now(),
        timestamp: nowIso,
        amount: xp,
        source: 'quest',
        description: `Completed quest: ${quest.title}`,
        relatedId: quest.id,
      };

      const oldLevelInfo = getLevelProgress(prev.profile.lifetimeXp);
      const newLifetimeXp = prev.profile.lifetimeXp + xp;
      const newLevelInfo = getLevelProgress(newLifetimeXp);

      // Check level up!
      if (newLevelInfo.level > oldLevelInfo.level) {
        setCelebrationLevel(newLevelInfo.level);
        sounds.playLevelUp();
        fireCozyConfetti();
        addToast({
          title: `Level Up! Level ${newLevelInfo.level}`,
          message: `Congratulations! You unlocked the title "${newLevelInfo.title}"!`,
          type: 'level-up'
        });
      } else {
        sounds.playQuestComplete();
        addToast({
          title: 'Quest Completed!',
          message: `+${xp} XP gained for "${quest.title}"`,
          xp,
          type: 'success'
        });
      }

      // Update Character Attribute
      const attrKey = quest.associatedAttribute;
      const existingAttr = prev.attributes[attrKey];
      const updatedAttr = {
        ...existingAttr,
        currentXp: existingAttr.currentXp + xp,
        level: Math.floor((existingAttr.currentXp + xp) / 60) + 1,
      };

      // Update Skill Garden if associated
      const updatedSkills = prev.skills.map(skill => {
        if (skill.id === quest.associatedSkillId || skill.category === quest.category) {
          const newSkillXp = skill.currentXp + xp;
          const { level, stage } = getSkillLevelAndStage(newSkillXp);
          return {
            ...skill,
            currentXp: newSkillXp,
            level,
            stage,
            totalQuestsCompleted: skill.totalQuestsCompleted + 1,
          };
        }
        return skill;
      });

      // Update quests list
      const updatedQuests = prev.quests.map(q => 
        q.id === questId ? { ...q, isCompleted: true, completedAt: nowIso } : q
      );

      const updatedHistory = [completionRecord, ...prev.completionHistory];

      // Achievements validation
      const totalCompleted = updatedQuests.filter(q => q.isCompleted).length + updatedHistory.length;
      const learningCount = updatedHistory.filter(h => h.associatedAttribute === 'intelligence').length;
      const meditationCount = updatedHistory.filter(h => h.questTitle.toLowerCase().includes('meditat')).length;

      const updatedAchievements = checkAchievements(
        newLifetimeXp,
        newLevelInfo.level,
        totalCompleted,
        currentStreak + 1,
        learningCount,
        meditationCount,
        prev.achievements
      );

      return {
        ...prev,
        profile: {
          ...prev.profile,
          lifetimeXp: newLifetimeXp,
          currentLevel: newLevelInfo.level,
          title: newLevelInfo.title,
        },
        quests: updatedQuests,
        completionHistory: updatedHistory,
        xpTransactions: [transaction, ...prev.xpTransactions],
        attributes: {
          ...prev.attributes,
          [attrKey]: updatedAttr,
        },
        skills: updatedSkills,
        achievements: updatedAchievements,
      };
    });
  }, [addToast, checkAchievements, currentStreak]);

  // Reverse Quest Completion (Undo)
  const reverseQuestCompletion = useCallback((questId: string) => {
    setState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || !quest.isCompleted) return prev;

      const xp = quest.xpReward;
      const nowIso = new Date().toISOString();

      // Find last active completion record for this quest
      const recordIdx = prev.completionHistory.findIndex(r => r.questId === questId && !r.reversed);
      const updatedHistory = [...prev.completionHistory];
      if (recordIdx >= 0) {
        updatedHistory[recordIdx] = {
          ...updatedHistory[recordIdx],
          reversed: true,
          reversedAt: nowIso,
        };
      }

      // Reversal Transaction
      const reversalTx: XPTransaction = {
        id: 'tx-rev-' + Date.now(),
        timestamp: nowIso,
        amount: -xp,
        source: 'quest',
        description: `Reversed quest: ${quest.title}`,
        relatedId: quest.id,
        reversed: true,
      };

      const newLifetimeXp = Math.max(0, prev.profile.lifetimeXp - xp);
      const newLevelInfo = getLevelProgress(newLifetimeXp);

      // Attribute deduction
      const attrKey = quest.associatedAttribute;
      const existingAttr = prev.attributes[attrKey];
      const updatedAttr = {
        ...existingAttr,
        currentXp: Math.max(0, existingAttr.currentXp - xp),
        level: Math.max(1, Math.floor(Math.max(0, existingAttr.currentXp - xp) / 60) + 1),
      };

      // Update quests list
      const updatedQuests = prev.quests.map(q =>
        q.id === questId ? { ...q, isCompleted: false, completedAt: undefined } : q
      );

      sounds.playSoftTap();
      addToast({
        title: 'Completion Reversed',
        message: `-${xp} XP for "${quest.title}"`,
        type: 'info'
      });

      return {
        ...prev,
        profile: {
          ...prev.profile,
          lifetimeXp: newLifetimeXp,
          currentLevel: newLevelInfo.level,
          title: newLevelInfo.title,
        },
        quests: updatedQuests,
        completionHistory: updatedHistory,
        xpTransactions: [reversalTx, ...prev.xpTransactions],
        attributes: {
          ...prev.attributes,
          [attrKey]: updatedAttr,
        }
      };
    });
  }, [addToast]);

  // Create Quest
  const createQuest = useCallback((questData: Omit<Quest, 'id' | 'isCompleted'>) => {
    const id = 'quest-' + Date.now();
    const newQuest: Quest = {
      ...questData,
      id,
      isCompleted: false,
    };

    setState(prev => ({
      ...prev,
      quests: [newQuest, ...prev.quests],
    }));

    sounds.playSoftTap();
    addToast({
      title: 'New Quest Created!',
      message: `"${questData.title}" added to your journey.`,
      type: 'success'
    });
  }, [addToast]);

  // Update Quest
  const updateQuest = useCallback((questId: string, updates: Partial<Quest>) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => q.id === questId ? { ...q, ...updates } : q),
    }));

    sounds.playSoftTap();
    addToast({
      title: 'Quest Updated',
      message: 'Your quest changes were saved.',
      type: 'info'
    });
  }, [addToast]);

  // Delete Quest
  const deleteQuest = useCallback((questId: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== questId),
    }));

    sounds.playSoftTap();
    addToast({
      title: 'Quest Removed',
      message: 'Quest was safely deleted.',
      type: 'info'
    });
  }, [addToast]);

  // Toggle Habit for Today
  const toggleHabitToday = useCallback((habitId: string) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === habitId);
      if (!habit) return prev;

      const today = getLocalDateString();
      const isDone = Boolean(habit.history[today]);
      const xp = habit.xpReward;
      const nowIso = new Date().toISOString();

      if (!isDone) {
        // Mark done
        sounds.playHabitPop();

        const habitRecord: HabitCompletionRecord = {
          id: 'hcomp-' + Date.now(),
          habitId: habit.id,
          dateStr: today,
          completedAt: nowIso,
          xpAwarded: xp,
        };

        const tx: XPTransaction = {
          id: 'tx-h-' + Date.now(),
          timestamp: nowIso,
          amount: xp,
          source: 'habit',
          description: `Completed habit: ${habit.title}`,
          relatedId: habit.id,
        };

        const newLifetimeXp = prev.profile.lifetimeXp + xp;
        const newLevelInfo = getLevelProgress(newLifetimeXp);

        if (newLevelInfo.level > prev.profile.currentLevel) {
          setCelebrationLevel(newLevelInfo.level);
          sounds.playLevelUp();
          fireCozyConfetti();
        }

        addToast({
          title: 'Habit Completed!',
          message: `+${xp} XP for "${habit.title}"`,
          xp,
          type: 'success'
        });

        // Attribute boost for habit consistency
        const attrKey = habit.associatedAttribute || 'discipline';
        const currentAttr = prev.attributes[attrKey];
        const updatedAttr = {
          ...currentAttr,
          currentXp: currentAttr.currentXp + xp,
          level: Math.floor((currentAttr.currentXp + xp) / 60) + 1,
        };

        return {
          ...prev,
          profile: {
            ...prev.profile,
            lifetimeXp: newLifetimeXp,
            currentLevel: newLevelInfo.level,
            title: newLevelInfo.title,
          },
          habits: prev.habits.map(h => 
            h.id === habitId ? { ...h, history: { ...h.history, [today]: true } } : h
          ),
          habitCompletions: [habitRecord, ...prev.habitCompletions],
          xpTransactions: [tx, ...prev.xpTransactions],
          attributes: {
            ...prev.attributes,
            [attrKey]: updatedAttr,
          }
        };
      } else {
        // Unmark
        sounds.playSoftTap();
        const newLifetimeXp = Math.max(0, prev.profile.lifetimeXp - xp);
        const newLevelInfo = getLevelProgress(newLifetimeXp);

        addToast({
          title: 'Habit Unchecked',
          message: `-${xp} XP for "${habit.title}"`,
          type: 'info'
        });

        return {
          ...prev,
          profile: {
            ...prev.profile,
            lifetimeXp: newLifetimeXp,
            currentLevel: newLevelInfo.level,
            title: newLevelInfo.title,
          },
          habits: prev.habits.map(h => 
            h.id === habitId ? { ...h, history: { ...h.history, [today]: false } } : h
          ),
          habitCompletions: prev.habitCompletions.filter(
            c => !(c.habitId === habitId && c.dateStr === today)
          ),
        };
      }
    });
  }, [addToast]);

  // Create Habit
  const createHabit = useCallback((habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>) => {
    const id = 'habit-' + Date.now();
    const newHabit: Habit = {
      ...habitData,
      id,
      createdAt: new Date().toISOString(),
      history: {},
    };

    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));

    sounds.playSoftTap();
    addToast({
      title: 'Habit Added!',
      message: `"${habitData.title}" ready to track daily.`,
      type: 'success'
    });
  }, [addToast]);

  // Update Habit
  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habitId ? { ...h, ...updates } : h),
    }));

    sounds.playSoftTap();
    addToast({
      title: 'Habit Updated',
      message: 'Changes saved successfully.',
      type: 'info'
    });
  }, [addToast]);

  // Delete Habit
  const deleteHabit = useCallback((habitId: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId),
    }));

    sounds.playSoftTap();
    addToast({
      title: 'Habit Removed',
      message: 'Habit was removed from your tracker.',
      type: 'info'
    });
  }, [addToast]);

  // Update Profile
  const updateProfile = useCallback((updates: { username?: string; title?: string; avatar?: string }) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates,
      },
      settings: {
        ...prev.settings,
        displayName: updates.username ?? prev.settings.displayName,
        avatarVariant: updates.avatar ?? prev.settings.avatarVariant,
      }
    }));

    if (updates.username && updates.username.trim()) {
      updateAdventurerName(updates.username.trim()).catch(err => {
        console.warn('Failed to sync auth display name:', err);
      });
    }

    sounds.playSoftTap();
    addToast({
      title: 'Profile Updated',
      message: 'Your adventurer profile was saved.',
      type: 'success'
    });
  }, [addToast, updateAdventurerName]);

  // Update Settings
  const updateSettings = useCallback((updates: Partial<LeveloraState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      }
    }));

    sounds.playSoftTap();
  }, []);

  // Reset All Progress
  const resetAllProgress = useCallback(() => {
    const currentName = user?.displayName || 'Adventurer';
    const fresh = StorageService.resetUserState(user?.uid, currentName);
    setState(fresh);
    if (user?.uid) {
      cloudSaveUserData(user.uid, fresh);
    }
    sounds.playSoftTap();
    addToast({
      title: 'Reset Completed',
      message: 'Data refreshed to cozy starter state.',
      type: 'info'
    });
  }, [addToast, user?.uid, user?.displayName]);

  const closeLevelCelebration = useCallback(() => {
    setCelebrationLevel(null);
  }, []);

  const closeAchievementModal = useCallback(() => {
    setUnlockedAchievement(null);
  }, []);

  return (
    <LeveloraContext.Provider
      value={{
        state,
        levelInfo,
        currentStreak,
        longestStreak,
        todayCompletedQuestsCount,
        todayCompletedHabitsCount,
        toasts,
        dismissToast,
        addToast,
        celebrationLevel,
        closeLevelCelebration,
        unlockedAchievement,
        closeAchievementModal,
        isAddQuestOpen,
        setIsAddQuestOpen,
        isAddHabitOpen,
        setIsAddHabitOpen,
        editingQuest,
        setEditingQuest,
        completeQuest,
        reverseQuestCompletion,
        createQuest,
        updateQuest,
        deleteQuest,
        toggleHabitToday,
        createHabit,
        updateHabit,
        deleteHabit,
        updateProfile,
        updateSettings,
        resetAllProgress,
      }}
    >
      {children}
    </LeveloraContext.Provider>
  );
};

export const useLevelora = () => {
  const context = useContext(LeveloraContext);
  if (!context) {
    throw new Error('useLevelora must be used within a LeveloraProvider');
  }
  return context;
};
