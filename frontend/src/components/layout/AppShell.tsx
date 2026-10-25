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
import { FirebaseConfigModal } from '../auth/FirebaseConfigModal';
import { useLevelora } from '../../context/LeveloraContext';

export const AppShell: React.FC = () => {
  const { state } = useLevelora();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFramed = state.settings.displayMode === 'frame';

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
      
      {/* Floating Outer Ambient Mascot & Speech Bubble (exact match to reference image bottom-left!) */}
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

      {/* Main App Window / Studio Laptop Frame Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isFramed
            ? 'max-w-[1380px] my-auto'
            : 'max-w-full min-h-screen'
        }`}
      >
        {/* Laptop Chassis Top / Display Bezel */}
        <div
          className={`relative w-full overflow-hidden transition-all duration-300 ${
            isFramed
              ? 'rounded-[32px] border-[6px] sm:border-[8px] border-[#223321] bg-gradient-to-b from-[#253d26] via-[#2c472e] to-[#344f36] shadow-[0_25px_70px_-15px_rgba(26,45,28,0.45)]'
              : 'rounded-2xl border border-white/20 bg-gradient-to-b from-[#253d26] via-[#2c472e] to-[#344f36] shadow-2xl min-h-screen'
          }`}
        >
          {/* Subtle Laptop Camera Notch in Frame mode */}
          {isFramed && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-[#223321] rounded-b-xl z-30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10" />
            </div>
          )}

          {/* Top Header */}
          <Header 
            onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} 
          />

          {/* Body Layout: Sidebar + Main Content */}
          <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] lg:h-[820px] max-h-[85vh]">
            
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

        {/* Laptop Bottom Aluminum Lip & Base (shown in frame mode) */}
        {isFramed && (
          <div className="relative mx-auto w-[98%] h-4 bg-gradient-to-r from-[#94a18e] via-[#c2cdc0] to-[#94a18e] rounded-b-xl shadow-lg flex items-center justify-center">
            {/* Display opener notch */}
            <div className="w-20 h-1.5 bg-[#40523f] rounded-b-md" />
          </div>
        )}
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
      <FirebaseConfigModal />
    </div>
  );
};
