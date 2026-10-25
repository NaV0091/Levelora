export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const CUSTOM_CONFIG_KEY = 'levelora_custom_firebase_config';

/**
 * Returns the active Firebase configuration.
 * Checks localStorage first (for in-browser configuration),
 * then falls back to Vite environment variables (VITE_FIREBASE_*).
 */
export function getFirebaseConfig(): FirebaseAppConfig {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CUSTOM_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.apiKey === 'string' && parsed.apiKey.trim().length > 5) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors and fall back to env
    }
  }

  const env = import.meta.env;
  return {
    apiKey: (env.VITE_FIREBASE_API_KEY || '').trim(),
    authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
    projectId: (env.VITE_FIREBASE_PROJECT_ID || '').trim(),
    storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
    messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
    appId: (env.VITE_FIREBASE_APP_ID || '').trim(),
  };
}

/**
 * Validates whether the config contains actual Firebase credentials
 */
export function isFirebaseConfigValid(config: FirebaseAppConfig = getFirebaseConfig()): boolean {
  if (!config.apiKey || config.apiKey.includes('your_api_key_here') || config.apiKey.length < 10) {
    return false;
  }
  if (!config.projectId || config.projectId.includes('your_project_id')) {
    return false;
  }
  return true;
}

/**
 * Saves a custom Firebase config into localStorage and reloads or reinitializes
 */
export function saveCustomFirebaseConfig(config: FirebaseAppConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOM_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Clears custom Firebase config from localStorage
 */
export function clearCustomFirebaseConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CUSTOM_CONFIG_KEY);
}
