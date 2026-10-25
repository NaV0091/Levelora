import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type AuthUser,
  firebaseSignUp,
  firebaseSignIn,
  firebaseSignInWithGoogle,
  firebaseSignOut,
  firebaseUpdateDisplayName,
  subscribeToAuth,
  isLiveFirebaseActive,
  initFirebase,
} from '../services/firebase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLiveFirebase: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, adventurerName?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateAdventurerName: (newName: string) => Promise<void>;
  needsNamePrompt: boolean;
  setNeedsNamePrompt: (needed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiveFirebase, setIsLiveFirebase] = useState(false);
  const [needsNamePrompt, setNeedsNamePrompt] = useState(false);

  useEffect(() => {
    // Attempt Firebase initialization
    const active = initFirebase();
    setIsLiveFirebase(active || isLiveFirebaseActive());

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    try {
      setLoading(true);
      const authenticatedUser = await firebaseSignIn(email, pass);
      setUser(authenticatedUser);
      setIsLiveFirebase(isLiveFirebaseActive());
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, pass: string, adventurerName?: string) => {
    try {
      setLoading(true);
      const finalName = adventurerName?.trim() || 'Adventurer';
      const result = await firebaseSignUp(email, pass, finalName);
      setUser(result.user);
      setIsLiveFirebase(isLiveFirebaseActive());
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create account.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const result = await firebaseSignInWithGoogle();
      setUser(result.user);
      setIsLiveFirebase(isLiveFirebaseActive());
      if (result.isNew && (!result.user.displayName || result.user.displayName === 'Adventurer')) {
        setNeedsNamePrompt(true);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in with Google.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await firebaseSignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAdventurerName = useCallback(async (newName: string) => {
    const finalName = newName.trim() || 'Adventurer';
    await firebaseUpdateDisplayName(finalName);
    setUser(prev => prev ? { ...prev, displayName: finalName } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLiveFirebase,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateAdventurerName,
        needsNamePrompt,
        setNeedsNamePrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
