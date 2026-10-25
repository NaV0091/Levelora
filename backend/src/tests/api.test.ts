import { describe, it } from 'node:test';
import assert from 'node:assert';
import { db } from '../services/db.js';

describe('BACKEND API & DATABASE SERVICE TESTS', () => {
  it('Initializes with fresh seed state and calculates level correctly', () => {
    const state = db.getState();
    assert.strictEqual(state.profile.username, 'Adventurer');
    assert.strictEqual(state.profile.currentLevel, 1);
    assert.strictEqual(state.profile.lifetimeXp, 0);
    assert(state.quests.length >= 5);
    assert(state.habits.length >= 5);
  });

  it('Creates, completes, and reverses a quest', () => {
    const initialLifetimeXp = db.getState().profile.lifetimeXp;

    // Create
    const quest = db.createQuest({
      title: 'Backend Test Quest',
      description: 'Test description',
      category: 'productivity',
      difficulty: 'easy',
      xpReward: 25,
      associatedAttribute: 'discipline',
      associatedSkillId: 'skill-productivity',
    });
    assert.strictEqual(quest.title, 'Backend Test Quest');
    assert.strictEqual(quest.isCompleted, false);

    // Complete
    const completeResult = db.completeQuest(quest.id);
    assert(completeResult !== null);
    assert.strictEqual(completeResult.quest.isCompleted, true);
    assert.strictEqual(completeResult.xp, 25);
    assert.strictEqual(completeResult.newLifetimeXp, initialLifetimeXp + 25);

    // Repeated complete is ignored
    const duplicate = db.completeQuest(quest.id);
    assert.strictEqual(duplicate, null);

    // Reverse
    const revResult = db.reverseQuest(quest.id);
    assert(revResult !== null);
    assert.strictEqual(revResult.quest.isCompleted, false);
    assert.strictEqual(revResult.newLifetimeXp, initialLifetimeXp);

    // Cleanup
    db.deleteQuest(quest.id);
  });

  it('Creates, toggles, and deletes a habit', () => {
    const habit = db.createHabit({
      title: 'Drink Herbal Tea',
      description: 'Evening tea ritual',
      icon: 'droplet',
      frequency: 'daily',
      xpReward: 15,
      associatedAttribute: 'vitality',
    });
    assert.strictEqual(habit.title, 'Drink Herbal Tea');

    const today = '2026-10-25';
    // Toggle on
    const toggle1 = db.toggleHabit(habit.id, today);
    assert(toggle1 !== null);
    assert.strictEqual(toggle1.isDone, true);
    assert.strictEqual(toggle1.xpAwarded, 15);

    // Toggle off
    const toggle2 = db.toggleHabit(habit.id, today);
    assert(toggle2 !== null);
    assert.strictEqual(toggle2.isDone, false);
    assert.strictEqual(toggle2.xpAwarded, -15);

    // Cleanup
    const deleted = db.deleteHabit(habit.id);
    assert.strictEqual(deleted, true);
  });
});
