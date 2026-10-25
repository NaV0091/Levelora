import React from 'react';

export type PandaPose = 
  | 'bamboo' 
  | 'peeking' 
  | 'celebrating' 
  | 'waving' 
  | 'meditating' 
  | 'scholar' 
  | 'workout' 
  | 'sleeping';

interface PandaMascotProps {
  pose?: PandaPose;
  size?: number | string;
  className?: string;
  animated?: boolean;
}

export const PandaMascot: React.FC<PandaMascotProps> = ({
  pose = 'bamboo',
  size = 64,
  className = '',
  animated = false,
}) => {
  const animClass = animated ? 'animate-cozy-float' : '';

  // 1. Bamboo pose - sitting cute, holding bamboo stick
  if (pose === 'bamboo') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        {/* Soft shadow */}
        <ellipse cx="60" cy="110" rx="36" ry="6" fill="#1C301D" opacity="0.18" />

        {/* Back Ears */}
        <circle cx="34" cy="36" r="14" fill="#29452B" />
        <circle cx="34" cy="36" r="8" fill="#1E3320" />
        <circle cx="86" cy="36" r="14" fill="#29452B" />
        <circle cx="86" cy="36" r="8" fill="#1E3320" />

        {/* Panda Body */}
        <ellipse cx="60" cy="85" rx="34" ry="26" fill="#FFF8F0" />
        {/* Dark body patches / arms */}
        <path
          d="M32 72 C24 78 22 92 28 100 C34 106 42 104 45 96 C42 86 38 78 32 72 Z"
          fill="#29452B"
        />
        <path
          d="M88 72 C96 78 98 92 92 100 C86 106 78 104 75 96 C78 86 82 78 88 72 Z"
          fill="#29452B"
        />
        {/* Feet */}
        <ellipse cx="44" cy="104" rx="10" ry="7" fill="#243D26" />
        <ellipse cx="76" cy="104" rx="10" ry="7" fill="#243D26" />
        {/* Foot pads */}
        <circle cx="44" cy="104" r="3.5" fill="#F3A6B7" opacity="0.6" />
        <circle cx="76" cy="104" r="3.5" fill="#F3A6B7" opacity="0.6" />

        {/* Bamboo Stalk held in paws */}
        <g transform="rotate(-15 60 75)">
          <rect x="54" y="42" width="7" height="60" rx="3.5" fill="#74865B" />
          <line x1="53" y1="56" x2="62" y2="56" stroke="#A7B89A" strokeWidth="2" strokeLinecap="round" />
          <line x1="53" y1="72" x2="62" y2="72" stroke="#A7B89A" strokeWidth="2" strokeLinecap="round" />
          <line x1="53" y1="88" x2="62" y2="88" stroke="#A7B89A" strokeWidth="2" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M61 54 C70 50 78 52 82 48 C76 56 68 57 61 54 Z" fill="#A7B89A" />
          <path d="M54 70 C46 66 38 68 34 64 C40 72 48 73 54 70 Z" fill="#A7B89A" />
          <path d="M61 86 C72 82 80 85 84 80 C78 89 70 90 61 86 Z" fill="#A7B89A" />
        </g>

        {/* Front Paws clutching */}
        <circle cx="50" cy="80" r="7" fill="#29452B" />
        <circle cx="68" cy="78" r="7" fill="#29452B" />

        {/* Panda Head */}
        <ellipse cx="60" cy="52" rx="32" ry="27" fill="#FFF8F0" />
        
        {/* Eye Patches */}
        <ellipse cx="46" cy="50" rx="9.5" ry="12.5" transform="rotate(-15 46 50)" fill="#29452B" />
        <ellipse cx="74" cy="50" rx="9.5" ry="12.5" transform="rotate(15 74 50)" fill="#29452B" />

        {/* Eyes (sparkly reflection) */}
        <circle cx="47" cy="49" r="4.5" fill="#FFFFFF" />
        <circle cx="48" cy="48" r="2.5" fill="#1C301D" />
        <circle cx="49" cy="47" r="1.2" fill="#FFFFFF" />

        <circle cx="73" cy="49" r="4.5" fill="#FFFFFF" />
        <circle cx="72" cy="48" r="2.5" fill="#1C301D" />
        <circle cx="71" cy="47" r="1.2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="36" cy="58" rx="6" ry="4" fill="#F3A6B7" opacity="0.65" />
        <ellipse cx="84" cy="58" rx="6" ry="4" fill="#F3A6B7" opacity="0.65" />

        {/* Nose */}
        <path d="M57 58 C57 56 63 56 63 58 C63 61 57 61 57 58 Z" fill="#29452B" />

        {/* Cute Smile */}
        <path d="M55 63 C58 66 62 66 65 63" stroke="#29452B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. Peeking pose - peeking over a card or header
  if (pose === 'peeking') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        {/* Ears */}
        <circle cx="26" cy="22" r="12" fill="#29452B" />
        <circle cx="26" cy="22" r="6" fill="#1E3320" />
        <circle cx="74" cy="22" r="12" fill="#29452B" />
        <circle cx="74" cy="22" r="6" fill="#1E3320" />

        {/* Head */}
        <ellipse cx="50" cy="38" rx="30" ry="24" fill="#FFF8F0" />

        {/* Eye Patches */}
        <ellipse cx="38" cy="36" rx="8" ry="10" transform="rotate(-12 38 36)" fill="#29452B" />
        <ellipse cx="62" cy="36" rx="8" ry="10" transform="rotate(12 62 36)" fill="#29452B" />

        {/* Sparkle Eyes */}
        <circle cx="39" cy="35" r="3.5" fill="#FFFFFF" />
        <circle cx="40" cy="34" r="2" fill="#1C301D" />
        <circle cx="41" cy="33" r="1" fill="#FFFFFF" />

        <circle cx="61" cy="35" r="3.5" fill="#FFFFFF" />
        <circle cx="60" cy="34" r="2" fill="#1C301D" />
        <circle cx="59" cy="33" r="1" fill="#FFFFFF" />

        {/* Cheeks */}
        <ellipse cx="28" cy="44" rx="5" ry="3.5" fill="#F3A6B7" opacity="0.7" />
        <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#F3A6B7" opacity="0.7" />

        {/* Nose & Mouth */}
        <ellipse cx="50" cy="43" rx="3" ry="2.2" fill="#29452B" />
        <path d="M46 47 C48 50 52 50 54 47" stroke="#29452B" strokeWidth="1.8" strokeLinecap="round" />

        {/* Cute Little Paws resting on the bottom edge */}
        <ellipse cx="32" cy="62" rx="7" ry="5.5" fill="#29452B" />
        <ellipse cx="68" cy="62" rx="7" ry="5.5" fill="#29452B" />
        {/* Tiny paw claws */}
        <circle cx="28" cy="60" r="1.2" fill="#FFF8F0" />
        <circle cx="32" cy="58" r="1.2" fill="#FFF8F0" />
        <circle cx="36" cy="60" r="1.2" fill="#FFF8F0" />

        <circle cx="64" cy="60" r="1.2" fill="#FFF8F0" />
        <circle cx="68" cy="58" r="1.2" fill="#FFF8F0" />
        <circle cx="72" cy="60" r="1.2" fill="#FFF8F0" />
      </svg>
    );
  }

  // 3. Celebrating pose - paws up, confetti aura, joyful open smile
  if (pose === 'celebrating') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        {/* Celebration sparkles */}
        <path d="M20 25 L24 22 L20 19 L23 15 L20 11" stroke="#F5E6A8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="102" cy="22" r="3" fill="#F3A6B7" />
        <circle cx="15" cy="50" r="2.5" fill="#A7B89A" />
        <polygon points="104,40 106,45 111,46 107,49 108,54 104,51 100,54 101,49 97,46 102,45" fill="#F5E6A8" />

        {/* Ears */}
        <circle cx="32" cy="34" r="13" fill="#29452B" />
        <circle cx="32" cy="34" r="7" fill="#1E3320" />
        <circle cx="88" cy="34" r="13" fill="#29452B" />
        <circle cx="88" cy="34" r="7" fill="#1E3320" />

        {/* Paws raised in celebration! */}
        <path d="M28 48 C20 40 18 28 26 24 C34 20 40 28 36 42 Z" fill="#29452B" />
        <path d="M92 48 C100 40 102 28 94 24 C86 20 80 28 84 42 Z" fill="#29452B" />

        {/* Body */}
        <ellipse cx="60" cy="85" rx="32" ry="25" fill="#FFF8F0" />
        {/* Feet */}
        <ellipse cx="45" cy="104" rx="9" ry="7" fill="#29452B" />
        <ellipse cx="75" cy="104" rx="9" ry="7" fill="#29452B" />
        <circle cx="45" cy="104" r="3" fill="#F3A6B7" opacity="0.6" />
        <circle cx="75" cy="104" r="3" fill="#F3A6B7" opacity="0.6" />

        {/* Head */}
        <ellipse cx="60" cy="54" rx="30" ry="25" fill="#FFF8F0" />

        {/* Happy Eye Patches with Curved Happy Eyes */}
        <ellipse cx="46" cy="51" rx="9" ry="11" transform="rotate(-10 46 51)" fill="#29452B" />
        <ellipse cx="74" cy="51" rx="9" ry="11" transform="rotate(10 74 51)" fill="#29452B" />

        {/* Joyful curved eyes (smiling closed or sparkling) */}
        <path d="M42 51 Q46 45 50 51" stroke="#FFF8F0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M70 51 Q74 45 78 51" stroke="#FFF8F0" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <ellipse cx="36" cy="60" rx="6" ry="4" fill="#F3A6B7" opacity="0.75" />
        <ellipse cx="84" cy="60" rx="6" ry="4" fill="#F3A6B7" opacity="0.75" />

        {/* Nose */}
        <ellipse cx="60" cy="59" rx="3" ry="2" fill="#29452B" />

        {/* Big Joyful Open Mouth */}
        <path d="M54 64 Q60 74 66 64 Z" fill="#F3A6B7" stroke="#29452B" strokeWidth="1.5" />
      </svg>
    );
  }

  // 4. Waving pose - friendly greeting
  if (pose === 'waving') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        <ellipse cx="50" cy="94" rx="28" ry="4" fill="#1C301D" opacity="0.15" />
        {/* Ears */}
        <circle cx="28" cy="28" r="11" fill="#29452B" />
        <circle cx="72" cy="28" r="11" fill="#29452B" />

        {/* Body */}
        <ellipse cx="50" cy="72" rx="26" ry="22" fill="#FFF8F0" />
        <circle cx="36" cy="88" r="7" fill="#29452B" />
        <circle cx="64" cy="88" r="7" fill="#29452B" />

        {/* Left Arm relaxed */}
        <ellipse cx="26" cy="68" rx="7" ry="11" transform="rotate(15 26 68)" fill="#29452B" />

        {/* Right Arm Waving! */}
        <g className={animated ? 'origin-[70px_55px] animate-wiggle' : ''}>
          <path d="M72 58 C80 50 88 40 88 32 C88 26 80 26 76 34 C72 42 70 50 72 58 Z" fill="#29452B" />
          <ellipse cx="83" cy="30" rx="4" ry="4.5" fill="#29452B" />
          <circle cx="83" cy="30" r="1.8" fill="#F3A6B7" opacity="0.6" />
        </g>

        {/* Head */}
        <ellipse cx="50" cy="42" rx="26" ry="22" fill="#FFF8F0" />

        {/* Eye Patches */}
        <ellipse cx="39" cy="40" rx="7.5" ry="9.5" transform="rotate(-10 39 40)" fill="#29452B" />
        <ellipse cx="61" cy="40" rx="7.5" ry="9.5" transform="rotate(10 61 40)" fill="#29452B" />

        {/* Eyes */}
        <circle cx="40" cy="39" r="3.5" fill="#FFFFFF" />
        <circle cx="41" cy="38" r="2" fill="#1C301D" />
        <circle cx="42" cy="37" r="0.9" fill="#FFFFFF" />

        <circle cx="60" cy="39" r="3.5" fill="#FFFFFF" />
        <circle cx="59" cy="38" r="2" fill="#1C301D" />
        <circle cx="58" cy="37" r="0.9" fill="#FFFFFF" />

        {/* Cheeks */}
        <ellipse cx="30" cy="46" rx="5" ry="3.5" fill="#F3A6B7" opacity="0.7" />
        <ellipse cx="70" cy="46" rx="5" ry="3.5" fill="#F3A6B7" opacity="0.7" />

        {/* Nose & Smile */}
        <ellipse cx="50" cy="46" rx="2.5" ry="1.8" fill="#29452B" />
        <path d="M46 50 C48 53 52 53 54 50" stroke="#29452B" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Meditating pose - zen with leaf on head
  if (pose === 'meditating') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        <ellipse cx="50" cy="92" rx="34" ry="5" fill="#1C301D" opacity="0.16" />
        {/* Zen Lotus Leaf Hat */}
        <path d="M50 20 C42 12 30 18 26 22 C34 26 44 24 50 20 Z" fill="#74865B" />
        <path d="M50 20 C58 12 70 18 74 22 C66 26 56 24 50 20 Z" fill="#A7B89A" />
        <circle cx="50" cy="18" r="2" fill="#F5E6A8" />

        {/* Ears */}
        <circle cx="28" cy="34" r="10" fill="#29452B" />
        <circle cx="72" cy="34" r="10" fill="#29452B" />

        {/* Body & Cross-legged pose */}
        <ellipse cx="50" cy="74" rx="28" ry="20" fill="#FFF8F0" />
        <ellipse cx="28" cy="84" rx="14" ry="8" transform="rotate(-15 28 84)" fill="#29452B" />
        <ellipse cx="72" cy="84" rx="14" ry="8" transform="rotate(15 72 84)" fill="#29452B" />

        {/* Paws together in lap */}
        <ellipse cx="50" cy="76" rx="9" ry="6" fill="#29452B" />

        {/* Head */}
        <ellipse cx="50" cy="46" rx="26" ry="21" fill="#FFF8F0" />

        {/* Peaceful closed eyes */}
        <ellipse cx="38" cy="44" rx="7" ry="8" transform="rotate(-10 38 44)" fill="#29452B" />
        <ellipse cx="62" cy="44" rx="7" ry="8" transform="rotate(10 62 44)" fill="#29452B" />
        <path d="M34 45 Q38 41 42 45" stroke="#FFF8F0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M58 45 Q62 41 66 45" stroke="#FFF8F0" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <ellipse cx="30" cy="50" rx="5" ry="3" fill="#F3A6B7" opacity="0.6" />
        <ellipse cx="70" cy="50" rx="5" ry="3" fill="#F3A6B7" opacity="0.6" />

        {/* Nose & calm smile */}
        <ellipse cx="50" cy="50" rx="2.5" ry="1.6" fill="#29452B" />
        <path d="M47 54 Q50 56 53 54" stroke="#29452B" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 6. Scholar pose - little spectacles & book
  if (pose === 'scholar') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        <ellipse cx="50" cy="94" rx="28" ry="4" fill="#1C301D" opacity="0.15" />
        {/* Ears */}
        <circle cx="28" cy="28" r="11" fill="#29452B" />
        <circle cx="72" cy="28" r="11" fill="#29452B" />

        {/* Body */}
        <ellipse cx="50" cy="72" rx="26" ry="22" fill="#FFF8F0" />
        <ellipse cx="34" cy="88" rx="8" ry="6" fill="#29452B" />
        <ellipse cx="66" cy="88" rx="8" ry="6" fill="#29452B" />

        {/* Tiny Book held */}
        <rect x="36" y="70" width="28" height="18" rx="3" fill="#A7B89A" />
        <rect x="38" y="72" width="11" height="14" fill="#FFF8F0" rx="1" />
        <rect x="51" y="72" width="11" height="14" fill="#FFF8F0" rx="1" />
        <line x1="41" y1="75" x2="47" y2="75" stroke="#74865B" strokeWidth="1" />
        <line x1="41" y1="78" x2="47" y2="78" stroke="#74865B" strokeWidth="1" />
        <line x1="54" y1="75" x2="60" y2="75" stroke="#74865B" strokeWidth="1" />
        <line x1="54" y1="78" x2="60" y2="78" stroke="#74865B" strokeWidth="1" />

        {/* Paws on book */}
        <circle cx="34" cy="76" r="5" fill="#29452B" />
        <circle cx="66" cy="76" r="5" fill="#29452B" />

        {/* Head */}
        <ellipse cx="50" cy="42" rx="26" ry="22" fill="#FFF8F0" />

        {/* Eye Patches */}
        <ellipse cx="38" cy="40" rx="8" ry="10" transform="rotate(-8 38 40)" fill="#29452B" />
        <ellipse cx="62" cy="40" rx="8" ry="10" transform="rotate(8 62 40)" fill="#29452B" />

        {/* Eyes */}
        <circle cx="39" cy="39" r="3" fill="#FFFFFF" />
        <circle cx="39" cy="39" r="1.8" fill="#1C301D" />
        <circle cx="61" cy="39" r="3" fill="#FFFFFF" />
        <circle cx="61" cy="39" r="1.8" fill="#1C301D" />

        {/* Cute Round Glasses */}
        <circle cx="38" cy="40" r="7.5" stroke="#F5E6A8" strokeWidth="1.8" fill="rgba(245,230,168,0.2)" />
        <circle cx="62" cy="40" r="7.5" stroke="#F5E6A8" strokeWidth="1.8" fill="rgba(245,230,168,0.2)" />
        <line x1="45.5" y1="40" x2="54.5" y2="40" stroke="#F5E6A8" strokeWidth="1.8" />

        {/* Cheeks */}
        <ellipse cx="28" cy="47" rx="5" ry="3" fill="#F3A6B7" opacity="0.65" />
        <ellipse cx="72" cy="47" rx="5" ry="3" fill="#F3A6B7" opacity="0.65" />

        {/* Nose & Smile */}
        <ellipse cx="50" cy="48" rx="2.5" ry="1.6" fill="#29452B" />
        <path d="M47 52 Q50 54 53 52" stroke="#29452B" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Workout pose - headband, energetic
  if (pose === 'workout') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animClass} ${className}`}
      >
        <ellipse cx="50" cy="94" rx="28" ry="4" fill="#1C301D" opacity="0.15" />
        {/* Ears */}
        <circle cx="28" cy="28" r="11" fill="#29452B" />
        <circle cx="72" cy="28" r="11" fill="#29452B" />

        {/* Headband */}
        <path d="M22 36 Q50 30 78 36" stroke="#F3A6B7" strokeWidth="6" strokeLinecap="round" />
        <circle cx="24" cy="38" r="3" fill="#F6B8A8" />

        {/* Body */}
        <ellipse cx="50" cy="72" rx="26" ry="22" fill="#FFF8F0" />
        {/* Feet */}
        <ellipse cx="36" cy="88" rx="8" ry="6" fill="#29452B" />
        <ellipse cx="64" cy="88" rx="8" ry="6" fill="#29452B" />

        {/* Flexing Arms */}
        <path d="M30 65 C20 58 18 46 25 44 C30 42 34 50 34 60 Z" fill="#29452B" />
        <path d="M70 65 C80 58 82 46 75 44 C70 42 66 50 66 60 Z" fill="#29452B" />

        {/* Head */}
        <ellipse cx="50" cy="46" rx="26" ry="20" fill="#FFF8F0" />

        {/* Eye Patches */}
        <ellipse cx="38" cy="44" rx="8" ry="9" transform="rotate(-8 38 44)" fill="#29452B" />
        <ellipse cx="62" cy="44" rx="8" ry="9" transform="rotate(8 62 44)" fill="#29452B" />

        {/* Determined Happy Eyes */}
        <circle cx="39" cy="43" r="3" fill="#FFFFFF" />
        <circle cx="40" cy="43" r="1.8" fill="#1C301D" />
        <circle cx="61" cy="43" r="3" fill="#FFFFFF" />
        <circle cx="60" cy="43" r="1.8" fill="#1C301D" />

        {/* Cheeks */}
        <ellipse cx="28" cy="50" rx="5" ry="3" fill="#F3A6B7" opacity="0.75" />
        <ellipse cx="72" cy="50" rx="5" ry="3" fill="#F3A6B7" opacity="0.75" />

        {/* Nose & Determined Grin */}
        <ellipse cx="50" cy="50" rx="2.5" ry="1.6" fill="#29452B" />
        <path d="M46 54 Q50 58 54 54" stroke="#29452B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 8. Sleeping / Cozy resting pose
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animClass} ${className}`}
    >
      <ellipse cx="50" cy="72" rx="36" ry="5" fill="#1C301D" opacity="0.14" />
      {/* Curled body */}
      <ellipse cx="50" cy="50" rx="34" ry="22" fill="#FFF8F0" />
      {/* Ear */}
      <circle cx="28" cy="34" r="9" fill="#29452B" />
      <circle cx="70" cy="40" r="8" fill="#29452B" />

      {/* Sleeping face on side */}
      <ellipse cx="38" cy="48" rx="7" ry="6" fill="#29452B" />
      <path d="M35 48 Q38 52 41 48" stroke="#FFF8F0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      
      {/* Rosy Cheek */}
      <ellipse cx="44" cy="54" rx="4" ry="3" fill="#F3A6B7" opacity="0.7" />

      {/* Nose */}
      <ellipse cx="30" cy="54" rx="2" ry="1.5" fill="#29452B" />

      {/* Curled paw */}
      <ellipse cx="42" cy="62" rx="7" ry="5" fill="#29452B" />
      <ellipse cx="68" cy="58" rx="8" ry="6" fill="#29452B" />

      {/* Sleep zzz */}
      <text x="68" y="24" fill="#74865B" fontSize="11" fontWeight="bold" fontFamily="sans-serif">z</text>
      <text x="76" y="16" fill="#A7B89A" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Z</text>
      <text x="86" y="9" fill="#F3A6B7" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Z</text>
    </svg>
  );
};
