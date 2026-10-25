import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Check, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar, 
  BookOpen, 
  Dumbbell, 
  Heart, 
  Briefcase, 
  Palette, 
  Compass, 
  Users, 
  Target,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import type { Quest, QuestCategory, QuestDifficulty } from '../types';
import { formatDateDisplay } from '../utils/dates';
import { PandaMascot } from '../components/common/PandaMascot';

export const Quests: React.FC = () => {
  const { 
    state, 
    completeQuest, 
    reverseQuestCompletion, 
    deleteQuest, 
    setIsAddQuestOpen, 
    setEditingQuest 
  } = useLevelora();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'xp' | 'deadline' | 'title'>('xp');

  // Deletion Confirmation State
  const [questToDelete, setQuestToDelete] = useState<Quest | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'study', label: 'Study' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'health', label: 'Health' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'creativity', label: 'Creativity' },
    { id: 'growth', label: 'Growth' },
    { id: 'social', label: 'Social' },
    { id: 'career', label: 'Career' },
  ];

  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case 'study': return <BookOpen size={15} />;
      case 'fitness': return <Dumbbell size={15} />;
      case 'health': return <Heart size={15} />;
      case 'career': return <Briefcase size={15} />;
      case 'creativity': return <Palette size={15} />;
      case 'growth': return <Compass size={15} />;
      case 'social': return <Users size={15} />;
      case 'productivity': return <Target size={15} />;
      default: return <Sparkles size={15} />;
    }
  };

  const getDifficultyBadge = (difficulty: QuestDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded-md bg-[#DCE8D2] text-[#29452B] font-extrabold text-[10px]">Easy</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md bg-[#F5E6A8] text-[#29452B] font-extrabold text-[10px]">Medium</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded-md bg-[#F6B8A8] text-[#29452B] font-extrabold text-[10px]">Hard</span>;
      case 'epic':
        return <span className="px-2 py-0.5 rounded-md bg-[#F3A6B7] text-[#29452B] font-extrabold text-[10px]">Epic</span>;
    }
  };

  const filteredQuests = useMemo(() => {
    return state.quests
      .filter(q => {
        // Search filter
        if (search) {
          const s = search.toLowerCase();
          const matchTitle = q.title.toLowerCase().includes(s);
          const matchDesc = q.description.toLowerCase().includes(s);
          if (!matchTitle && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && q.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
          return false;
        }

        // Status filter
        if (statusFilter === 'active' && q.isCompleted) return false;
        if (statusFilter === 'completed' && !q.isCompleted) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'xp') {
          return b.xpReward - a.xpReward;
        }
        if (sortBy === 'deadline') {
          const d1 = a.deadline || '9999-99-99';
          const d2 = b.deadline || '9999-99-99';
          return d1.localeCompare(d2);
        }
        return a.title.localeCompare(b.title);
      });
  }, [state.quests, search, selectedCategory, selectedDifficulty, statusFilter, sortBy]);

  const confirmDelete = () => {
    if (questToDelete) {
      deleteQuest(questToDelete.id);
      setQuestToDelete(null);
    }
  };

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight flex items-center gap-2">
            Quest Board
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#A7B89A]/30 text-[#FFF5E8]">
              {state.quests.length} Total
            </span>
          </h1>
          <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
            Take on real-life missions to gain XP, enhance your attributes, and level up.
          </p>
        </div>

        <button
          onClick={() => setIsAddQuestOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-[#29452B] font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Quest</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-[#A7B89A]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search quests by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/20 border border-white/10 text-xs placeholder-[#DCE8D2]/60 text-white focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/20 text-xs font-bold shrink-0">
            {(['all', 'active', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#74865B] text-white shadow-xs'
                    : 'text-[#DCE8D2]/70 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'xp' | 'deadline' | 'title')}
            className="px-3 py-2 rounded-2xl bg-black/20 border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="xp" className="bg-[#29452B]">Sort by XP Reward</option>
            <option value="deadline" className="bg-[#29452B]">Sort by Deadline</option>
            <option value="title" className="bg-[#29452B]">Sort by Title</option>
          </select>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#A7B89A] text-[#1E3320] font-bold shadow-xs'
                    : 'bg-white/10 hover:bg-white/15 text-[#DCE8D2]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quests Grid */}
      {filteredQuests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center">
          <PandaMascot pose="scholar" size={72} animated />
          <h3 className="text-base font-bold text-[#FFF5E8] mt-3">No quests match your criteria</h3>
          <p className="text-xs text-[#DCE8D2] mt-1 max-w-sm">
            Try resetting your search filters or click &ldquo;New Quest&rdquo; to embark on fresh life goals!
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold text-[#FFF5E8] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map(quest => {
            const isDone = quest.isCompleted;

            return (
              <div
                key={quest.id}
                className={`relative flex flex-col justify-between p-4 rounded-3xl transition-all border ${
                  isDone
                    ? 'bg-white/5 border-white/10 opacity-80'
                    : 'bg-white/15 hover:bg-white/20 border-white/20 shadow-sm'
                }`}
              >
                <div>
                  {/* Top line: Category & Difficulty */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#A7B89A]">
                      <span className="p-1 rounded-lg bg-black/20 text-[#DCE8D2]">
                        {getCategoryIcon(quest.category)}
                      </span>
                      <span className="font-bold capitalize">{quest.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {getDifficultyBadge(quest.difficulty)}
                      <span className="px-2 py-0.5 rounded-md bg-[#F5E6A8] text-[#29452B] font-extrabold text-[11px]">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-sm font-extrabold mt-1 ${
                      isDone ? 'line-through text-[#DCE8D2]/60' : 'text-[#FFF5E8]'
                    }`}
                  >
                    {quest.title}
                  </h3>

                  {quest.description && (
                    <p className="text-xs text-[#DCE8D2]/80 mt-1 line-clamp-2 leading-relaxed">
                      {quest.description}
                    </p>
                  )}

                  {/* Metadata: Duration & Deadline */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A7B89A] mt-3 pt-2 border-t border-white/10">
                    {quest.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {quest.duration}
                      </span>
                    )}
                    {quest.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDateDisplay(quest.deadline)}
                      </span>
                    )}
                    <span className="text-[#F5E6A8] font-semibold capitalize">
                      Boosts {quest.associatedAttribute}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingQuest(quest)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#DCE8D2] transition-colors"
                      title="Edit quest"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setQuestToDelete(quest)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-[#DCE8D2] hover:text-red-300 transition-colors"
                      title="Delete quest"
                    >
                      <Trash2 size={14} />
                    </button>
                    {isDone && (
                      <button
                        onClick={() => reverseQuestCompletion(quest.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-[#DCE8D2] transition-colors"
                        title="Revert completion"
                      >
                        <RotateCcw size={12} /> Undo
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (isDone) {
                        reverseQuestCompletion(quest.id);
                      } else {
                        completeQuest(quest.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      isDone
                        ? 'bg-[#74865B] text-white shadow-xs'
                        : 'bg-gradient-to-r from-[#A7B89A] to-[#DCE8D2] text-[#29452B] shadow-sm hover:brightness-105'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check size={14} strokeWidth={3} /> Completed
                      </>
                    ) : (
                      <>Complete &amp; Earn</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {questToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#FFF5E8] p-6 text-center text-[#29452B] shadow-2xl border-2 border-red-300">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-extrabold">Delete this quest?</h3>
            <p className="text-xs text-[#687463] mt-1">
              Are you sure you want to remove &ldquo;{questToDelete.title}&rdquo;? This cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setQuestToDelete(null)}
                className="px-4 py-2 rounded-full hover:bg-black/10 text-xs font-bold text-[#687463] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
