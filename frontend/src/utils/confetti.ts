import confetti from 'canvas-confetti';

export function fireCozyConfetti() {
  try {
    // Pastel colors matching Levelora theme: Peach, Pink, Sage, Mint, Gold
    const colors = ['#F6B8A8', '#F3A6B7', '#A7B89A', '#DCE8D2', '#F5E6A8', '#FFF5E8'];

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true,
    });

    // Secondary soft shower
    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true,
      });
    }, 200);
  } catch (e) {
    console.warn('Confetti effect skipped:', e);
  }
}
