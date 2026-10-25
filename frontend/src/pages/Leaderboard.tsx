import React, { useState } from 'react';
import { Trophy, Flame, Medal } from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { PandaMascot } from '../components/common/PandaMascot';
import type { PandaPose } from '../components/common/PandaMascot';

import { getPastNDays } from '../utils/dates';

interface GuildAdventurer {
  id: string;
  rank: number;
  username: string;
  avatar: PandaPose;
  title: string;
  level: number;
  totalXp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export const Leaderboard: React.FC = () => {
  const { state, levelInfo, currentStreak } = useLevelora();
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');

  // Other guild members for weekly ranking
  const weeklyOthers: Omit<GuildAdventurer, 'rank'>[] = [
    {
      id: 'adv-1',
      username: 'Luna_Tea',
      avatar: 'scholar',
      title: 'Bamboo Master',
      level: 11,
      totalXp: 950,
      streak: 42,
    },
    {
      id: 'adv-2',
      username: 'ZenPanda',
      avatar: 'meditating',
      title: 'Forest Sage',
      level: 8,
      totalXp: 720,
      streak: 31,
    },
    {
      id: 'adv-4',
      username: 'Milo_Runner',
      avatar: 'workout',
      title: 'Brisk Explorer',
      level: 4,
      totalXp: 380,
      streak: 18,
    },
    {
      id: 'adv-5',
      username: 'BaoBao',
      avatar: 'bamboo',
      title: 'Cozy Adventurer',
      level: 3,
      totalXp: 210,
      streak: 12,
    },
    {
      id: 'adv-6',
      username: 'Sproutling',
      avatar: 'waving',
      title: 'Novice Sprout',
      level: 2,
      totalXp: 90,
      streak: 5,
    },
  ];

  // Other guild members for all-time ranking
  const alltimeOthers: Omit<GuildAdventurer, 'rank'>[] = [
    {
      id: 'adv-1',
      username: 'Luna_Tea',
      avatar: 'scholar',
      title: 'Bamboo Master',
      level: 11,
      totalXp: 4850,
      streak: 42,
    },
    {
      id: 'adv-2',
      username: 'ZenPanda',
      avatar: 'meditating',
      title: 'Forest Sage',
      level: 8,
      totalXp: 2950,
      streak: 31,
    },
    {
      id: 'adv-4',
      username: 'Milo_Runner',
      avatar: 'workout',
      title: 'Brisk Explorer',
      level: 4,
      totalXp: 620,
      streak: 18,
    },
    {
      id: 'adv-5',
      username: 'BaoBao',
      avatar: 'bamboo',
      title: 'Cozy Adventurer',
      level: 3,
      totalXp: 340,
      streak: 12,
    },
    {
      id: 'adv-6',
      username: 'Sproutling',
      avatar: 'waving',
      title: 'Novice Sprout',
      level: 2,
      totalXp: 180,
      streak: 5,
    },
  ];

  // Calculate user XP in the last 7 days
  const last7DaysDateStrs = new Set(getPastNDays(7).map(d => d.dateStr));
  const userWeeklyXp = state.xpTransactions
    .filter(tx => last7DaysDateStrs.has(tx.timestamp.slice(0, 10)) && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentUserWeekly: Omit<GuildAdventurer, 'rank'> = {
    id: 'current-user',
    username: state.profile.username,
    avatar: (state.settings.avatarVariant as PandaPose) || 'bamboo',
    title: levelInfo.title,
    level: levelInfo.level,
    totalXp: userWeeklyXp,
    streak: currentStreak,
    isCurrentUser: true,
  };

  const currentUserAlltime: Omit<GuildAdventurer, 'rank'> = {
    id: 'current-user',
    username: state.profile.username,
    avatar: (state.settings.avatarVariant as PandaPose) || 'bamboo',
    title: levelInfo.title,
    level: levelInfo.level,
    totalXp: state.profile.lifetimeXp,
    streak: currentStreak,
    isCurrentUser: true,
  };

  const rosterBase = tab === 'weekly'
    ? [...weeklyOthers, currentUserWeekly]
    : [...alltimeOthers, currentUserAlltime];

  // Dynamic ranking sorted strictly by totalXp descending.
  // When totalXp is tied (e.g. 0 XP for a new user), the current user is placed at the end so rank is LAST.
  const sortedRoster = rosterBase.sort((a, b) => {
    if (b.totalXp !== a.totalXp) {
      return b.totalXp - a.totalXp;
    }
    if (a.isCurrentUser) return 1;
    if (b.isCurrentUser) return -1;
    return b.streak - a.streak;
  });

  const guildMembers: GuildAdventurer[] = sortedRoster.map((member, idx) => ({
    ...member,
    rank: idx + 1,
  }));

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight flex items-center gap-2">
            <Trophy size={24} className="text-[#F5E6A8]" />
            Adventurer Guild
          </h1>
          <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
            A friendly, supportive community of life-levelers. Compare your journey with fellow adventurers!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/20 text-xs font-bold">
          <button
            onClick={() => setTab('weekly')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              tab === 'weekly' ? 'bg-[#74865B] text-white shadow-xs' : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            Weekly Hall
          </button>
          <button
            onClick={() => setTab('alltime')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              tab === 'alltime' ? 'bg-[#74865B] text-white shadow-xs' : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            All-Time Legends
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {guildMembers.slice(0, 3).map((member, idx) => {
          const colors = [
            'from-[#F5E6A8]/30 border-[#F5E6A8]',
            'from-[#DCE8D2]/30 border-[#DCE8D2]',
            'from-[#F6B8A8]/30 border-[#F6B8A8]',
          ];

          return (
            <div
              key={member.id}
              className={`relative p-5 rounded-3xl bg-gradient-to-b ${colors[idx]} to-white/5 backdrop-blur-md border p-5 text-center flex flex-col items-center justify-between shadow-sm ${
                member.isCurrentUser ? 'ring-2 ring-[#F5E6A8]' : ''
              }`}
            >
              <div className="absolute top-3 left-3 flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full bg-black/30">
                <Medal size={14} className={idx === 0 ? 'text-[#F5E6A8]' : idx === 1 ? 'text-gray-300' : 'text-amber-500'} />
                <span>Rank #{member.rank}</span>
              </div>

              {member.isCurrentUser && (
                <div className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F5E6A8] text-[#29452B]">
                  You
                </div>
              )}

              <div className="mt-4 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shadow-md p-1 mx-auto">
                  <PandaMascot pose={member.avatar} size={50} />
                </div>
              </div>

              <h3 className="text-base font-extrabold text-[#FFF5E8]">{member.username}</h3>
              <p className="text-xs text-[#A7B89A] font-semibold">{member.title}</p>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10 w-full justify-center text-xs">
                <span className="font-bold text-[#F5E6A8]">Level {member.level}</span>
                <span className="text-[#DCE8D2]">•</span>
                <span className="font-extrabold text-[#FFF5E8]">{member.totalXp} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Guild Roster Table */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm overflow-hidden">
        <h3 className="text-sm font-extrabold text-[#FFF5E8] mb-3">Guild Roster</h3>
        
        <div className="divide-y divide-white/10">
          {guildMembers.map(member => (
            <div
              key={member.id}
              className={`flex items-center justify-between py-3.5 px-3 rounded-2xl transition-colors ${
                member.isCurrentUser ? 'bg-white/15 font-bold shadow-xs' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-black text-[#A7B89A]">
                  #{member.rank}
                </span>

                <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center p-0.5">
                  <PandaMascot pose={member.avatar} size={28} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FFF5E8]">{member.username}</span>
                    {member.isCurrentUser && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#F5E6A8] text-[#29452B]">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#A7B89A]">{member.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-[#F6B8A8]">
                  <Flame size={13} className="fill-[#F6B8A8]" />
                  <span>{member.streak}d</span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-[#F5E6A8] block">{member.totalXp} XP</span>
                  <span className="text-[10px] text-[#DCE8D2]">Lv. {member.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-[#A7B89A] text-center italic">
          * Local demo guild leaderboard showcasing your ranking amongst fellow life adventurers.
        </p>
      </div>
    </div>
  );
};
