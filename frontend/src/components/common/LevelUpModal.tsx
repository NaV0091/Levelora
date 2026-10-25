import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';
import { PandaMascot } from './PandaMascot';

export const LevelUpModal: React.FC = () => {
  const { celebrationLevel, closeLevelCelebration, levelInfo } = useLevelora();

  if (celebrationLevel === null) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFF5E8] to-[#FFF0E0] p-6 text-center shadow-2xl border-2 border-[#F6B8A8]"
        >
          {/* Ambient Sparkles */}
          <div className="absolute top-3 left-3 text-[#F6B8A8] animate-spin" style={{ animationDuration: '6s' }}>
            <Sparkles size={24} />
          </div>
          <div className="absolute top-4 right-4 text-[#A7B89A] animate-spin" style={{ animationDuration: '8s' }}>
            <Sparkles size={20} />
          </div>

          {/* Cheering Mascot */}
          <div className="flex justify-center -mt-2 mb-3">
            <PandaMascot pose="celebrating" size={110} animated />
          </div>

          {/* Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3A6B7]/25 text-[#29452B] text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy size={14} className="text-[#74865B]" /> Level Up Achieved!
          </div>

          <h2 className="text-3xl font-extrabold text-[#29452B] tracking-tight">
            Level {celebrationLevel}
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#74865B]">
            You have earned the title:
          </p>
          <div className="mt-1 text-xl font-black text-[#29452B] bg-[#A7B89A]/20 py-1.5 px-4 rounded-xl inline-block border border-[#A7B89A]/40">
            {levelInfo.title}
          </div>

          <p className="mt-3 text-xs text-[#687463] max-w-xs mx-auto leading-relaxed">
            Every step you took contributed to this milestone. Your life character is growing stronger, wiser, and more disciplined!
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={closeLevelCelebration}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] text-[#29452B] font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Continue Journey
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
