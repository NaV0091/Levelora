import { useState, useEffect, useCallback, useRef } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export type DirectInstallResult = 'accepted' | 'dismissed' | 'already-installed' | 'unsupported';

export function usePwaInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already in standalone / installed window
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      // Prevent browser default infobar so direct button controls the prompt
      e.preventDefault();
      deferredPromptRef.current = e;
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerDirectInstall = useCallback(async (): Promise<DirectInstallResult> => {
    // 1. If already installed
    if (
      isInstalled ||
      (typeof window !== 'undefined' &&
        (window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true))
    ) {
      return 'already-installed';
    }

    // 2. Direct browser install prompt
    if (deferredPromptRef.current) {
      const promptEvent = deferredPromptRef.current;
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      deferredPromptRef.current = null;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        return 'accepted';
      }
      return 'dismissed';
    }

    // 3. Fallback when browser has not fired beforeinstallprompt or doesn't support programmatic install
    return 'unsupported';
  }, [isInstalled]);

  return {
    isInstallable,
    isInstalled,
    triggerDirectInstall,
  };
}
