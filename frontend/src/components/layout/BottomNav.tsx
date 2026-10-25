import React from 'react';
import { LayoutDashboard, CheckSquare, CalendarCheck, User, Award } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { id: 'quests', label: 'Quests', icon: <CheckSquare size={20} /> },
    { id: 'habits', label: 'Habits', icon: <CalendarCheck size={20} /> },
    { id: 'character', label: 'Hero', icon: <User size={20} /> },
    { id: 'rewards', label: 'Rewards', icon: <Award size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-[#1E3320]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl flex items-center justify-around">
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
              isActive
                ? 'text-[#F5E6A8] bg-white/20 font-bold scale-105'
                : 'text-[#DCE8D2]/70 hover:text-[#FFF5E8]'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
