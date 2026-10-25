import React from 'react';
import { 
  Sprout, 
  Code, 
  GraduationCap, 
  Activity, 
  MessageSquare, 
  Palette, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  Leaf
} from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import type { SkillStage } from '../types';

export const SkillGarden: React.FC = () => {
  const { state } = useLevelora();

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'code': return <Code size={18} className="text-[#A7B89A]" />;
      case 'graduation-cap': return <GraduationCap size={18} className="text-[#F5E6A8]" />;
      case 'activity': return <Activity size={18} className="text-[#F6B8A8]" />;
      case 'message-square': return <MessageSquare size={18} className="text-[#F5E6A8]" />;
      case 'palette': return <Palette size={18} className="text-[#F3A6B7]" />;
      case 'check-circle-2': return <CheckCircle2 size={18} className="text-[#A7B89A]" />;
      case 'compass': return <Compass size={18} className="text-[#74865B]" />;
      default: return <Sprout size={18} />;
    }
  };

  const renderPlantIllustration = (stage: SkillStage) => {
    switch (stage) {
      case 'seed':
        return (
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
            {/* Soft soil mount */}
            <ellipse cx="30" cy="50" rx="22" ry="6" fill="#4B382A" opacity="0.6" />
            <circle cx="30" cy="44" r="6" fill="#8C6239" />
            <ellipse cx="30" cy="44" rx="5" ry="3.5" fill="#A07248" />
          </svg>
        );
      case 'sprout':
        return (
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
            <ellipse cx="30" cy="52" rx="20" ry="5" fill="#4B382A" opacity="0.5" />
            {/* Sprout stem */}
            <path d="M30 50 Q30 36 29 28" stroke="#74865B" strokeWidth="3" strokeLinecap="round" />
            {/* Left Leaf */}
            <path d="M29 34 C20 30 18 22 24 20 C28 24 29 30 29 34 Z" fill="#A7B89A" />
            {/* Right Leaf */}
            <path d="M29 30 C38 26 40 18 34 16 C30 20 29 26 29 30 Z" fill="#DCE8D2" />
          </svg>
        );
      case 'sapling':
        return (
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
            <ellipse cx="30" cy="52" rx="22" ry="6" fill="#4B382A" opacity="0.5" />
            {/* Sturdy Stem */}
            <path d="M30 50 Q31 32 30 18" stroke="#74865B" strokeWidth="3.5" strokeLinecap="round" />
            {/* Leaves cluster */}
            <circle cx="22" cy="24" r="7" fill="#A7B89A" />
            <circle cx="38" cy="24" r="7" fill="#8CA37D" />
            <circle cx="30" cy="16" r="9" fill="#A7B89A" />
            <circle cx="30" cy="16" r="5" fill="#DCE8D2" opacity="0.7" />
          </svg>
        );
      case 'blooming':
        return (
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
            <ellipse cx="30" cy="52" rx="22" ry="6" fill="#4B382A" opacity="0.5" />
            <path d="M30 50 Q29 34 30 22" stroke="#74865B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M30 36 C22 34 18 28 22 26 C26 28 30 32 30 36 Z" fill="#A7B89A" />
            <path d="M30 32 C38 30 42 24 38 22 C34 24 30 28 30 32 Z" fill="#A7B89A" />
            {/* Flower Petals */}
            <circle cx="25" cy="18" r="6" fill="#F3A6B7" />
            <circle cx="35" cy="18" r="6" fill="#F3A6B7" />
            <circle cx="30" cy="13" r="6" fill="#F6B8A8" />
            <circle cx="30" cy="23" r="6" fill="#F6B8A8" />
            <circle cx="30" cy="18" r="4.5" fill="#F5E6A8" />
          </svg>
        );
      case 'ancient_bonsai':
        return (
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
            <ellipse cx="30" cy="52" rx="24" ry="6" fill="#4B382A" opacity="0.5" />
            {/* Bonsai Pot */}
            <path d="M18 46 L42 46 L38 52 L22 52 Z" fill="#6B4E3D" stroke="#4A3427" strokeWidth="1.5" />
            {/* Gnarled Trunk */}
            <path d="M30 46 Q35 38 26 30 Q33 22 30 16" stroke="#4A3427" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Cloud Foliage */}
            <ellipse cx="20" cy="25" rx="8" ry="5" fill="#74865B" />
            <ellipse cx="38" cy="22" rx="9" ry="6" fill="#8CA37D" />
            <ellipse cx="30" cy="13" rx="11" ry="7" fill="#A7B89A" />
            <ellipse cx="30" cy="13" rx="7" ry="4" fill="#DCE8D2" opacity="0.6" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Garden Banner */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Leaf size={22} className="text-[#A7B89A]" />
              <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight">
                The Skill Garden
              </h1>
            </div>
            <p className="text-xs text-[#DCE8D2] mt-1 max-w-xl leading-relaxed">
              Every quest you accomplish waters a branch of your personal capabilities. Watch your real-world skills grow from tender seedlings into blossoming botanical masters.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#A7B89A] block">Garden Vitality</span>
            <span className="text-lg font-black text-[#F5E6A8] flex items-center justify-center gap-1">
              <Sparkles size={16} /> 100% Thriving
            </span>
          </div>
        </div>
      </div>

      {/* Skills Botanical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.skills.map(skill => {
          const pct = Math.min(100, Math.round((skill.currentXp / (skill.currentXp + skill.xpToNextLevel)) * 100));

          return (
            <div
              key={skill.id}
              className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Header with Plant Illustration */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                      {getSkillIcon(skill.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#FFF5E8]">{skill.name}</h3>
                      <span className="text-[10px] font-semibold text-[#A7B89A] capitalize">
                        {skill.stage.replace('_', ' ')} stage
                      </span>
                    </div>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center">
                    {renderPlantIllustration(skill.stage)}
                  </div>
                </div>

                <p className="text-xs text-[#DCE8D2]/80 leading-relaxed min-h-[36px]">
                  {skill.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#FFF5E8]">Level {skill.level}</span>
                    <span className="text-[#F5E6A8]">{skill.currentXp} XP</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#A7B89A] to-[#F5E6A8] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-[#A7B89A]">
                <span>{skill.totalQuestsCompleted} quests cultivated</span>
                <span className="text-[#F5E6A8] font-bold">+{skill.xpToNextLevel} XP to grow</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
