import type { Transition, Variants } from "motion/react";

/**
 * Configurația centrală de animații. Componentele importă de aici,
 * ca tot site-ul să aibă același „limbaj” de mișcare.
 */

export const springs = {
  /** Reacții rapide: butoane, selecții */
  snappy: { type: "spring", stiffness: 520, damping: 32 },
  /** Elemente jucăușe: emoji, badge-uri, pop-uri */
  bouncy: { type: "spring", stiffness: 320, damping: 14 },
  /** Intrări mari: carduri, secțiuni */
  soft: { type: "spring", stiffness: 120, damping: 20 },
} satisfies Record<string, Transition>;

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: springs.bouncy },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const slideIn = (dir: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: dir === "left" ? -80 : 80, rotate: dir === "left" ? -3 : 3 },
  show: { opacity: 1, x: 0, rotate: 0, transition: springs.soft },
});

/** Fiecare întrebare intră altfel: le alegem pe rând după index. */
const flip3D: Variants = {
  hidden: { opacity: 0, rotateX: -75, y: 60, transformPerspective: 1200 },
  show: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 1200, transition: springs.soft },
  exit: { opacity: 0, rotateX: 60, y: -40, transition: { duration: 0.3 } },
};

// Fără filter: blur (ar redesena tot blocul la fiecare cadru); zoom + opacitate arată aproape la fel.
const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 1.35 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } },
};

const slideSkew: Variants = {
  hidden: { opacity: 0, x: "45%", skewX: -18 },
  show: { opacity: 1, x: "0%", skewX: 0, transition: springs.soft },
  exit: { opacity: 0, x: "-45%", skewX: 18, transition: { duration: 0.3 } },
};

const glitch: Variants = {
  hidden: { opacity: 0, clipPath: "inset(50% 0% 50% 0%)" },
  show: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    x: [0, -10, 8, -4, 0],
    transition: { duration: 0.55, ease: easeOut },
  },
  exit: { opacity: 0, clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.3 } },
};

export const questionEntrances = [flip3D, zoomIn, slideSkew, glitch];

/** Ieșire comună pentru ecrane mari: doar opacitate și scale, care nu redesenează conținutul. */
export const screenExit = { opacity: 0, scale: 1.06, transition: { duration: 0.3 } };

export const cardFlip: Variants = {
  back: { rotateY: 180 },
  front: { rotateY: 0, transition: { ...springs.soft, delay: 0.35 } },
};

export const pulseSelect = {
  scale: [1, 1.07, 0.98, 1.03],
  transition: { duration: 0.45 },
};

export const countdownPop: Variants = {
  hidden: { scale: 2.6, opacity: 0, rotate: -12 },
  show: { scale: 1, opacity: 1, rotate: 0, transition: springs.bouncy },
  exit: { scale: 0.3, opacity: 0, transition: { duration: 0.2 } },
};
