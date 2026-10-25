import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Clock, Calendar, BookOpen, Dumbbell, Heart, Briefcase, Palette, Compass, Users, Target } from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';
import type { QuestCategory, QuestDifficulty, CharacterAttributeType } from '../../types';
import { getLocalDateString } from '../../utils/dates';

const CATEGORIES: { id: QuestCategory; label: string; icon: React.ReactNode; attr: CharacterAttributeType; skillId: string }[] = [
  { id: 'study', label: 'Study', icon: <BookOpen size={14} />, attr: 'intelligence', skillId: 'skill-academic' },
  { id: 'fitness', label: 'Fitness', icon: <Dumbbell size={14} />, attr: 'strength', skillId: 'skill-fitness' },
  { id: 'health', label: 'Health', icon: <Heart size={14} />, attr: 'vitality', skillId: 'skill-mental' },
  { id: 'productivity', label: 'Productivity', icon: <Target size={14} />, attr: 'discipline', skillId: 'skill-productivity' },
  { id: 'creativity', label: 'Creativity', icon: <Palette size={14} />, attr: 'discipline', skillId: 'skill-creativity' },
  { id: 'growth', label: 'Personal Growth', icon: <Compass size={14} />, attr: 'vitality', skillId: 'skill-mental' },
  { id: 'career', label: 'Career', icon: <Briefcase size={14} />, attr: 'intelligence', skillId: 'skill-programming' },
  { id: 'social', label: 'Social', icon: <Users size={14} />, attr: 'charisma', skillId: 'skill-communication' },
];

const DIFFICULTIES: { id: QuestDifficulty; label: string; defaultXp: number; color: string }[] = [
  { id: 'easy', label: 'Easy', defaultXp: 15, color: 'bg-[#DCE8D2] text-[#29452B]' },
  { id: 'medium', label: 'Medium', defaultXp: 35, color: 'bg-[#F5E6A8] text-[#29452B]' },
  { id: 'hard', label: 'Hard', defaultXp: 75, color: 'bg-[#F6B8A8] text-[#29452B]' },
  { id: 'epic', label: 'Epic', defaultXp: 150, color: 'bg-[#F3A6B7] text-[#29452B]' },
];

export const QuestModal: React.FC = () => {
  const { isAddQuestOpen, setIsAddQuestOpen, editingQuest, setEditingQuest, createQuest, updateQuest } = useLevelora();

  const isOpen = isAddQuestOpen || editingQuest !== null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('study');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('easy');
  const [xpReward, setXpReward] = useState<number>(15);
  const [duration, setDuration] = useState('30 min');
  const [deadline, setDeadline] = useState(getLocalDateString());
  const [isDaily, setIsDaily] = useState(true);
  const [error, setError] = useState('');

  // Sync state when editing or opening
  useEffect(() => {
    if (editingQuest) {
      setTitle(editingQuest.title);
      setDescription(editingQuest.description);
      setCategory(editingQuest.category);
      setDifficulty(editingQuest.difficulty);
      setXpReward(editingQuest.xpReward);
      setDuration(editingQuest.duration || '30 min');
      setDeadline(editingQuest.deadline || getLocalDateString());
      setIsDaily(Boolean(editingQuest.isDaily));
    } else {
      setTitle('');
      setDescription('');
      setCategory('study');
      setDifficulty('easy');
      setXpReward(15);
      setDuration('30 min');
      setDeadline(getLocalDateString());
      setIsDaily(true);
    }
    setError('');
  }, [editingQuest, isAddQuestOpen]);

  if (!isOpen) return null;

  const handleDifficultyChange = (diff: QuestDifficulty) => {
    setDifficulty(diff);
    const found = DIFFICULTIES.find(d => d.id === diff);
    if (found) {
      setXpReward(found.defaultXp);
    }
  };

  const handleClose = () => {
    setIsAddQuestOpen(false);
    setEditingQuest(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a quest title.');
      return;
    }
    if (xpReward <= 0 || isNaN(xpReward)) {
      setError('XP reward must be greater than 0.');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === category);

    if (editingQuest) {
      updateQuest(editingQuest.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        xpReward: Number(xpReward),
        duration,
        deadline,
        isDaily,
        associatedAttribute: catObj ? catObj.attr : 'intelligence',
        associatedSkillId: catObj ? catObj.skillId : 'skill-academic',
      });
    } else {
      createQuest({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        xpReward: Number(xpReward),
        duration,
        deadline,
        isDaily,
        associatedAttribute: catObj ? catObj.attr : 'intelligence',
        associatedSkillId: catObj ? catObj.skillId : 'skill-academic',
      });
    }

    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#FFF5E8] to-[#FFF0E0] p-6 shadow-2xl border-2 border-[#A7B89A]/50 text-[#29452B]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#A7B89A]/30">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#A7B89A]/30 text-[#29452B]">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#29452B]">
                  {editingQuest ? 'Edit Quest' : 'Create New Quest'}
                </h3>
                <p className="text-xs text-[#687463]">Turn your real-world goal into an RPG achievement</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-black/10 text-[#687463] hover:text-[#29452B] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1">Quest Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Read 20 pages, Complete 30min run, Practice code"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#74865B] shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1">Description (Optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Why is this meaningful? Any special conditions?"
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#74865B] shadow-inner resize-none"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1.5">Quest Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(c => {
                  const isSelected = category === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-[#A7B89A] text-[#FFF5E8] border-[#74865B] shadow-sm'
                          : 'bg-white/60 hover:bg-white text-[#29452B] border-transparent'
                      }`}
                    >
                      {c.icon}
                      <span className="truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & XP Reward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#29452B] mb-1.5">Difficulty</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {DIFFICULTIES.map(d => {
                    const isSelected = difficulty === d.id;
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => handleDifficultyChange(d.id)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? `${d.color} border-[#74865B] shadow-sm ring-1 ring-[#74865B]`
                            : 'bg-white/50 text-[#687463] border-transparent hover:bg-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#29452B] mb-1.5">XP Reward</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={xpReward}
                    onChange={e => setXpReward(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-sm font-bold text-[#29452B] focus:outline-none focus:ring-2 focus:ring-[#74865B]"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-[#74865B]">XP</span>
                </div>
              </div>
            </div>

            {/* Duration & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-[#29452B] mb-1">
                  <Clock size={12} /> Duration / Frequency
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g. 25 min, Daily"
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#74865B]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-[#29452B] mb-1">
                  <Calendar size={12} /> Target Date
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#74865B]"
                />
              </div>
            </div>

            {/* Daily recurring checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDailyCheck"
                checked={isDaily}
                onChange={e => setIsDaily(e.target.checked)}
                className="w-4 h-4 rounded text-[#74865B] focus:ring-[#74865B]"
              />
              <label htmlFor="isDailyCheck" className="text-xs font-semibold text-[#29452B] cursor-pointer">
                Show in Daily "Today's Quests"
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#A7B89A]/30">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-full hover:bg-black/5 text-[#687463] text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 text-[#29452B] font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Check size={14} />
                {editingQuest ? 'Save Changes' : 'Embark on Quest'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
