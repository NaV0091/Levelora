import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarCheck, 
  User, 
  Sprout, 
  Award, 
  BarChart3, 
  Trophy, 
  Settings, 
  Plus,
  Download,
  X
} from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { PandaMascot } from '../common/PandaMascot';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, onCloseMobile }) => {
  const { state, setIsAddQuestOpen } = useLevelora();
  const { triggerDirectInstall } = usePwaInstall();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'quests', label: 'My Quests', icon: <CheckSquare size={18} /> },
    { id: 'habits', label: 'My Habits', icon: <CalendarCheck size={18} /> },
    { id: 'character', label: 'My Character', icon: <User size={18} /> },
    { id: 'skills', label: 'Skill Garden', icon: <Sprout size={18} /> },
    { id: 'rewards', label: 'Rewards', icon: <Award size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 flex flex-col justify-between h-full p-5 sm:p-6 text-[#FFF5E8] select-none">
      {/* Top Profile / Greeting Section */}
      <div>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-[#DCE8D2]/90">Hello,</p>
            <h2 className="text-2xl font-black tracking-tight text-[#FFF5E8]">
              {state.profile.username || 'Adventurer'}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#A7B89A]">
              <span className="w-2 h-2 rounded-full bg-[#A7B89A] animate-pulse" />
              <span className="font-semibold">{state.profile.title}</span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#DCE8D2] hover:text-white transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Action Buttons: Add quest & Install app */}
        <div className="mb-5 space-y-2">
          <button
            onClick={() => {
              setIsAddQuestOpen(true);
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-4 rounded-full bg-[#F6B8A8] hover:bg-[#F3A6B7] active:scale-95 text-[#29452B] font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add new quest
          </button>

          <button
            onClick={async () => {
              await triggerDirectInstall();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[#FFF5E8] border border-white/15 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download size={13} className="text-[#F6B8A8]" />
            <span>Install LEVELORA App</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/20 text-[#FFF5E8] shadow-sm backdrop-blur-md font-bold border border-white/25'
                    : 'text-[#DCE8D2]/75 hover:text-[#FFF5E8] hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#F5E6A8]' : 'text-[#A7B89A]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5E6A8] shadow-[0_0_8px_#F5E6A8]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Panda Quote Box */}
      <div className="relative mt-6 pt-4 border-t border-white/10">
        <div className="relative p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-xs leading-relaxed text-[#DCE8D2]">
          <p className="italic">
            &ldquo;Small wins build big changes — today&apos;s effort is tomorrow&apos;s success.&rdquo;
          </p>
          <div className="absolute -bottom-3 -right-2 transform translate-y-1">
            <PandaMascot pose="peeking" size={48} animated />
          </div>
        </div>
      </div>
    </aside>
  );
};
