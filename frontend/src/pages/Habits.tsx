import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Flame, 
  Droplet, 
  Book, 
  Dumbbell, 
  Moon, 
  Heart, 
  Target, 
  Smile, 
  Trash2, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { getCurrentWeekDays, getLocalDateString } from '../utils/dates';
import type { Habit } from '../types';

export const Habits: React.FC = () => {
  const { state, toggleHabitToday, deleteHabit, setIsAddHabitOpen } = useLevelora();
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const weekDays = getCurrentWeekDays();
  const todayStr = getLocalDateString();

  const getHabitIcon = (icon: string) => {
    switch (icon) {
      case 'droplet': return <Droplet size={18} className="text-[#A7B89A]" />;
      case 'book': return <Book size={18} className="text-[#F5E6A8]" />;
      case 'dumbbell': return <Dumbbell size={18} className="text-[#F6B8A8]" />;
      case 'moon': return <Moon size={18} className="text-[#F3A6B7]" />;
      case 'heart': return <Heart size={18} className="text-[#F6B8A8]" />;
      case 'target': return <Target size={18} className="text-[#DCE8D2]" />;
      default: return <Smile size={18} className="text-[#A7B89A]" />;
    }
  };

  const calculateHabitStreak = (habit: Habit): number => {
    let streak = 0;
    const d = new Date();
    // If not done today, start checking from yesterday
    if (!habit.history[todayStr]) {
      d.setDate(d.getDate() - 1);
    }
    while (true) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      if (habit.history[key]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  };

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight flex items-center gap-2">
            My Daily Habits
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#A7B89A]/30 text-[#FFF5E8]">
              {state.habits.length} Habits
            </span>
          </h1>
          <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
            &ldquo;We become what we repeatedly do.&rdquo; Build streaks and level up your discipline.
          </p>
        </div>

        <button
          onClick={() => setIsAddHabitOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-[#29452B] font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Week Calendar Overview Bar */}
      <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#A7B89A] mb-3 px-1">
          <span className="flex items-center gap-1.5 font-bold text-[#DCE8D2]">
            <Calendar size={14} /> Current Week Rhythm
          </span>
          <span>{weekDays[0]?.dateStr} to {weekDays[6]?.dateStr}</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map(d => {
            // Count how many habits were done this day
            const doneCount = state.habits.filter(h => Boolean(h.history[d.dateStr])).length;
            const allCount = state.habits.length;
            const pct = allCount > 0 ? Math.round((doneCount / allCount) * 100) : 0;

            return (
              <div
                key={d.dateStr}
                className={`p-2.5 rounded-2xl border transition-all ${
                  d.isToday
                    ? 'bg-white/20 border-[#F5E6A8] shadow-sm'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`text-xs font-black ${d.isToday ? 'text-[#F5E6A8]' : 'text-[#DCE8D2]'}`}>
                  {d.dayShort}
                </div>
                <div className="text-[10px] text-[#A7B89A] mb-1.5">{d.dayNumber}</div>
                <div className="w-full h-1.5 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A7B89A] to-[#F6B8A8] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[9px] font-bold text-[#DCE8D2] mt-1">
                  {doneCount}/{allCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.habits.map(habit => {
          const isDoneToday = Boolean(habit.history[todayStr]);
          const streak = calculateHabitStreak(habit);

          return (
            <div
              key={habit.id}
              className={`p-5 rounded-3xl backdrop-blur-md border transition-all flex flex-col justify-between ${
                isDoneToday
                  ? 'bg-white/15 border-[#A7B89A]/50 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 border-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center shrink-0">
                      {getHabitIcon(habit.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#FFF5E8]">{habit.title}</h3>
                      {habit.description && (
                        <p className="text-[11px] text-[#DCE8D2]/80 mt-0.5">{habit.description}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setHabitToDelete(habit)}
                    className="p-1.5 rounded-xl hover:bg-red-500/20 text-[#A7B89A] hover:text-red-300 transition-colors"
                    title="Delete habit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 7 Day Matrix Row */}
                <div className="bg-black/20 rounded-2xl p-2.5 my-3 flex items-center justify-between gap-1">
                  {weekDays.map(d => {
                    const done = Boolean(habit.history[d.dateStr]);
                    return (
                      <div key={d.dateStr} className="flex-1 text-center">
                        <div className="text-[9px] text-[#A7B89A] mb-1 font-semibold">{d.dayShort}</div>
                        <div
                          className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all ${
                            done
                              ? 'bg-[#A7B89A] text-[#1E3320] shadow-xs font-bold'
                              : d.isToday
                              ? 'border border-dashed border-[#F5E6A8] text-transparent'
                              : 'bg-white/5 text-transparent'
                          }`}
                        >
                          {done && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-black text-[#F6B8A8]">
                    <Flame size={14} className="fill-[#F6B8A8]" />
                    <span>{streak} day streak</span>
                  </div>
                  <span className="text-[10px] text-[#A7B89A] font-semibold">
                    +{habit.xpReward} XP/day
                  </span>
                </div>

                <button
                  onClick={() => toggleHabitToday(habit.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all active:scale-95 cursor-pointer ${
                    isDoneToday
                      ? 'bg-[#74865B] text-white shadow-xs'
                      : 'bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] text-[#29452B] shadow-sm hover:brightness-105'
                  }`}
                >
                  {isDoneToday ? (
                    <>
                      <Check size={14} strokeWidth={3} /> Done Today
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> Check for Today
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Habit Confirmation */}
      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#FFF5E8] p-6 text-center text-[#29452B] shadow-2xl border-2 border-red-300">
            <h3 className="text-base font-extrabold">Remove habit?</h3>
            <p className="text-xs text-[#687463] mt-1">
              Delete &ldquo;{habitToDelete.title}&rdquo;? Your previous completion history will be removed.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setHabitToDelete(null)}
                className="px-4 py-2 rounded-full hover:bg-black/10 text-xs font-bold text-[#687463] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
