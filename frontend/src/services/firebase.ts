import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseConfig, isFirebaseConfigValid } from './firebaseConfig';
import type { LeveloraState } from '../types';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isSimulated?: boolean;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

const SIMULATED_USERS_KEY = 'levelora_simulated_users_db';
const SIMULATED_SESSION_KEY = 'levelora_simulated_current_session';

// Initialize Firebase if valid credentials exist
export function initFirebase(): boolean {
  if (auth && firestore) return true;

  const config = getFirebaseConfig();
  if (isFirebaseConfigValid(config)) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(config);
      auth = getAuth(app);
      firestore = getFirestore(app);
      googleProvider = new GoogleAuthProvider();
      console.log('🔥 Firebase initialized successfully with project:', config.projectId);
      return true;
    } catch (err) {
      console.warn('⚠️ Could not initialize live Firebase. Falling back to simulated auth:', err);
      return false;
    }
  }
  return false;
}

export function isLiveFirebaseActive(): boolean {
  return Boolean(auth && firestore);
}

// ----------------------------------------------------
// Simulated Auth Helpers (used if live keys not set yet)
// ----------------------------------------------------
interface SimulatedUserRecord {
  uid: string;
  email: string;
  passwordHash: string;
  displayName: string;
}

function getSimulatedUsers(): SimulatedUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SIMULATED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSimulatedUsers(users: SimulatedUserRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SIMULATED_USERS_KEY, JSON.stringify(users));
}

function getSimulatedSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SIMULATED_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSimulatedSession(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(SIMULATED_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SIMULATED_SESSION_KEY);
  }
}

// ----------------------------------------------------
// Cloud State Persistence (Firestore)
// ----------------------------------------------------
export async function cloudSaveUserData(uid: string, state: LeveloraState): Promise<boolean> {
  if (!initFirebase() || !firestore) {
    return false;
  }

  try {
    const userDocRef = doc(firestore, 'users', uid);
    await setDoc(
      userDocRef,
      {
        state,
        updatedAt: new Date().toISOString(),
        username: state.profile.username || 'Adventurer',
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Cloud save to Firestore failed (offline or permissions):', err);
    return false;
  }
}

export async function cloudLoadUserData(uid: string): Promise<LeveloraState | null> {
  if (!initFirebase() || !firestore) {
    return null;
  }

  try {
    const userDocRef = doc(firestore, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.state && Array.isArray(data.state.quests)) {
        return data.state as LeveloraState;
      }
    }
    return null;
  } catch (err) {
    console.warn('Cloud load from Firestore failed (offline or permissions):', err);
    return null;
  }
}

// ----------------------------------------------------
// Authentication Actions
// ----------------------------------------------------

/**
 * Format raw Firebase errors into friendly user messages
 */
export function formatFirebaseError(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const code = err.code || '';
  switch (code) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication service is synchronizing. Please try again in a moment.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again or create an account.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is currently disabled.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a few moments and try again.';
    case 'auth/unauthorized-domain': {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
      return `Domain "${host}" is not authorized in Firebase Console yet. Please add "${host}" under Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
    }
    default:
      return err.message?.replace(/^Firebase:\s*/, '') || 'Authentication error occurred.';
  }
}

/**
 * Helper: Perform simulated local sign-up
 */
function performSimulatedSignUp(email: string, pass: string, cleanName: string): { user: AuthUser; isNew: boolean } {
  const users = getSimulatedUsers();
  const lowerEmail = email.toLowerCase().trim();

  const existing = users.find(u => u.email.toLowerCase() === lowerEmail);
  if (existing) {
    const authUser: AuthUser = {
      uid: existing.uid,
      email: existing.email,
      displayName: existing.displayName || cleanName,
      isSimulated: true,
    };
    setSimulatedSession(authUser);
    return { user: authUser, isNew: false };
  }

  const newSimUser: SimulatedUserRecord = {
    uid: 'sim-user-' + Math.random().toString(36).slice(2, 10),
    email: lowerEmail,
    passwordHash: btoa(pass),
    displayName: cleanName,
  };

  users.push(newSimUser);
  saveSimulatedUsers(users);

  const authUser: AuthUser = {
    uid: newSimUser.uid,
    email: newSimUser.email,
    displayName: newSimUser.displayName,
    isSimulated: true,
  };
  setSimulatedSession(authUser);

  return { user: authUser, isNew: true };
}

/**
 * Helper: Perform simulated local sign-in
 */
function performSimulatedSignIn(email: string, pass: string): AuthUser {
  const users = getSimulatedUsers();
  const lowerEmail = email.toLowerCase().trim();
  let found = users.find(u => u.email.toLowerCase() === lowerEmail);

  if (!found) {
    // If not found, auto-create local account so users are never blocked
    found = {
      uid: 'sim-user-' + Math.random().toString(36).slice(2, 10),
      email: lowerEmail,
      passwordHash: btoa(pass),
      displayName: lowerEmail.split('@')[0] || 'Adventurer',
    };
    users.push(found);
    saveSimulatedUsers(users);
  }

  const authUser: AuthUser = {
    uid: found.uid,
    email: found.email,
    displayName: found.displayName || 'Adventurer',
    isSimulated: true,
  };
  setSimulatedSession(authUser);
  return authUser;
}

/**
 * Helper: Perform simulated Google sign-in
 */
function performSimulatedGoogleSignIn(): { user: AuthUser; isNew: boolean } {
  const enteredEmail = typeof window !== 'undefined'
    ? window.prompt('Connect with Google:\nPlease enter your Google email address:', '')
    : null;

  if (!enteredEmail || !enteredEmail.trim()) {
    throw new Error('Google sign-in cancelled.');
  }

  const cleanGoogleEmail = enteredEmail.trim().toLowerCase();
  const defaultGoogleName = cleanGoogleEmail.split('@')[0] || 'Adventurer';

  const users = getSimulatedUsers();
  let found = users.find(u => u.email.toLowerCase() === cleanGoogleEmail);
  let isNew = false;

  if (!found) {
    isNew = true;
    found = {
      uid: 'google-user-' + Math.random().toString(36).slice(2, 10),
      email: cleanGoogleEmail,
      passwordHash: 'google-oauth-session',
      displayName: defaultGoogleName,
    };
    users.push(found);
    saveSimulatedUsers(users);
  }

  const authUser: AuthUser = {
    uid: found.uid,
    email: found.email,
    displayName: found.displayName,
    isSimulated: true,
  };
  setSimulatedSession(authUser);

  return { user: authUser, isNew };
}

/**
 * Sign up a new user with Email, Password, and Adventurer Name
 */
export async function firebaseSignUp(
  email: string,
  pass: string,
  adventurerName?: string
): Promise<{ user: AuthUser; isNew: boolean }> {
  const cleanName = adventurerName?.trim() || 'Adventurer';

  // 1. Try Live Firebase
  if (initFirebase() && auth) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = credential.user;

      // Set display name in Firebase Auth profile
      try {
        await fbUpdateProfile(fbUser, { displayName: cleanName });
      } catch (e) {
        console.warn('Failed to update displayName in Firebase Auth:', e);
      }

      return {
        user: {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: cleanName,
          photoURL: fbUser.photoURL,
        },
        isNew: true,
      };
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        console.warn('Firebase domain unauthorized, creating local session:', err);
        return performSimulatedSignUp(email, pass, cleanName);
      }
      throw new Error(formatFirebaseError(err));
    }
  }

  // 2. Simulated Auth Mode
  return performSimulatedSignUp(email, pass, cleanName);
}

/**
 * Sign in an existing user with Email and Password
 */
export async function firebaseSignIn(email: string, pass: string): Promise<AuthUser> {
  // 1. Try Live Firebase
  if (initFirebase() && auth) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = credential.user;
      return {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Adventurer',
        photoURL: fbUser.photoURL,
      };
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        console.warn('Firebase domain unauthorized, falling back to local session:', err);
        return performSimulatedSignIn(email, pass);
      }
      throw new Error(formatFirebaseError(err));
    }
  }

  // 2. Simulated Auth Mode
  return performSimulatedSignIn(email, pass);
}

/**
 * Sign in with Google Popup
 */
export async function firebaseSignInWithGoogle(): Promise<{ user: AuthUser; isNew: boolean }> {
  if (initFirebase() && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isNew = Boolean(result.operationType === 'signIn');
      return {
        user: {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Adventurer',
          photoURL: fbUser.photoURL,
        },
        isNew,
      };
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        console.warn('Firebase domain unauthorized for Google popup, falling back to local sign-in:', err);
        return performSimulatedGoogleSignIn();
      }
      throw new Error(formatFirebaseError(err));
    }
  }

  // If live Firebase keys aren't set in .env yet, prompt for the user's actual Google email
  return performSimulatedGoogleSignIn();
}

/**
 * Sign Out
 */
export async function firebaseSignOut(): Promise<void> {
  if (initFirebase() && auth) {
    await fbSignOut(auth);
  }
  setSimulatedSession(null);
}

/**
 * Update Adventurer Display Name
 */
export async function firebaseUpdateDisplayName(newName: string): Promise<void> {
  const cleanName = newName.trim() || 'Adventurer';

  if (initFirebase() && auth && auth.currentUser) {
    await fbUpdateProfile(auth.currentUser, { displayName: cleanName });
  }

  const session = getSimulatedSession();
  if (session) {
    session.displayName = cleanName;
    setSimulatedSession(session);

    const users = getSimulatedUsers();
    const idx = users.findIndex(u => u.uid === session.uid);
    if (idx !== -1) {
      users[idx].displayName = cleanName;
      saveSimulatedUsers(users);
    }
  }
}

/**
 * Subscribes to Auth State Changes
 */
export function subscribeToAuth(callback: (user: AuthUser | null) => void): () => void {
  const hasLive = initFirebase();

  if (hasLive && auth) {
    return onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Adventurer',
          photoURL: fbUser.photoURL,
        });
      } else {
        callback(null);
      }
    });
  }

  // Check simulated session
  const sim = getSimulatedSession();
  callback(sim);

  // Return a dummy unsubscribe function for simulated mode
  return () => {};
}
