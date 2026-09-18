import confetti from "canvas-confetti";

/**
 * Celebrarea de la rezultat: o explozie centrală, confetti din emoji și
 * salve laterale timp de ~2,5 s. Întoarce o funcție care oprește salvele.
 */
export function celebrate(colors: string[], emoji?: string, durationMs = 2500): () => void {
  const base = { colors, disableForReducedMotion: true, zIndex: 80 };

  confetti({ ...base, particleCount: 160, spread: 110, startVelocity: 55, origin: { y: 0.6 } });

  if (emoji) {
    try {
      const shape = confetti.shapeFromText({ text: emoji, scalar: 2.4 });
      confetti({ ...base, shapes: [shape], scalar: 2.4, particleCount: 26, spread: 140, startVelocity: 45, origin: { y: 0.55 } });
    } catch {
      // Unele browsere vechi nu pot desena emoji pe canvas; rămânem la confetti clasic.
    }
  }

  // Salvele laterale trag la fiecare al doilea cadru: aceeași densitate vizuală,
  // jumătate din mesajele către worker-ul care desenează confetti-ul.
  const end = performance.now() + durationMs;
  let frame = 0;
  let tick = 0;
  const cannons = () => {
    if (tick++ % 2 === 0) {
      confetti({ ...base, particleCount: 6, angle: 60, spread: 60, startVelocity: 60, origin: { x: 0, y: 0.75 } });
      confetti({ ...base, particleCount: 6, angle: 120, spread: 60, startVelocity: 60, origin: { x: 1, y: 0.75 } });
    }
    if (performance.now() < end) frame = requestAnimationFrame(cannons);
  };
  frame = requestAnimationFrame(cannons);

  return () => cancelAnimationFrame(frame);
}
