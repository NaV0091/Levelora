import React, { useState } from 'react';
import { 
  Dumbbell, 
  Book, 
  Target, 
  Heart, 
  MessageCircle, 
  Flame, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { PandaMascot } from '../components/common/PandaMascot';
import type { PandaPose } from '../components/common/PandaMascot';
import { formatDateDisplay } from '../utils/dates';

export const Character: React.FC = () => {
  const { state, levelInfo, currentStreak, longestStreak, updateProfile } = useLevelora();

  const [selectedPose, setSelectedPose] = useState<PandaPose>(
    (state.settings.avatarVariant as PandaPose) || 'bamboo'
  );
  const [usernameInput, setUsernameInput] = useState(state.profile.username);
  const [isEditingName, setIsEditingName] = useState(false);

  const posesList: { id: PandaPose; name: string }[] = [
    { id: 'bamboo', name: 'Bamboo Classic' },
    { id: 'waving', name: 'Warm Greeter' },
    { id: 'scholar', name: 'Wise Scholar' },
    { id: 'workout', name: 'Energetic Gym' },
    { id: 'meditating', name: 'Zen Master' },
    { id: 'celebrating', name: 'Joyful Champ' },
    { id: 'sleeping', name: 'Restful Dreamer' },
  ];

  const handleSelectPose = (pose: PandaPose) => {
    setSelectedPose(pose);
    updateProfile({ avatar: pose });
  };

  const handleSaveName = () => {
    if (usernameInput.trim()) {
      updateProfile({ username: usernameInput.trim() });
      setIsEditingName(false);
    }
  };

  const getAttributeIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Dumbbell size={18} className="text-[#F6B8A8]" />;
      case 'intelligence': return <Book size={18} className="text-[#A7B89A]" />;
      case 'discipline': return <Target size={18} className="text-[#F5E6A8]" />;
      case 'vitality': return <Heart size={18} className="text-[#F3A6B7]" />;
      case 'charisma': return <MessageCircle size={18} className="text-[#F5E6A8]" />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Hero Overview Card */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Main Avatar Showcase */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#FFF5E8] via-[#FFF0E0] to-[#A7B89A] p-2 flex items-center justify-center shadow-xl border-4 border-white/20">
              <PandaMascot pose={selectedPose} size={105} animated />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#F5E6A8] text-[#29452B] font-black text-xs shadow-md border border-white/40">
              Lv. {levelInfo.level}
            </div>
          </div>

          {/* Player Identity */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    className="px-3 py-1 rounded-xl bg-white/80 text-[#29452B] text-lg font-black focus:outline-none"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 rounded-xl bg-[#A7B89A] text-white font-bold text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#FFF5E8] tracking-tight">
                    {state.profile.username}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-[#A7B89A] hover:text-white underline font-semibold"
                  >
                    edit
                  </button>
                </div>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="px-3 py-0.5 rounded-full bg-[#74865B] text-white font-bold">
                {levelInfo.title}
              </span>
              <span className="text-[#DCE8D2]">•</span>
              <span className="text-[#DCE8D2]">Adventurer since {formatDateDisplay(state.profile.createdAt.slice(0, 10))}</span>
            </div>

            {/* Lifetime XP Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs font-bold text-[#DCE8D2] mb-1">
                <span>Total Lifetime XP</span>
                <span className="text-[#F5E6A8]">{state.profile.lifetimeXp} XP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#A7B89A] via-[#F5E6A8] to-[#F6B8A8] rounded-full transition-all duration-700"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#A7B89A] mt-1 font-semibold">
                <span>Level {levelInfo.level}</span>
                <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP to Level {levelInfo.level + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Variant Selector */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-xs font-bold text-[#DCE8D2] mb-2.5">
            Choose Your Mascot Avatar Pose:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {posesList.map(item => {
              const isSelected = selectedPose === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectPose(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 border-[#F5E6A8] text-[#F5E6A8] font-bold shadow-xs'
                      : 'bg-black/15 border-white/10 text-[#DCE8D2] hover:bg-white/10'
                  }`}
                >
                  <PandaMascot pose={item.id} size={24} />
                  <span className="text-xs">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Stats Quad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#F6B8A8] mb-1">
            <Flame size={16} className="fill-[#F6B8A8]" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
          </div>
          <div className="text-2xl font-black text-[#FFF5E8]">{currentStreak} <span className="text-xs text-[#A7B89A]">days</span></div>
          <p className="text-[10px] text-[#DCE8D2]/80 mt-1">Consistency builds character</p>
        </div>

        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#F5E6A8] mb-1">
            <Trophy size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Longest Streak</span>
          </div>
          <div className="text-2xl font-black text-[#FFF5E8]">{longestStreak} <span className="text-xs text-[#A7B89A]">days</span></div>
          <p className="text-[10px] text-[#DCE8D2]/80 mt-1">Your historical personal best</p>
        </div>

        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#A7B89A] mb-1">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Quests Done</span>
          </div>
          <div className="text-2xl font-black text-[#FFF5E8]">
            {state.completionHistory.length}
          </div>
          <p className="text-[10px] text-[#DCE8D2]/80 mt-1">Verified achievements</p>
        </div>

        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#DCE8D2] mb-1">
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Perfect Days</span>
          </div>
          <div className="text-2xl font-black text-[#FFF5E8]">
            {state.profile.perfectDaysCount ?? 0}
          </div>
          <p className="text-[10px] text-[#DCE8D2]/80 mt-1">All daily goals fulfilled</p>
        </div>
      </div>

      {/* 5 RPG Attributes Detailed Sheet */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={20} className="text-[#A7B89A]" />
          <div>
            <h2 className="text-lg font-black text-[#FFF5E8]">Character Attributes</h2>
            <p className="text-xs text-[#A7B89A]">
              Attributes increase deterministically through quest completions in their respective disciplines.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.values(state.attributes).map(attr => {
            const pct = Math.min(100, Math.round((attr.currentXp / attr.xpToNextLevel) * 100));

            return (
              <div
                key={attr.type}
                className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
                      {getAttributeIcon(attr.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#FFF5E8]">{attr.name}</h3>
                        <span className="px-2 py-0.2 rounded-md bg-[#F5E6A8]/20 text-[#F5E6A8] text-xs font-black">
                          Rank {attr.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#DCE8D2]/80 leading-snug">{attr.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#F5E6A8]">{attr.currentXp}</span>
                    <span className="text-xs text-[#A7B89A]"> / {attr.xpToNextLevel} XP</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-black/30 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#A7B89A] to-[#F5E6A8] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
