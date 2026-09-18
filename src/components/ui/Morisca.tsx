"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";

/**
 * Morișcă stilizată, folosită ca motiv decorativ. Nu e logo-ul oficial BEST:
 * pune logo-ul oficial în /public dacă vrei să-l folosești.
 */
const PALETTES = {
  best: ["#d9c7ff", "#a26cff", "#7c22f5", "#5815ad"],
  archetypes: ["#fbbf24", "#22d3ee", "#e879f9", "#a3e635"],
};

type Props = Omit<ComponentProps<typeof motion.svg>, "viewBox" | "children"> & {
  palette?: keyof typeof PALETTES;
};

export function Morisca({ palette = "best", ...props }: Props) {
  return (
    <motion.svg viewBox="0 0 100 100" aria-hidden {...props}>
      {PALETTES[palette].map((color, i) => (
        <g key={color} transform={`rotate(${i * 90} 50 50)`}>
          <path d="M50 50 L50 4 Q82 6 90 38 Z" fill={color} />
          <path d="M50 50 L50 4 L66 30 Z" fill="white" opacity={0.2} />
        </g>
      ))}
      <circle cx="50" cy="50" r="6.5" fill="white" />
      <circle cx="50" cy="50" r="2.5" fill="#2c065e" />
    </motion.svg>
  );
}
