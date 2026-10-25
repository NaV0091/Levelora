import React from 'react';
import { Volume2, VolumeX, Flame, Maximize2, Minimize2, Menu, Sparkles, LogOut, Download } from 'lucide-react';
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

  const toggleDisplayMode = () => {
    updateSettings({
      displayMode: state.settings.displayMode === 'frame' ? 'fullscreen' : 'frame',
    });
  };

  const handleDirectInstall = async () => {
    const result = await triggerDirectInstall();
    if (result === 'accepted') {
      addToast({
        title: 'App Installed!',
        message: '🎉 LEVELORA RPG was installed! Launch it anytime from your desktop or home screen.',
        type: 'success',
      });
    } else if (result === 'already-installed') {
      addToast({
        title: 'Already Installed',
        message: '✨ LEVELORA RPG is already installed on your device.',
        type: 'info',
      });
    } else if (result === 'unsupported') {
      addToast({
        title: 'Install App',
        message: '⬇️ Click the Install icon in your browser address bar (or Share → Add to Home Screen) to install.',
        type: 'info',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-[#FFF5E8]">
      {/* Left: Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#A7B89A] to-[#DCE8D2] flex items-center justify-center shadow-md p-0.5">
            <PandaMascot pose="bamboo" size={30} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-[#FFF5E8] font-outfit">
                LEVELORA
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-[#F5E6A8] text-[#29452B]">
                RPG
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-[#A7B89A] font-medium tracking-wide">
              Your Life. Your Levels. Your Journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right: RPG Stats & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
          <Flame size={15} className="text-[#F6B8A8] fill-[#F6B8A8] animate-pulse" />
          <span className="text-xs font-black text-[#FFF5E8]">
            {currentStreak} <span className="text-[10px] font-semibold text-[#DCE8D2] hidden sm:inline">days</span>
          </span>
        </div>

        {/* Level & XP Mini Bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
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
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-all active:scale-95 cursor-pointer"
          title={state.settings.soundEnabled ? 'Mute cozy sounds' : 'Enable cozy sounds'}
        >
          {state.settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-300" />}
        </button>

        {/* Frame / Fullscreen view toggle */}
        <button
          onClick={toggleDisplayMode}
          className="hidden md:flex p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-all active:scale-95 cursor-pointer"
          title={state.settings.displayMode === 'frame' ? 'Switch to Fullscreen Canvas' : 'Switch to Studio Frame'}
        >
          {state.settings.displayMode === 'frame' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
        </button>

        {/* Direct 1-Click Install App Button */}
        {!isInstalled && (
          <button
            id="direct-install-app-btn"
            onClick={handleDirectInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-[#29452B] font-extrabold text-xs shadow-sm transition-all cursor-pointer"
            title="Install LEVELORA App Directly"
          >
            <Download size={13} strokeWidth={2.5} />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* User Badge & Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-white/15">
          <div className="w-8 h-8 rounded-full bg-[#FFF5E8] border-2 border-[#A7B89A] flex items-center justify-center overflow-hidden shadow-sm">
            <PandaMascot pose="waving" size={26} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-[#FFF5E8] leading-none">
              {state.profile.username || 'Adventurer'}
            </p>
            <p className="text-[10px] text-[#A7B89A] font-semibold leading-tight">
              {user?.email || 'Logged In'}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        {user && (
          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-[#FFF5E8] hover:text-red-300 transition-all active:scale-95 cursor-pointer ml-1"
            title={`Sign Out (${state.profile.username || 'Adventurer'})`}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
};
