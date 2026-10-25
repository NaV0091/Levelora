import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Award, Sparkles, Info, X } from 'lucide-react';
import { useLevelora } from '../../context/LeveloraContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useLevelora();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF5E8]/95 backdrop-blur-md shadow-xl border border-[#A7B89A]/50 text-[#29452B]"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && (
                <div className="p-1 rounded-full bg-[#A7B89A]/30 text-[#29452B]">
                  <CheckCircle2 size={18} />
                </div>
              )}
              {toast.type === 'level-up' && (
                <div className="p-1 rounded-full bg-[#F6B8A8]/40 text-[#29452B]">
                  <Sparkles size={18} />
                </div>
              )}
              {toast.type === 'achievement' && (
                <div className="p-1 rounded-full bg-[#F5E6A8] text-[#29452B]">
                  <Award size={18} />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="p-1 rounded-full bg-[#DCE8D2] text-[#29452B]">
                  <Info size={18} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-[#29452B] truncate">{toast.title}</h4>
                {toast.xp && (
                  <span className="text-[11px] font-extrabold text-[#74865B] bg-[#DCE8D2] px-1.5 py-0.5 rounded-md shrink-0">
                    +{toast.xp} XP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#687463] mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#687463] hover:text-[#29452B] p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
