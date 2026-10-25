import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award } from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';
import { PandaBadge } from './PandaBadge';

export const AchievementModal: React.FC = () => {
  const { unlockedAchievement, closeAchievementModal } = useLevelora();

  if (!unlockedAchievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFF5E8] to-[#FFF0E0] p-6 text-center shadow-2xl border-2 border-[#A7B89A]"
        >
          <div className="absolute top-3 right-3 text-[#F6B8A8]">
            <Sparkles size={20} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A7B89A]/20 text-[#29452B] text-xs font-bold uppercase tracking-wider mb-4">
            <Award size={14} className="text-[#74865B]" /> Achievement Unlocked!
          </div>

          {/* Badge Display */}
          <div className="flex justify-center mb-3">
            <PandaBadge code={unlockedAchievement.badgeCode} size={90} unlocked />
          </div>

          <h3 className="text-xl font-bold text-[#29452B]">
            {unlockedAchievement.title}
          </h3>

          <p className="mt-1 text-xs text-[#687463] leading-relaxed px-4">
            {unlockedAchievement.description}
          </p>

          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5E6A8] text-[#29452B] text-xs font-extrabold shadow-sm">
            +{unlockedAchievement.xpReward} XP Reward
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={closeAchievementModal}
              className="px-6 py-2.5 rounded-full bg-[#A7B89A] hover:bg-[#74865B] text-[#FFF5E8] font-bold text-sm shadow transition-all active:scale-95 cursor-pointer"
            >
              Collect & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
