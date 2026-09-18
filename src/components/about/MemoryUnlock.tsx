"use client";

import { AnimatePresence, motion } from "motion/react";
import { LockOpen, RotateCcw } from "lucide-react";
import { useState } from "react";
import { MemoryGame } from "@/components/games/MemoryGame";
import { celebrate } from "@/components/results/celebrate";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { SITE } from "@/data/site";
import { springs } from "@/lib/animations";

export function MemoryUnlock() {
  const [wonIn, setWonIn] = useState<number | null>(null);

  const handleWin = (moves: number) => {
    setWonIn(moves);
    celebrate(["#a26cff", "#e879f9", "#fbbf24", "#22d3ee", "#ffffff"], "🎁", 1800);
  };

  return (
    <section id="joc" className="scroll-mt-24 px-4 py-24 sm:py-32">
      <SectionHeading
        eyebrow="// 05 · Bonus"
        title="Deblochează secretul BEST"
        accent="secretul"
        subtitle="Potrivește fiecare proiect cu descrierea lui. Dacă le găsești pe toate, primești o surpriză."
      />

      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {wonIn === null ? (
            <motion.div key="game" exit={{ opacity: 0, scale: 0.95 }}>
              <MemoryGame onWin={handleWin} />
            </motion.div>
          ) : (
            <motion.div
              key="reward"
              className="mx-auto max-w-lg"
              initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={springs.bouncy}
            >
              <TiltCard effect="holo" idleWobble className="rounded-[2rem]">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-linear-to-br from-best-500 via-fuchsia-600 to-best-800 p-8 text-center sm:p-10">
                  <motion.div
                    className="mx-auto grid size-20 place-items-center rounded-full bg-white/20"
                    initial={{ rotate: -30, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ ...springs.bouncy, delay: 0.3 }}
                  >
                    <LockOpen className="size-10" />
                  </motion.div>
                  <p className="mt-6 font-mono text-xs tracking-[0.3em] text-white/80 uppercase">Secret deblocat</p>
                  <h3 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Felicitări! 🎉</h3>
                  <p className="mt-4 text-lg text-balance">{SITE.memoryReward}</p>
                  <p className="mt-4 font-mono text-sm text-white/70">Ai reușit din {wonIn} mutări.</p>
                </div>
              </TiltCard>
              <div className="mt-6 flex justify-center">
                <motion.button
                  type="button"
                  onClick={() => setWonIn(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass flex h-12 cursor-pointer items-center gap-2 rounded-full px-6 font-display font-semibold"
                >
                  <RotateCcw className="size-4" /> Joacă din nou
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
