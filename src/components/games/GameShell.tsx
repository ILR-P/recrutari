"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { Scores } from "@/data/quiz";
import { countdownPop, fadeUp, springs, staggerContainer } from "@/lib/animations";

export type GameResult = { delta: Scores; headline: string; detail?: string };

type Stage = "intro" | "countdown" | "playing" | "done";

type Props = {
  title: string;
  story: string;
  emoji: string;
  /** Numărătoare „3-2-1-GO!” înainte de joc (pentru jocurile pe timp) */
  countdown?: boolean;
  onComplete: (delta: Scores) => void;
  children: (finish: (result: GameResult) => void) => ReactNode;
};

/** Cadrul comun al mini-jocurilor: intro, numărătoare, joc și ecranul de final. */
export function GameShell({ title, story, emoji, countdown = true, onComplete, children }: Props) {
  const [stage, setStage] = useState<Stage>("intro");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    if (stage !== "countdown") return;
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      if (n >= 0) setCount(n);
      else {
        clearInterval(id);
        setStage("playing");
      }
    }, 650);
    return () => clearInterval(id);
  }, [stage]);

  const begin = () => {
    setCount(3);
    setStage(countdown ? "countdown" : "playing");
  };

  const finish = (r: GameResult) => {
    setResult(r);
    setStage("done");
  };

  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.3 } }}
      transition={springs.soft}
    >
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            className="flex flex-col items-center text-center"
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -30 }}
          >
            <motion.span
              className="text-7xl sm:text-8xl"
              animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
            <motion.p variants={fadeUp} className="mt-5 font-mono text-xs tracking-[0.3em] text-best-300 uppercase">
              🎮 Mini-joc
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-2 font-display text-4xl font-bold sm:text-6xl">
              {title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-lg text-balance text-white/75">
              {story}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Button onClick={begin} size="xl">
                Joacă <Play className="size-5 fill-current" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {stage === "countdown" && (
          <motion.div key="countdown" className="grid h-80 place-items-center" exit={{ opacity: 0 }}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                variants={countdownPop}
                initial="hidden"
                animate="show"
                exit="exit"
                className="font-display text-8xl font-bold text-gradient sm:text-9xl"
              >
                {count === 0 ? "GO!" : count}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}

        {stage === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            {children(finish)}
          </motion.div>
        )}

        {stage === "done" && result && (
          <motion.div
            key="done"
            className="flex flex-col items-center text-center"
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="show"
          >
            <motion.span
              className="text-7xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={springs.bouncy}
            >
              🏁
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-balance sm:text-5xl">
              {result.headline}
            </motion.h2>
            {result.detail && (
              <motion.p variants={fadeUp} className="mt-3 max-w-lg text-lg text-white/70">
                {result.detail}
              </motion.p>
            )}
            <motion.div variants={fadeUp} className="mt-8">
              <Button onClick={() => onComplete(result.delta)} size="xl">
                Continuă <ArrowRight className="size-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
