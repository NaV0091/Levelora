import React, { useState } from 'react';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { PandaBadge } from '../components/common/PandaBadge';
import { formatDateDisplay } from '../utils/dates';

export const Rewards: React.FC = () => {
  const { state } = useLevelora();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = state.achievements.filter(ach => {
    if (filter === 'unlocked') return ach.unlocked;
    if (filter === 'locked') return !ach.unlocked;
    return true;
  });

  const unlockedCount = state.achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight flex items-center gap-2">
            Trophy Hall &amp; Badges
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#A7B89A]/30 text-[#FFF5E8]">
              {unlockedCount} / {state.achievements.length} Unlocked
            </span>
          </h1>
          <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
            Earn cute badges and bonus XP for reaching life milestones and maintaining your streaks.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/20 text-xs font-bold shrink-0">
          {(['all', 'unlocked', 'locked'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#74865B] text-white shadow-xs'
                  : 'text-[#DCE8D2]/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(ach => {
          const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl backdrop-blur-md border transition-all flex items-start gap-4 ${
                ach.unlocked
                  ? 'bg-white/15 border-[#A7B89A]/50 shadow-sm'
                  : 'bg-white/5 border-white/10 opacity-75'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <PandaBadge code={ach.badgeCode} size={68} unlocked={ach.unlocked} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#FFF5E8] truncate">{ach.title}</h3>
                    {ach.unlocked ? (
                      <span className="p-0.5 rounded-full bg-[#A7B89A] text-[#1E3320]">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="text-[#A7B89A]">
                        <Lock size={12} />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#F5E6A8] text-[#29452B] shrink-0">
                    +{ach.xpReward} XP
                  </span>
                </div>

                <p className="text-xs text-[#DCE8D2]/80 mt-1 leading-relaxed">
                  {ach.description}
                </p>

                {/* Progress bar or unlock date */}
                <div className="mt-3 pt-2 border-t border-white/10">
                  {ach.unlocked ? (
                    <div className="flex items-center justify-between text-[11px] text-[#A7B89A]">
                      <span className="flex items-center gap-1 text-[#F5E6A8] font-semibold">
                        <Sparkles size={12} /> Unlocked
                      </span>
                      <span>{ach.unlockedAt ? formatDateDisplay(ach.unlockedAt.slice(0, 10)) : 'Completed'}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between text-[10px] text-[#A7B89A] font-bold mb-1">
                        <span>Progress</span>
                        <span>{ach.progress} / {ach.maxProgress} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A7B89A] to-[#F5E6A8] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
