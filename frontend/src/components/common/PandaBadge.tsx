import React from 'react';

interface PandaBadgeProps {
  code: string;
  size?: number;
  unlocked?: boolean;
  className?: string;
}

export const PandaBadge: React.FC<PandaBadgeProps> = ({
  code,
  size = 54,
  unlocked = true,
  className = '',
}) => {
  const filter = unlocked ? '' : 'grayscale opacity-40';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl p-1.5 transition-all duration-300 ${filter} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Glow & Background */}
      <div className={`absolute inset-0 rounded-2xl ${unlocked ? 'bg-gradient-to-br from-[#FFF5E8]/40 via-[#F6B8A8]/30 to-[#A7B89A]/30 border border-white/40 shadow-sm' : 'bg-black/20 border border-white/10'}`} />

      {/* SVG Badge Graphics */}
      <svg
        width={size - 8}
        height={size - 8}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Shield / Medallion base */}
        <circle cx="40" cy="40" r="36" fill={unlocked ? '#FFF8F0' : '#4A5B47'} />
        <circle cx="40" cy="40" r="31" stroke={unlocked ? '#F5E6A8' : '#334231'} strokeWidth="3" fill="none" />

        {/* Badge specific artwork */}
        {code === 'starter' && (
          <g>
            {/* Sprout & baby panda */}
            <circle cx="28" cy="28" r="8" fill="#29452B" />
            <circle cx="52" cy="28" r="8" fill="#29452B" />
            <ellipse cx="40" cy="44" rx="20" ry="17" fill="#29452B" />
            <ellipse cx="40" cy="44" rx="17" ry="14" fill="#FFF8F0" />
            {/* Sprout on head */}
            <path d="M40 28 Q44 20 50 22 Q46 29 40 28 Z" fill="#74865B" />
            <path d="M40 28 Q36 20 30 22 Q34 29 40 28 Z" fill="#A7B89A" />
            {/* Eyes */}
            <circle cx="34" cy="42" r="2.5" fill="#29452B" />
            <circle cx="46" cy="42" r="2.5" fill="#29452B" />
            <path d="M38 48 Q40 51 42 48" stroke="#29452B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {code === 'week_hero' && (
          <g>
            {/* Star with panda crown */}
            <polygon points="40,16 46,28 60,30 50,40 53,54 40,47 27,54 30,40 20,30 34,28" fill="#F5E6A8" />
            <circle cx="40" cy="38" r="14" fill="#FFF8F0" stroke="#74865B" strokeWidth="2" />
            <circle cx="30" cy="28" r="5" fill="#29452B" />
            <circle cx="50" cy="28" r="5" fill="#29452B" />
            <circle cx="36" cy="37" r="2" fill="#29452B" />
            <circle cx="44" cy="37" r="2" fill="#29452B" />
            <path d="M38 42 Q40 45 42 42" stroke="#29452B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {code === 'month_master' && (
          <g>
            {/* Crescent moon & sleeping panda */}
            <path d="M35 18 C50 18 62 30 62 46 C62 58 54 68 42 70 C54 66 60 54 58 42 C56 30 46 22 35 18 Z" fill="#F5E6A8" />
            <circle cx="34" cy="46" r="16" fill="#FFF8F0" />
            <circle cx="24" cy="36" r="6" fill="#29452B" />
            <circle cx="44" cy="36" r="6" fill="#29452B" />
            <path d="M29 46 Q33 49 37 46" stroke="#29452B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="28" cy="50" r="3" fill="#F3A6B7" opacity="0.6" />
            <circle cx="40" cy="50" r="3" fill="#F3A6B7" opacity="0.6" />
          </g>
        )}

        {code === 'scholar' && (
          <g>
            {/* Book & glasses panda */}
            <circle cx="40" cy="38" r="18" fill="#FFF8F0" stroke="#A7B89A" strokeWidth="2" />
            <circle cx="27" cy="26" r="6" fill="#29452B" />
            <circle cx="53" cy="26" r="6" fill="#29452B" />
            {/* Spectacles */}
            <circle cx="34" cy="37" r="5" stroke="#74865B" strokeWidth="1.5" fill="none" />
            <circle cx="46" cy="37" r="5" stroke="#74865B" strokeWidth="1.5" fill="none" />
            <line x1="39" y1="37" x2="41" y2="37" stroke="#74865B" strokeWidth="1.5" />
            {/* Book below */}
            <rect x="26" y="52" width="28" height="12" rx="2" fill="#74865B" />
            <line x1="40" y1="52" x2="40" y2="64" stroke="#FFF8F0" strokeWidth="1.5" />
          </g>
        )}

        {code === 'zen' && (
          <g>
            {/* Lotus and meditating panda */}
            <ellipse cx="40" cy="62" rx="22" ry="7" fill="#A7B89A" opacity="0.8" />
            <circle cx="40" cy="40" r="17" fill="#FFF8F0" />
            <circle cx="28" cy="28" r="6" fill="#29452B" />
            <circle cx="52" cy="28" r="6" fill="#29452B" />
            <path d="M33 39 Q36 36 39 39" stroke="#29452B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M41 39 Q44 36 47 39" stroke="#29452B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="40" cy="20" r="3" fill="#F5E6A8" />
          </g>
        )}

        {code === 'level_five' && (
          <g>
            <polygon points="40,15 47,27 61,29 51,39 54,53 40,46 26,53 29,39 19,29 33,27" fill="#F6B8A8" />
            <circle cx="40" cy="40" r="15" fill="#FFF8F0" stroke="#F3A6B7" strokeWidth="2" />
            <text x="40" y="47" textAnchor="middle" fill="#29452B" fontSize="18" fontWeight="bold" fontFamily="sans-serif">5</text>
          </g>
        )}

        {code === 'collector' && (
          <g>
            <rect x="22" y="24" width="36" height="34" rx="6" fill="#A7B89A" />
            <circle cx="40" cy="38" r="12" fill="#FFF8F0" />
            <circle cx="32" cy="30" r="4" fill="#29452B" />
            <circle cx="48" cy="30" r="4" fill="#29452B" />
            <circle cx="36" cy="37" r="1.8" fill="#29452B" />
            <circle cx="44" cy="37" r="1.8" fill="#29452B" />
            <polygon points="40,44 42,48 46,49 43,52 44,56 40,54 36,56 37,52 34,49 38,48" fill="#F5E6A8" />
          </g>
        )}

        {code === 'getting_started' && (
          <g>
            <circle cx="40" cy="40" r="22" fill="#DCE8D2" />
            <circle cx="40" cy="38" r="16" fill="#FFF8F0" stroke="#74865B" strokeWidth="2" />
            <circle cx="28" cy="26" r="5" fill="#29452B" />
            <circle cx="52" cy="26" r="5" fill="#29452B" />
            <circle cx="35" cy="36" r="2" fill="#29452B" />
            <circle cx="45" cy="36" r="2" fill="#29452B" />
            <path d="M37 42 Q40 45 43 42" stroke="#29452B" strokeWidth="1.5" strokeLinecap="round" />
            <text x="40" y="58" textAnchor="middle" fill="#29452B" fontSize="11" fontWeight="bold" fontFamily="sans-serif">10x</text>
          </g>
        )}
      </svg>
    </div>
  );
};
