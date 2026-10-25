import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getInitialSeedData } from '../services/seedData.ts';
import { StorageService } from '../services/storage.ts';

describe('FIREBASE USER AUTH & PERSISTENCE TESTS', () => {
  it('Requirement: Sets custom adventurer name when provided during sign-up', () => {
    const customUser = getInitialSeedData('RobinHood', 'user-robin-1');
    assert.strictEqual(customUser.profile.username, 'RobinHood');
    assert.strictEqual(customUser.settings.displayName, 'RobinHood');
    assert.strictEqual(customUser.profile.id, 'user-robin-1');
  });

  it('Requirement: Defaults to "Adventurer" if name is skipped or empty', () => {
    const skippedUser1 = getInitialSeedData('', 'user-anon-1');
    assert.strictEqual(skippedUser1.profile.username, 'Adventurer');
    assert.strictEqual(skippedUser1.settings.displayName, 'Adventurer');

    const skippedUser2 = getInitialSeedData('   ', 'user-anon-2');
    assert.strictEqual(skippedUser2.profile.username, 'Adventurer');
    assert.strictEqual(skippedUser2.settings.displayName, 'Adventurer');
  });

  it('Requirement: User storage key is isolated per user ID', () => {
    const key1 = StorageService.getUserStorageKey('user-alpha');
    const key2 = StorageService.getUserStorageKey('user-beta');
    const defaultKey = StorageService.getUserStorageKey('guest');

    assert.strictEqual(key1, 'levelora_user_state_v3_user-alpha');
    assert.strictEqual(key2, 'levelora_user_state_v3_user-beta');
    assert.notStrictEqual(key1, key2);
    assert.strictEqual(defaultKey, 'levelora_app_state_v3');
  });

  it('Requirement: User data isolation ensures User A progress does not leak to User B', () => {
    const userAState = getInitialSeedData('PlayerOne', 'user-1');
    const userBState = getInitialSeedData('PlayerTwo', 'user-2');

    // User A completes a quest
    userAState.quests[0].isCompleted = true;
    userAState.profile.lifetimeXp = 50;

    // Verify User B remains pristine and independent
    assert.strictEqual(userAState.quests[0].isCompleted, true);
    assert.strictEqual(userAState.profile.lifetimeXp, 50);

    assert.strictEqual(userBState.quests[0].isCompleted, false);
    assert.strictEqual(userBState.profile.lifetimeXp, 0);
    assert.strictEqual(userBState.profile.username, 'PlayerTwo');
  });
});
