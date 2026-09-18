"use client";

import { motion } from "motion/react";
import { Rocket } from "lucide-react";
import { useEffect, useEffectEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Morisca } from "@/components/ui/Morisca";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { ARCHETYPE_IDS, ARCHETYPES } from "@/data/archetypes";
import { QUIZ_STEPS } from "@/data/quiz";
import { fadeUp, screenExit, springs, staggerContainer } from "@/lib/animations";

export function QuizIntro({ onStart }: { onStart: () => void }) {
  const games = QUIZ_STEPS.filter((s) => s.kind === "game").length;
  const questions = QUIZ_STEPS.length - games;
  const startFromKey = useEffectEvent(onStart);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") startFromKey();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.div
      className="flex w-full max-w-3xl flex-col items-center text-center"
      variants={staggerContainer(0.1)}
      initial="hidden"
      animate="show"
      exit={screenExit}
    >
      {/* Arhetipurile se rotesc pe o orbită în jurul moriștii (animație CSS, rulează pe GPU) */}
      <motion.div variants={fadeUp} className="relative size-56 sm:size-72">
        <div className="absolute inset-[8%] rounded-full border border-dashed border-white/15" />
        <Morisca palette="archetypes" className="absolute inset-[30%] animate-spin-slow will-change-transform" />
        <div className="absolute inset-0 animate-orbit will-change-transform">
          {ARCHETYPE_IDS.map((id, i) => {
            const angle = (i / ARCHETYPE_IDS.length) * Math.PI * 2;
            return (
              <span
                key={id}
                className="absolute -translate-1/2"
                style={{ left: `${50 + Math.cos(angle) * 42}%`, top: `${50 + Math.sin(angle) * 42}%` }}
              >
                <span className="block animate-orbit-reverse text-4xl will-change-transform sm:text-5xl">
                  {ARCHETYPES[id].emoji}
                </span>
              </span>
            );
          })}
        </div>
      </motion.div>

      <motion.p variants={fadeUp} className="mt-6 font-mono text-xs tracking-[0.3em] text-best-300 uppercase">
        Quiz · BEST Cluj-Napoca
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="mt-3 font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-7xl"
      >
        Ce tip de <ShimmerText>BESTan</ShimmerText> ești?
      </motion.h1>
      <motion.p variants={fadeUp} className="mt-5 text-lg text-white/70">
        {questions} întrebări · {games} mini-jocuri · aproximativ 2 minute
      </motion.p>

      <motion.div variants={fadeUp} className="mt-9">
        <Button onClick={onStart} size="xl">
          Start <Rocket className="size-5" />
        </Button>
      </motion.div>
      <motion.p variants={fadeUp} className="mt-4 hidden font-mono text-xs text-white/40 sm:block">
        sau apasă Enter ↵
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-2">
        {ARCHETYPE_IDS.map((id) => (
          <motion.span
            key={id}
            whileHover={{ y: -4, scale: 1.05 }}
            transition={springs.snappy}
            className="glass rounded-full px-4 py-2 text-sm text-white/80"
          >
            {ARCHETYPES[id].emoji} {ARCHETYPES[id].short}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
