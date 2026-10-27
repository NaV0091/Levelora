import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Dashboard } from '../../pages/Dashboard';
import { Quests } from '../../pages/Quests';
import { Habits } from '../../pages/Habits';
import { Character } from '../../pages/Character';
import { SkillGarden } from '../../pages/SkillGarden';
import { Rewards } from '../../pages/Rewards';
import { Analytics } from '../../pages/Analytics';
import { Leaderboard } from '../../pages/Leaderboard';
import { Settings } from '../../pages/Settings';
import { QuestModal } from '../quests/QuestModal';
import { HabitModal } from '../habits/HabitModal';
import { LevelUpModal } from '../common/LevelUpModal';
import { AchievementModal } from '../common/AchievementModal';
import { ToastContainer } from '../common/ToastContainer';
import { AuthModal } from '../auth/AuthModal';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigateTab={setCurrentTab} />;
      case 'quests':
        return <Quests />;
      case 'habits':
        return <Habits />;
      case 'character':
        return <Character />;
      case 'skills':
        return <SkillGarden />;
      case 'rewards':
        return <Rewards />;
      case 'analytics':
        return <Analytics />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1e3421] flex flex-col overflow-x-hidden selection:bg-[#A7B89A]/40 selection:text-[#FFF5E8]">
      {/* Main App Container - Fits 100% to screen */}
      <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-[#253d26] via-[#2c472e] to-[#344f36] shadow-none">
        
        {/* Top Header */}
        <Header 
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} 
        />

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden min-h-[calc(100vh-65px)]">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block border-r border-white/10 shrink-0 overflow-y-auto">
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>

          {/* Mobile Drawer Sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-72 max-w-[85vw] bg-[#253d26] h-full shadow-2xl border-r border-white/20 z-10 overflow-y-auto">
                <Sidebar
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  onCloseMobile={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content Area: Responsive padding with safe bottom space on mobile for BottomNav */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-28 lg:pb-8 scroll-smooth">
            {renderActivePage()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global Modals & Notifications */}
      <QuestModal />
      <HabitModal />
      <LevelUpModal />
      <AchievementModal />
      <ToastContainer />
      <AuthModal />
    </div>
  );
};
