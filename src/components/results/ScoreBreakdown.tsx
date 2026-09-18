"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ARCHETYPES, archetypeGradient, type ArchetypeId } from "@/data/archetypes";
import { easeOut } from "@/lib/animations";
import { cn } from "@/lib/cn";

export type BreakdownRow = { id: ArchetypeId; percent: number; highlight?: boolean; note?: string };

/** Bare animate cu procentele pe arhetipuri (la rezultat și în panoul standului). */
export function ScoreBreakdown({ rows, delay = 0 }: { rows: BreakdownRow[]; delay?: number }) {
  return (
    <ul className="space-y-4">
      {rows.map((row, i) => {
        const archetype = ARCHETYPES[row.id];
        return (
          <li key={row.id} className="flex items-center gap-3">
            <span className="w-9 shrink-0 text-center text-2xl">{archetype.emoji}</span>
            <div className="flex-1">
              <div className="flex items-baseline justify-between text-sm">
                <span className={cn(row.highlight ? "font-semibold text-white" : "text-white/70")}>
                  {archetype.short}
                  {row.note && <span className="ml-2 text-white/40">{row.note}</span>}
                </span>
                <AnimatedCounter value={row.percent} suffix="%" duration={1.4} className="font-mono text-white/80" />
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: archetypeGradient(row.id, 90) }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${row.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: easeOut, delay: delay + i * 0.12 }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
