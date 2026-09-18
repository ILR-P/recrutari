"use client";

import { motion } from "motion/react";
import { Morisca } from "@/components/ui/Morisca";
import { QUIZ_STEPS } from "@/data/quiz";
import { springs } from "@/lib/animations";

/** Bară segmentată: un segment pe pas, 🎮 deasupra mini-jocurilor, iar morișca se rotește la fiecare pas. */
export function QuizProgress({ current }: { current: number }) {
  const total = QUIZ_STEPS.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <motion.div
      className="mx-auto flex w-full max-w-3xl items-center gap-3 sm:gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <span className="font-mono text-sm text-white/60 tabular-nums">
        {pad(current + 1)}/{pad(total)}
      </span>
      <div className="flex flex-1 gap-1.5 pt-4">
        {QUIZ_STEPS.map((step, i) => (
          <div key={step.id} className="relative flex-1">
            {step.kind === "game" && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs" aria-hidden>
                🎮
              </span>
            )}
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left rounded-full bg-linear-to-r from-best-400 to-fuchsia-400"
                initial={false}
                animate={{
                  scaleX: i < current ? 1 : i === current ? 0.45 : 0,
                  opacity: i === current ? [0.6, 1, 0.6] : 1,
                }}
                transition={{
                  scaleX: springs.soft,
                  opacity: i === current ? { duration: 1.6, repeat: Infinity } : { duration: 0.2 },
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Morisca className="size-8 shrink-0" animate={{ rotate: current * 90 }} transition={springs.bouncy} />
    </motion.div>
  );
}
