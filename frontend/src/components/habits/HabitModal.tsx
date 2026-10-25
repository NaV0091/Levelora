import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Droplet, Book, Dumbbell, Moon, Heart, Target, Smile } from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';
import type { CharacterAttributeType } from '../../types';

const ICONS = [
  { id: 'droplet', label: 'Hydration', icon: <Droplet size={16} /> },
  { id: 'book', label: 'Reading', icon: <Book size={16} /> },
  { id: 'dumbbell', label: 'Exercise', icon: <Dumbbell size={16} /> },
  { id: 'moon', label: 'Sleep', icon: <Moon size={16} /> },
  { id: 'heart', label: 'Wellness', icon: <Heart size={16} /> },
  { id: 'target', label: 'Focus', icon: <Target size={16} /> },
  { id: 'smile', label: 'Gratitude', icon: <Smile size={16} /> },
];

const ATTRIBUTES: { id: CharacterAttributeType; label: string }[] = [
  { id: 'discipline', label: 'Discipline' },
  { id: 'vitality', label: 'Vitality' },
  { id: 'strength', label: 'Strength' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'charisma', label: 'Charisma' },
];

export const HabitModal: React.FC = () => {
  const { isAddHabitOpen, setIsAddHabitOpen, createHabit } = useLevelora();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('droplet');
  const [xpReward, setXpReward] = useState(15);
  const [attribute, setAttribute] = useState<CharacterAttributeType>('discipline');
  const [error, setError] = useState('');

  if (!isAddHabitOpen) return null;

  const handleClose = () => {
    setIsAddHabitOpen(false);
    setTitle('');
    setDescription('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a habit title.');
      return;
    }

    createHabit({
      title: title.trim(),
      description: description.trim(),
      icon,
      frequency: 'daily',
      xpReward: Number(xpReward) || 15,
      associatedAttribute: attribute,
    });

    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#FFF5E8] to-[#FFF0E0] p-6 shadow-2xl border-2 border-[#A7B89A]/50 text-[#29452B]"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#A7B89A]/30">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#F6B8A8]/30 text-[#29452B]">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#29452B]">Add New Habit</h3>
                <p className="text-xs text-[#687463]">Build small daily rituals for lasting growth</p>
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
            <div className="mt-3 p-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1">Habit Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Drink 2L water, Read 15 mins, No sugar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#74865B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief encouragement or reminder"
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#74865B]"
              />
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1.5">Habit Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(i => {
                  const isSelected = icon === i.id;
                  return (
                    <button
                      type="button"
                      key={i.id}
                      onClick={() => setIcon(i.id)}
                      className={`p-2.5 rounded-xl transition-all border flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#A7B89A] text-white border-[#74865B] shadow-sm'
                          : 'bg-white/60 text-[#29452B] border-transparent hover:bg-white'
                      }`}
                    >
                      {i.icon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Associated Attribute */}
            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1.5">Attribute Gained</label>
              <div className="grid grid-cols-3 gap-1.5">
                {ATTRIBUTES.map(attr => {
                  const isSelected = attribute === attr.id;
                  return (
                    <button
                      type="button"
                      key={attr.id}
                      onClick={() => setAttribute(attr.id)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-[#DCE8D2] border-[#74865B] text-[#29452B] shadow-sm'
                          : 'bg-white/50 text-[#687463] border-transparent hover:bg-white'
                      }`}
                    >
                      {attr.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* XP */}
            <div>
              <label className="block text-xs font-bold text-[#29452B] mb-1">Daily XP Reward</label>
              <input
                type="number"
                min="5"
                max="100"
                value={xpReward}
                onChange={e => setXpReward(parseInt(e.target.value) || 15)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#A7B89A]/40 text-sm font-bold text-[#29452B] focus:outline-none focus:ring-2 focus:ring-[#74865B]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#A7B89A]/30">
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
                <Check size={14} /> Add Habit
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
