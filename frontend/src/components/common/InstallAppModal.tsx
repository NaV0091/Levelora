import React, { useState, useEffect } from 'react';
import { X, Smartphone, Monitor, Download, Sparkles, Share2, PlusSquare } from 'lucide-react';
import { PandaMascot } from './PandaMascot';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'windows' | 'mobile'>('windows');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#29452B] via-[#243d26] to-[#1c301e] border-2 border-[#A7B89A]/40 p-6 sm:p-8 text-[#FFF5E8] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#A7B89A] to-[#F5E6A8] p-1.5 shadow-lg mb-3">
            <PandaMascot pose="peeking" size={50} animated />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#FFF5E8] font-outfit">
            Get LEVELORA App
          </h2>
          <p className="text-xs text-[#DCE8D2] mt-1 max-w-sm mx-auto font-medium">
            Take your RPG quest system anywhere! Install directly on Windows, Android, or iPhone.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-full bg-black/30 p-1 mb-6 border border-white/10">
          <button
            onClick={() => setActiveTab('windows')}
            className={`flex-1 py-2 rounded-full text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'windows'
                ? 'bg-[#F6B8A8] text-[#29452B] shadow-md'
                : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span>Windows Desktop</span>
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2 rounded-full text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-[#F6B8A8] text-[#29452B] shadow-md'
                : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span>Mobile (iOS &amp; Android)</span>
          </button>
        </div>

        {/* Tab Content: Windows */}
        {activeTab === 'windows' && (
          <div className="space-y-4">
            {deferredPrompt && !isInstalled && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#A7B89A] to-[#DCE8D2] hover:brightness-105 active:scale-95 text-[#1E3320] font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
              >
                <Download size={16} />
                <span>1-Click Install on Windows</span>
              </button>
            )}

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3">
              <div className="flex items-center gap-2 text-[#F5E6A8] text-xs font-black">
                <Sparkles size={14} />
                <span>How to Install on Windows (Chrome &amp; Edge)</span>
              </div>

              <div className="space-y-2.5 text-xs text-[#DCE8D2]">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 text-[#FFF5E8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    In your browser address bar (top right), look for the{' '}
                    <strong className="text-[#FFF5E8]">App available / Install</strong> icon (🖥️ or ⬇️).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 text-[#FFF5E8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    Or click browser menu (<strong className="text-[#FFF5E8]">⋮</strong> on Chrome or{' '}
                    <strong className="text-[#FFF5E8]">...</strong> on Edge) &rarr;{' '}
                    <strong className="text-[#F5E6A8]">&ldquo;Install LEVELORA RPG&rdquo;</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 text-[#FFF5E8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    Click <strong className="text-[#FFF5E8]">Install</strong>. LEVELORA will launch as a standalone desktop window, complete with Taskbar pin and desktop shortcut!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Mobile */}
        {activeTab === 'mobile' && (
          <div className="space-y-4">
            {/* Android instructions */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-[#A7B89A] text-xs font-black">
                <Smartphone size={14} />
                <span>Android (Chrome)</span>
              </div>
              <p className="text-xs text-[#DCE8D2] leading-relaxed">
                Tap the three dots (<strong className="text-[#FFF5E8]">⋮</strong>) in the top-right corner of Chrome, then tap{' '}
                <strong className="text-[#F5E6A8]">&ldquo;Install app&rdquo;</strong> or{' '}
                <strong className="text-[#F5E6A8]">&ldquo;Add to Home screen&rdquo;</strong>.
              </p>
            </div>

            {/* iOS instructions */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-[#F6B8A8] text-xs font-black">
                <Share2 size={14} />
                <span>iPhone &amp; iPad (Safari)</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#DCE8D2] leading-relaxed">
                <p>
                  1. Tap the <strong className="text-[#FFF5E8]">Share</strong> button (<Share2 size={12} className="inline mx-0.5" />) at the bottom of Safari.
                </p>
                <p>
                  2. Scroll down and tap <strong className="text-[#F5E6A8]">&ldquo;Add to Home Screen&rdquo;</strong> (<PlusSquare size={12} className="inline mx-0.5" />).
                </p>
                <p>
                  3. Tap <strong className="text-[#FFF5E8]">Add</strong>. LEVELORA appears right on your home screen with a clean fullscreen experience!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/15 hover:bg-white/20 text-xs font-bold text-[#FFF5E8] transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
