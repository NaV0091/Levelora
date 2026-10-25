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
import { PandaMascot } from '../common/PandaMascot';
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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#F6B8A8] via-[#F3A6B7] to-[#F5E6A8] p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-center overflow-x-hidden selection:bg-[#F3A6B7]/40 selection:text-[#29452B]">
      
      {/* Floating Outer Ambient Mascot & Speech Bubble */}
      <div className="hidden xl:flex fixed bottom-6 left-6 z-30 items-end gap-3 pointer-events-auto">
        <div className="p-3.5 rounded-3xl bg-[#FFF5E8]/95 backdrop-blur-md border border-[#F3A6B7]/60 shadow-xl max-w-xs text-xs text-[#29452B] leading-relaxed">
          <p className="font-semibold italic">
            &ldquo;Every tiny step counts — today&apos;s habit is tomorrow&apos;s victory.&rdquo;
          </p>
          <span className="text-[10px] text-[#74865B] font-bold block mt-1 text-right">— Nooby</span>
        </div>
        <div className="shrink-0 -mb-2">
          <PandaMascot pose="bamboo" size={88} animated />
        </div>
      </div>

      {/* Main App Container */}
      <div className="w-full max-w-7xl min-h-[92vh] flex flex-col rounded-3xl border border-white/20 bg-gradient-to-b from-[#253d26] via-[#2c472e] to-[#344f36] shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <Header 
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} 
        />

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden min-h-[calc(92vh-75px)]">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block border-r border-white/10 shrink-0 overflow-y-auto">
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>

          {/* Mobile Drawer Sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-72 bg-[#253d26] h-full shadow-2xl border-r border-white/20 z-10 overflow-y-auto">
                <Sidebar
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  onCloseMobile={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
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
