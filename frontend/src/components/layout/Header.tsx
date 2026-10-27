import React from 'react';
import { Volume2, VolumeX, Flame, Menu, Sparkles, LogOut, Download } from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';
import { useAuth } from '../../context/AuthContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { PandaMascot } from '../common/PandaMascot';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { state, levelInfo, currentStreak, updateSettings, addToast } = useLevelora();
  const { user, signOut } = useAuth();
  const { isInstalled, triggerDirectInstall } = usePwaInstall();

  const toggleSound = () => {
    updateSettings({ soundEnabled: !state.settings.soundEnabled });
  };

  const handleDirectInstall = async () => {
    const result = await triggerDirectInstall();
    if (result === 'accepted') {
      addToast({
        title: 'Shortcut Created!',
        message: '🎉 LEVELORA RPG app shortcut installed directly on your device!',
        type: 'success',
      });
    } else if (result === 'shortcut-created') {
      addToast({
        title: 'Shortcut Created!',
        message: '✨ Desktop shortcut created and saved to your device for 1-click launch!',
        type: 'success',
      });
    } else if (result === 'already-installed') {
      addToast({
        title: 'Already Installed',
        message: '✨ LEVELORA RPG is already installed on your device.',
        type: 'info',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 text-[#FFF5E8] gap-2">
      {/* Left: Mobile Menu & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-[#A7B89A] to-[#DCE8D2] flex items-center justify-center shadow-md p-0.5 shrink-0">
            <PandaMascot pose="bamboo" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-wider text-[#FFF5E8] font-outfit">
                LEVELORA
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-[#F5E6A8] text-[#29452B]">
                RPG
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-[#A7B89A] font-medium tracking-wide">
              Your Life. Your Levels. Your Journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right: RPG Stats & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Streak indicator */}
        <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shrink-0">
          <Flame size={14} className="text-[#F6B8A8] fill-[#F6B8A8] animate-pulse shrink-0" />
          <span className="text-xs font-black text-[#FFF5E8]">
            {currentStreak} <span className="text-[10px] font-semibold text-[#DCE8D2] hidden sm:inline">days</span>
          </span>
        </div>

        {/* Level & XP Mini Bar (hidden on small screens, shown on md+) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-1 text-xs font-black text-[#F5E6A8]">
            <Sparkles size={13} />
            <span>Lv.{levelInfo.level}</span>
          </div>
          <div className="w-16 h-2 rounded-full bg-black/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A7B89A] to-[#F5E6A8] transition-all duration-500 rounded-full"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-[#DCE8D2] font-semibold">
            {levelInfo.xpInCurrentLevel}/{levelInfo.xpNeededForNextLevel} XP
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-all active:scale-95 cursor-pointer shrink-0"
          title={state.settings.soundEnabled ? 'Mute cozy sounds' : 'Enable cozy sounds'}
        >
          {state.settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-300" />}
        </button>

        {/* Direct 1-Click Install App Button - ALWAYS VISIBLE across all devices */}
        <button
          id="direct-install-app-btn"
          onClick={handleDirectInstall}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-[#29452B] font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0 border border-white/25 hover:shadow-lg"
          title="Install LEVELORA App / Download 1-Click Desktop Shortcut"
        >
          <Download size={13} strokeWidth={2.5} className="shrink-0" />
          <span className="font-extrabold text-[11px] sm:text-xs">
            {isInstalled ? 'App Ready' : 'Install App'}
          </span>
        </button>

        {/* User Badge & Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l border-white/15 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF5E8] border-2 border-[#A7B89A] flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            <PandaMascot pose="waving" size={24} />
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1">
              <p className="text-xs font-black text-[#FFF5E8] leading-none truncate max-w-[100px]">
                {state.profile.username || (user?.isGuest ? 'Guest' : 'Adventurer')}
              </p>
              {user?.isGuest && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#F5E6A8] text-[#29452B] font-extrabold leading-none">
                  Guest
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#A7B89A] font-semibold leading-tight truncate max-w-[120px]">
              {user?.email || (user?.isGuest ? 'Guest Adventurer' : 'Logged In')}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        {user && (
          <button
            onClick={handleSignOut}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-[#FFF5E8] hover:text-red-300 transition-all active:scale-95 cursor-pointer shrink-0"
            title={`Sign Out (${state.profile.username || (user?.isGuest ? 'Guest' : 'Adventurer')})`}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
};
