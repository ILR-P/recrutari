"use client";

import { motion } from "motion/react";
import { Morisca } from "@/components/ui/Morisca";
import { TiltCard } from "@/components/ui/TiltCard";
import { ARCHETYPES, archetypeGradient, type ArchetypeId } from "@/data/archetypes";
import { easeOut, springs } from "@/lib/animations";

type Props = { archetypeId: ArchetypeId; bestanNo: number; issuedAt: string };

/** Legitimația holografică de BESTan: se înclină după cursor și se clatină singură pe ecranele de la stand. */
export function BestanIdCard({ archetypeId, bestanNo, issuedAt }: Props) {
  const archetype = ARCHETYPES[archetypeId];
  const [c1] = archetype.colors;

  return (
    <motion.div
      initial={{ rotateY: -100, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{ ...springs.soft, delay: 0.6 }}
      style={{ transformPerspective: 1200 }}
    >
      <TiltCard effect="holo" idleWobble max={14} className="w-[min(88vw,420px)] rounded-3xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/25 p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:p-6"
          style={{ background: `linear-gradient(140deg, ${c1}40, #2c065e 45%, #140a26)` }}
        >
          <div aria-hidden className="absolute inset-0 grid-bg opacity-30" />
          <Morisca aria-hidden className="absolute -right-12 -bottom-12 size-48 opacity-10" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Morisca className="size-6" />
              <span className="font-display text-sm font-bold">BEST Cluj-Napoca</span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/60 uppercase">BESTan ID</span>
          </div>

          <div className="relative mt-5 flex items-center gap-4">
            <div
              className="grid size-20 shrink-0 place-items-center rounded-2xl text-5xl shadow-inner"
              style={{ background: archetypeGradient(archetypeId) }}
            >
              {archetype.emoji}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs text-white/55">BESTan #{String(bestanNo).padStart(4, "0")}</p>
              <p className="truncate font-display text-2xl font-bold">{archetype.short}</p>
              <div className="mt-1 h-3 w-10 rounded-sm bg-linear-to-br from-amber-200 to-amber-500 opacity-90" title="cip" />
            </div>
          </div>

          <div className="relative mt-5 space-y-2">
            {archetype.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3 text-xs">
                <span className="w-20 shrink-0 text-white/70">{stat.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: archetypeGradient(archetypeId, 90) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.1, ease: easeOut, delay: 1.2 + i * 0.15 }}
                  />
                </div>
                <span className="w-7 text-right font-mono text-white/80">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-5 flex items-end justify-between gap-4">
            <div className="font-mono text-[10px] leading-relaxed text-white/55 uppercase">
              <p>Emis: {issuedAt}</p>
              <p>Valabil: pentru totdeauna</p>
            </div>
            <div
              aria-hidden
              className="h-8 w-24 opacity-70"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, white 0 2px, transparent 2px 4px, white 4px 5px, transparent 5px 8px, white 8px 11px, transparent 11px 12px)",
              }}
            />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
