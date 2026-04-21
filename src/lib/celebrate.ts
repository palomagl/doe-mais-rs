import confetti from "canvas-confetti";

export function celebrateDonation() {
  const duration = 1800;
  const end = Date.now() + duration;
  const colors = ["#dc2626", "#ef4444", "#fca5a5", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function celebrateBadge() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#fbbf24", "#f59e0b", "#dc2626", "#ffffff"],
  });
}
