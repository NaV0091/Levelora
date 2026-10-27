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

export type DirectInstallResult = 'accepted' | 'dismissed' | 'already-installed' | 'shortcut-created';

/**
 * Creates and downloads a 1-click desktop internet shortcut file for Windows/Desktop
 */
export function createDesktopShortcutFile() {
  if (typeof window === 'undefined') return;
  const currentUrl = window.location.origin || 'https://levelora-rpg.web.app';
  const shortcutContent = `[InternetShortcut]\r\nURL=${currentUrl}\r\nIconIndex=0\r\nIconFile=${currentUrl}/favicon.svg\r\n`;
  const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'LEVELORA RPG.url';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

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
    // 1. If direct browser native install prompt is available, trigger it
    if (deferredPromptRef.current) {
      try {
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
      } catch (err) {
        console.warn('Native prompt fallback to shortcut creation:', err);
      }
    }

    // 2. Direct 1-click Desktop shortcut file creation for Windows/macOS/desktop
    createDesktopShortcutFile();
    return 'shortcut-created';
  }, []);

  return {
    isInstallable,
    isInstalled,
    triggerDirectInstall,
  };
}
