import React, { useState } from 'react';
import { 
  Check, 
  Droplet, 
  Book, 
  Dumbbell, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Heart, 
  Target, 
  RotateCcw,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { PandaMascot } from '../components/common/PandaMascot';
import { PandaBadge } from '../components/common/PandaBadge';
import { getCurrentWeekDays } from '../utils/dates';
import type { Quest } from '../types';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  const { 
    state, 
    levelInfo, 
    currentStreak, 
    completeQuest, 
    reverseQuestCompletion, 
    toggleHabitToday,
    setIsAddQuestOpen,
    setIsAddHabitOpen,
    deleteQuest,
    deleteHabit,
    setEditingQuest
  } = useLevelora();

  const [activeHabitTab, setActiveHabitTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeProgressTab, setActiveProgressTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const weekDays = getCurrentWeekDays();

  // Today's quests
  const todayQuests = state.quests.slice(0, 6);
  const completedTodayQuests = todayQuests.filter(q => q.isCompleted);
  const questCompletionPct = todayQuests.length > 0 
    ? Math.round((completedTodayQuests.length / todayQuests.length) * 100) 
    : 0;

  // Habits stats
  const totalHabitCompletions = state.habitCompletions.length;
  const perfectDays = state.profile.perfectDaysCount ?? 0;
  const activeHabitDays = new Set(state.habitCompletions.map(h => h.dateStr)).size;
  const avgHabitsPerDay = activeHabitDays > 0 
    ? Math.round(totalHabitCompletions / activeHabitDays) 
    : 0;

  // Icon mapping for quest categories
  const getQuestIcon = (quest: Quest) => {
    switch (quest.category) {
      case 'fitness':
        return <Dumbbell size={16} className="text-[#F6B8A8]" />;
      case 'health':
        return <Droplet size={16} className="text-[#A7B89A]" />;
      case 'study':
        return <Book size={16} className="text-[#F5E6A8]" />;
      case 'productivity':
        return <Target size={16} className="text-[#DCE8D2]" />;
      default:
        return <Sparkles size={16} className="text-[#F3A6B7]" />;
    }
  };

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Top Welcome & Level Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A7B89A] to-[#FFF5E8] p-1 flex items-center justify-center shadow-md shrink-0">
            <PandaMascot pose="waving" size={48} animated />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight">
                Hello, {state.profile.username || 'Adventurer'}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6A8] text-[#29452B] text-xs font-black">
                Level {levelInfo.level}
              </span>
            </div>
            <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
              Ready to grow a little today? Every small step counts.
            </p>
          </div>
        </div>

        {/* Level Progress Indicator */}
        <div className="sm:text-right min-w-[200px]">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-[#DCE8D2] mb-1">
            <span>{levelInfo.title}</span>
            <span className="text-[#F5E6A8]">{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#A7B89A] via-[#F5E6A8] to-[#F6B8A8] rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-[#A7B89A] mt-1">
            {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP to Level {levelInfo.level + 1}
          </p>
        </div>
      </div>

      {/* Main Grid: Exact 4-Card Layout from the Reference Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Today's TODOs / Quests */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#FFF5E8] tracking-tight">
                  Today&apos;s TODOs
                </h3>
                <p className="text-[11px] text-[#A7B89A]">Daily quests &amp; progression goals</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingQuest(null);
                    setIsAddQuestOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#F6B8A8] hover:bg-[#F3A6B7] active:scale-95 text-[#29452B] font-extrabold text-xs flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  title="Add Quest"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Add Quest</span>
                </button>
                <button
                  onClick={() => onNavigateTab('quests')}
                  className="text-xs text-[#DCE8D2] hover:text-[#FFF5E8] font-bold flex items-center gap-1 group transition-colors"
                >
                  see all
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Quests List */}
            <div className="space-y-2.5">
              {todayQuests.map(quest => {
                const isDone = quest.isCompleted;

                return (
                  <div
                    key={quest.id}
                    className={`group flex items-center justify-between p-3 rounded-2xl transition-all border ${
                      isDone
                        ? 'bg-white/5 border-white/10 opacity-80'
                        : 'bg-white/15 hover:bg-white/20 border-white/20 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Category Icon */}
                      <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                        {getQuestIcon(quest)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold truncate ${
                              isDone ? 'line-through text-[#DCE8D2]/60' : 'text-[#FFF5E8]'
                            }`}
                          >
                            {quest.title}
                          </span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#F5E6A8]/20 text-[#F5E6A8] shrink-0">
                            +{quest.xpReward} XP
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#A7B89A] mt-0.5">
                          <span>{quest.duration || 'Daily'}</span>
                          <span>•</span>
                          <span className="capitalize">{quest.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Edit, Delete, Undo, Complete */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => {
                          setEditingQuest(quest);
                          setIsAddQuestOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/20 hover:bg-white/20 text-[#DCE8D2] hover:text-white transition-all cursor-pointer"
                        title="Edit Quest"
                      >
                        <Edit2 size={12} />
                      </button>

                      <button
                        onClick={() => {
                          deleteQuest(quest.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/20 hover:bg-red-500/30 text-red-300 hover:text-red-100 transition-all cursor-pointer"
                        title="Delete Quest"
                      >
                        <Trash2 size={12} />
                      </button>

                      {isDone && (
                        <button
                          onClick={() => reverseQuestCompletion(quest.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-[#DCE8D2] transition-all cursor-pointer"
                          title="Undo / Reverse completion"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (isDone) {
                            reverseQuestCompletion(quest.id);
                          } else {
                            completeQuest(quest.id);
                          }
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-[#74865B] text-white shadow-sm'
                            : 'border-2 border-white/30 hover:border-[#F6B8A8] bg-transparent'
                        }`}
                        aria-label={isDone ? 'Mark quest incomplete' : 'Complete quest'}
                      >
                        {isDone && <Check size={14} strokeWidth={3} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A7B89A]">
            <span>{completedTodayQuests.length} of {todayQuests.length} completed</span>
            <span className="font-bold text-[#DCE8D2]">{questCompletionPct}% of daily goals</span>
          </div>
        </div>

        {/* CARD 2: Weekly Activity & Habit Calendar Matrix */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header with Tabs */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-extrabold text-[#FFF5E8] tracking-tight">
                  Habit Matrix
                </h3>
                <button
                  onClick={() => setIsAddHabitOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-[#F6B8A8] hover:bg-[#F3A6B7] active:scale-95 text-[#29452B] font-extrabold text-xs flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  title="Add Habit"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Add Habit</span>
                </button>
              </div>

              {/* Weekly / Monthly / Yearly tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/20 text-[11px] font-bold">
                {(['weekly', 'monthly', 'yearly'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveHabitTab(tab)}
                    className={`px-2.5 py-0.5 rounded-lg capitalize transition-colors ${
                      activeHabitTab === tab
                        ? 'bg-[#74865B] text-white shadow-xs'
                        : 'text-[#DCE8D2]/70 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Date range subtitle */}
            <div className="flex items-center justify-between text-[11px] text-[#A7B89A] mb-3 px-1">
              <span>{weekDays[0]?.dateStr} — {weekDays[6]?.dateStr}</span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2 text-[11px] font-semibold text-[#A7B89A] w-40">Habit</th>
                    {weekDays.map(d => (
                      <th
                        key={d.dateStr}
                        className={`pb-2 text-center text-[11px] font-black w-7 ${
                          d.isToday ? 'text-[#F5E6A8]' : 'text-[#DCE8D2]'
                        }`}
                      >
                        {d.dayShort}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {state.habits.slice(0, 6).map(habit => {
                    return (
                      <tr key={habit.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="flex items-center justify-between gap-1 max-w-[150px]">
                            <span className="text-xs font-semibold text-[#FFF5E8] truncate">
                              {habit.title}
                            </span>
                            <button
                              onClick={() => {
                                deleteHabit(habit.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-red-300 hover:text-red-100 transition-opacity shrink-0 cursor-pointer"
                              title="Delete habit"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>

                        {weekDays.map(d => {
                          const isDone = Boolean(habit.history[d.dateStr]);
                          const isToday = d.isToday;

                          return (
                            <td key={d.dateStr} className="py-2.5 text-center">
                              {isToday ? (
                                <button
                                  onClick={() => toggleHabitToday(habit.id)}
                                  className={`w-5 h-5 rounded-md mx-auto transition-all flex items-center justify-center cursor-pointer ${
                                    isDone
                                      ? 'bg-[#A7B89A] text-[#1E3320] shadow-sm hover:scale-110'
                                      : 'border border-dashed border-[#F5E6A8] bg-black/20 hover:border-white'
                                  }`}
                                  title={`Toggle for today (${d.dateStr})`}
                                >
                                  {isDone && <Check size={12} strokeWidth={3} />}
                                </button>
                              ) : (
                                <div
                                  className={`w-5 h-5 rounded-md mx-auto flex items-center justify-center ${
                                    isDone
                                      ? 'bg-[#74865B] text-white/90 shadow-xs'
                                      : d.isPast
                                      ? 'bg-black/25 text-transparent'
                                      : 'border border-white/10 bg-transparent'
                                  }`}
                                >
                                  {isDone && <Check size={11} strokeWidth={2.5} />}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-[#A7B89A] flex items-center justify-between">
            <span>Tip: Click today&apos;s highlighted column to check off habits!</span>
            <button
              onClick={() => onNavigateTab('habits')}
              className="text-xs font-bold text-[#DCE8D2] hover:text-white"
            >
              manage habits →
            </button>
          </div>
        </div>

        {/* CARD 3: Consistency & Progress Summary */}
        <div className="relative rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#FFF5E8] tracking-tight">
                Daily Progress
              </h3>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/20 text-[11px] font-bold">
                {(['weekly', 'monthly', 'yearly'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveProgressTab(tab)}
                    className={`px-2 py-0.5 rounded-lg capitalize transition-colors ${
                      activeProgressTab === tab
                        ? 'bg-[#74865B] text-white'
                        : 'text-[#DCE8D2]/70 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Circular Progress & Key Metrics */}
            <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
              {/* Circular Ring SVG */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#A7B89A"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * questCompletionPct) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-[#FFF5E8]">{questCompletionPct}%</span>
                  <span className="text-[9px] font-bold text-[#A7B89A] uppercase tracking-wider">done</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <div className="flex items-center gap-1.5 text-[#F6B8A8] mb-0.5">
                    <Flame size={14} className="fill-[#F6B8A8]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Current Streak</span>
                  </div>
                  <div className="text-xl font-black text-[#FFF5E8]">
                    {currentStreak} <span className="text-xs font-semibold text-[#A7B89A]">days</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <div className="flex items-center gap-1.5 text-[#F5E6A8] mb-0.5">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Perfect Days</span>
                  </div>
                  <div className="text-xl font-black text-[#FFF5E8]">
                    {perfectDays}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B89A] block mb-0.5">
                    Habits Done
                  </span>
                  <div className="text-xl font-black text-[#FFF5E8]">
                    {totalHabitCompletions}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B89A] block mb-0.5">
                    Daily Average
                  </span>
                  <div className="text-xl font-black text-[#FFF5E8]">
                    {avgHabitsPerDay} <span className="text-xs font-semibold text-[#A7B89A]">habits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panda peeking at the bottom edge */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#A7B89A]">Keep it going! You are doing amazing.</span>
            <div className="-mb-2 mr-2">
              <PandaMascot pose="peeking" size={48} animated />
            </div>
          </div>
        </div>

        {/* CARD 4: Rewards & Badges */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#FFF5E8] tracking-tight">
                  Rewards
                </h3>
                <p className="text-[11px] text-[#A7B89A]">Unlocked achievements &amp; milestones</p>
              </div>
              <button
                onClick={() => onNavigateTab('rewards')}
                className="text-xs text-[#DCE8D2] hover:text-[#FFF5E8] font-bold flex items-center gap-1 group transition-colors"
              >
                see all
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-2 text-center">
              {state.achievements.slice(0, 5).map(ach => (
                <div
                  key={ach.id}
                  onClick={() => onNavigateTab('rewards')}
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <PandaBadge
                    code={ach.badgeCode}
                    size={54}
                    unlocked={ach.unlocked}
                    className="group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[11px] font-bold text-[#FFF5E8] mt-1.5 truncate max-w-[80px] block">
                    {ach.title}
                  </span>
                  <span className="text-[9px] font-semibold text-[#A7B89A]">
                    {ach.unlocked ? 'Unlocked' : `${ach.progress}/${ach.maxProgress}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A7B89A]">
            <span>{state.achievements.filter(a => a.unlocked).length} badges unlocked</span>
            <button
              onClick={() => onNavigateTab('rewards')}
              className="text-xs font-bold text-[#DCE8D2] hover:text-white"
            >
              view trophy hall →
            </button>
          </div>
        </div>

      </div>

      {/* Character RPG Attributes Mini Bar */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#F3A6B7]" />
            <h3 className="text-sm font-extrabold text-[#FFF5E8]">
              Character Attributes Progression
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('character')}
            className="text-xs font-bold text-[#DCE8D2] hover:text-white"
          >
            view hero sheet →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.values(state.attributes).map(attr => {
            const pct = Math.min(100, Math.round((attr.currentXp / attr.xpToNextLevel) * 100));

            return (
              <div key={attr.type} className="p-3 rounded-2xl bg-white/10 border border-white/10">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-[#FFF5E8]">{attr.name}</span>
                  <span className="text-[#F5E6A8]">Lv.{attr.level}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A7B89A] to-[#F5E6A8] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#A7B89A] mt-1">
                  <span>{attr.currentXp} XP</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
