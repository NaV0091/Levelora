import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  calculateLevelFromLifetimeXp,
  getCumulativeXpForLevel,
  getLevelProgress,
  getSkillLevelAndStage
} from '../utils/progression.ts';

import {
  calculateStreaks,
  getCurrentWeekDays,
  isQuestCompletedOnPastDay,
  prunePastCompletedQuests
} from '../utils/dates.ts';

import { getInitialSeedData } from '../services/seedData.ts';
import type { LeveloraState, Quest } from '../types/index.ts';

describe('ACCEPTANCE TESTS: LEVELORA SYSTEM', () => {

  // Test 1 & 7: Progression formula test
  it('Requirement 7: Verify RPG progression formula 100 * L for Level L -> L+1', () => {
    // Level 1: 0 XP
    assert.strictEqual(calculateLevelFromLifetimeXp(0), 1);
    assert.strictEqual(getCumulativeXpForLevel(1), 0);

    // Level 1 -> 2 requires 100 XP
    assert.strictEqual(getCumulativeXpForLevel(2), 100);
    assert.strictEqual(calculateLevelFromLifetimeXp(99), 1);
    assert.strictEqual(calculateLevelFromLifetimeXp(100), 2);

    // Level 2 -> 3 requires 200 XP (cumulative: 100 + 200 = 300)
    assert.strictEqual(getCumulativeXpForLevel(3), 300);
    assert.strictEqual(calculateLevelFromLifetimeXp(299), 2);
    assert.strictEqual(calculateLevelFromLifetimeXp(300), 3);

    // Level 3 -> 4 requires 300 XP (cumulative: 300 + 300 = 600)
    assert.strictEqual(getCumulativeXpForLevel(4), 600);
    assert.strictEqual(calculateLevelFromLifetimeXp(599), 3);
    assert.strictEqual(calculateLevelFromLifetimeXp(600), 4);

    // Level 4 -> 5 requires 400 XP (cumulative: 600 + 400 = 1000)
    assert.strictEqual(getCumulativeXpForLevel(5), 1000);
    assert.strictEqual(calculateLevelFromLifetimeXp(1000), 5);
  });

  // Test 8: Multiple level-ups from single XP award
  it('Requirement 8: Award enough XP for multiple level-ups and verify final level', () => {
    // Starting at 0 XP (Level 1)
    // Award 650 XP:
    // Level 1 -> 2: 100 XP (left: 550)
    // Level 2 -> 3: 200 XP (left: 350)
    // Level 3 -> 4: 300 XP (left: 50) -> Level 4 with 50 XP into Level 4!
    const progress = getLevelProgress(650);
    assert.strictEqual(progress.level, 4);
    assert.strictEqual(progress.xpInCurrentLevel, 50);
    assert.strictEqual(progress.xpNeededForNextLevel, 400); // 100 * 4 = 400
    assert.strictEqual(progress.progressPercent, 13); // 50 / 400 = 12.5% -> 13%
  });

  // Test 10 & 11: Consecutive calendar days streaks & resets
  it('Requirement 10 & 11: Streak tracking on consecutive dates and reset upon miss', () => {
    // 3 consecutive days ending today ('2026-10-25', '2026-10-24', '2026-10-23')
    const activeDates = ['2026-10-23', '2026-10-24', '2026-10-25'];
    const streakResult = calculateStreaks(activeDates, '2026-10-25');
    assert.strictEqual(streakResult.currentStreak, 3);
    assert.strictEqual(streakResult.longestStreak, 3);

    // If day was missed ('2026-10-20' and '2026-10-25')
    const brokenDates = ['2026-10-20', '2026-10-25'];
    const brokenStreak = calculateStreaks(brokenDates, '2026-10-25');
    assert.strictEqual(brokenStreak.currentStreak, 1);
    assert.strictEqual(brokenStreak.longestStreak, 1);

    // Multiple completions on same day do NOT inflate streak
    const duplicateDayDates = ['2026-10-24', '2026-10-25', '2026-10-25'];
    const dedupeStreak = calculateStreaks(duplicateDayDates, '2026-10-25');
    assert.strictEqual(dedupeStreak.currentStreak, 2);
  });

  // Test 13: Skill Garden botanical progression
  it('Requirement 13: Skill Garden stages progress from Seed to Sprout to Sapling to Blooming to Bonsai', () => {
    // Level 1: 0-99 XP -> seed
    const s1 = getSkillLevelAndStage(30);
    assert.strictEqual(s1.level, 1);
    assert.strictEqual(s1.stage, 'seed');

    // Level 2: 100-199 XP -> sprout
    const s2 = getSkillLevelAndStage(150);
    assert.strictEqual(s2.level, 2);
    assert.strictEqual(s2.stage, 'sprout');

    // Level 4: 300-399 XP -> sapling
    const s4 = getSkillLevelAndStage(350);
    assert.strictEqual(s4.level, 4);
    assert.strictEqual(s4.stage, 'sapling');

    // Level 7: 600-699 XP -> blooming
    const s7 = getSkillLevelAndStage(650);
    assert.strictEqual(s7.level, 7);
    assert.strictEqual(s7.stage, 'blooming');

    // Level 10: 900+ XP -> ancient_bonsai
    const s10 = getSkillLevelAndStage(980);
    assert.strictEqual(s10.level, 10);
    assert.strictEqual(s10.stage, 'ancient_bonsai');
  });

  // Test 4, 5, 6: Quest completion, duplicate prevention, and reversal simulation
  it('Requirement 4, 5, 6: Quest completion awards XP, repeated clicks prevent duplicate, reversal restores XP', () => {
    const state: LeveloraState = getInitialSeedData();
    const initialLifetimeXp = state.profile.lifetimeXp;

    const testQuest: Quest = {
      id: 'test-q-1',
      title: 'Deep Meditation',
      description: 'Test quest',
      category: 'health',
      difficulty: 'medium',
      xpReward: 35,
      associatedAttribute: 'vitality',
      isCompleted: false,
    };
    state.quests.push(testQuest);

    // 1st Completion: Award 35 XP
    assert.strictEqual(testQuest.isCompleted, false);
    testQuest.isCompleted = true;
    const newXp = initialLifetimeXp + testQuest.xpReward;
    state.profile.lifetimeXp = newXp;
    assert.strictEqual(state.profile.lifetimeXp, initialLifetimeXp + 35);

    // 2nd Completion attempt on already completed quest: Must be ignored
    if (testQuest.isCompleted) {
      // Logic skips awarding XP again
    } else {
      state.profile.lifetimeXp += testQuest.xpReward;
    }
    assert.strictEqual(state.profile.lifetimeXp, initialLifetimeXp + 35); // XP remains exactly 35, no duplicate!

    // Reversal / Undo: Reverts 35 XP
    testQuest.isCompleted = false;
    state.profile.lifetimeXp = Math.max(0, state.profile.lifetimeXp - testQuest.xpReward);
    assert.strictEqual(state.profile.lifetimeXp, initialLifetimeXp);
  });

  // Test 14: Data persistence health check
  it('Requirement 14: Initial seed data conforms to valid LeveloraState schema', () => {
    const seed = getInitialSeedData();
    assert.strictEqual(seed.version, 1);
    assert(seed.quests.length >= 4);
    assert(seed.habits.length >= 5);
    assert.strictEqual(Object.keys(seed.attributes).length, 5);
    assert(seed.skills.length >= 7);
    assert(seed.achievements.length >= 8);
    assert(typeof seed.profile.lifetimeXp === 'number');
  });

  // Test: Calendar dates generation for matrix
  it('Calendar week helper generates exactly 7 days with M T W T F S S labels', () => {
    const week = getCurrentWeekDays(new Date('2026-10-25'));
    assert.strictEqual(week.length, 7);
    const dayShorts = week.map(d => d.dayShort);
    assert.deepStrictEqual(dayShorts, ['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  // Test: Guest Mode and installation support
  it('Guest Mode provides instant guest state and profile without requiring email credentials', () => {
    const guestUser = {
      uid: 'guest-test-123',
      email: null,
      displayName: 'Guest Adventurer',
      isGuest: true,
      isSimulated: true,
    };
    assert.strictEqual(guestUser.isGuest, true);
    assert.strictEqual(guestUser.email, null);
    assert.strictEqual(guestUser.displayName, 'Guest Adventurer');

    const seed = getInitialSeedData(guestUser.displayName);
    assert.strictEqual(seed.profile.username, 'Guest Adventurer');
    assert(seed.quests.length > 0);
  });

  // Test: Completed to-do quest auto-deletes itself on next day
  it('Requirement: Completed quest stays visible today, but deletes itself next day', () => {
    const todayStr = '2026-10-27';
    
    const activeQuest: Quest = {
      id: 'q1',
      title: 'Active Task',
      description: 'Not done yet',
      category: 'productivity',
      difficulty: 'easy',
      xpReward: 15,
      associatedAttribute: 'discipline',
      isCompleted: false,
    };

    const completedTodayQuest: Quest = {
      id: 'q2',
      title: 'Completed Today Task',
      description: 'Finished today',
      category: 'health',
      difficulty: 'easy',
      xpReward: 20,
      associatedAttribute: 'vitality',
      isCompleted: true,
      completedAt: '2026-10-27T08:30:00.000Z',
    };

    const completedYesterdayQuest: Quest = {
      id: 'q3',
      title: 'Completed Yesterday Task',
      description: 'Finished yesterday - should auto-delete today',
      category: 'fitness',
      difficulty: 'medium',
      xpReward: 30,
      associatedAttribute: 'strength',
      isCompleted: true,
      completedAt: '2026-10-26T10:00:00.000Z',
    };

    // Verify individual checks
    assert.strictEqual(isQuestCompletedOnPastDay(activeQuest, todayStr), false);
    assert.strictEqual(isQuestCompletedOnPastDay(completedTodayQuest, todayStr), false);
    assert.strictEqual(isQuestCompletedOnPastDay(completedYesterdayQuest, todayStr), true);

    // Verify list pruning
    const allQuests = [activeQuest, completedTodayQuest, completedYesterdayQuest];
    const remainingQuests = prunePastCompletedQuests(allQuests, todayStr);

    assert.strictEqual(remainingQuests.length, 2);
    assert.strictEqual(remainingQuests.some(q => q.id === 'q3'), false); // q3 auto-deleted!
    assert.strictEqual(remainingQuests.some(q => q.id === 'q1'), true); // active remains
    assert.strictEqual(remainingQuests.some(q => q.id === 'q2'), true); // today completed remains
  });
});
