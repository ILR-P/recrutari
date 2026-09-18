"use client";

import { motion } from "motion/react";
import { ArrowRight, House, RotateCcw, Zap } from "lucide-react";
import { Fragment, useEffect, useEffectEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ARCHETYPES, type ArchetypeId } from "@/data/archetypes";
import { easeOut, fadeUp, springs, staggerContainer } from "@/lib/animations";
import { rankArchetypes, toPercentages, type ScoreBoard } from "@/lib/quiz-engine";
import { BestanIdCard } from "./BestanIdCard";
import { celebrate } from "./celebrate";
import { ScoreBreakdown } from "./ScoreBreakdown";

type Props = {
  archetypeId: ArchetypeId;
  scores: ScoreBoard;
  bestanNo: number;
  issuedAt: string;
  onRestart: () => void;
};

export function ResultReveal({ archetypeId, scores, bestanNo, issuedAt, onRestart }: Props) {
  const archetype = ARCHETYPES[archetypeId];
  const percentages = toPercentages(scores);
  const rows = rankArchetypes(scores, archetypeId).map((id) => ({
    id,
    percent: percentages[id],
    highlight: id === archetypeId,
  }));

  const fireConfetti = () => celebrate([...archetype.colors, "#ffffff", "#a26cff"], archetype.emoji);
  const fireOnMount = useEffectEvent(fireConfetti);
  useEffect(() => {
    const stopCannons = fireOnMount();
    return stopCannons;
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-6xl"
      variants={staggerContainer(0.12, 0.2)}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[44rem] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: archetype.colors[0] }}
      />

      <div className="text-center">
        <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.35em] text-white/60 uppercase">
          Rezultatul tău
        </motion.p>
        <motion.button
          type="button"
          onClick={fireConfetti}
          aria-label="Încă o rundă de confetti"
          className="mt-3 inline-block cursor-pointer text-8xl sm:text-9xl"
          initial={{ scale: 0, rotate: -200 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...springs.bouncy, delay: 0.15 }}
          whileHover={{ scale: 1.15, rotate: 12 }}
          whileTap={{ scale: 0.85 }}
        >
          {archetype.emoji}
        </motion.button>
        <h1 className="mt-4 font-display font-bold tracking-tight">
          <motion.span variants={fadeUp} className="block text-2xl text-white/75 sm:text-3xl">
            Tu ești…
          </motion.span>
          <AnimatedName text={archetype.name} colors={archetype.colors} />
        </h1>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-xl text-balance text-white/80">
          {archetype.tagline}
        </motion.p>
      </div>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
        <div className="mx-auto lg:sticky lg:top-28">
          <BestanIdCard archetypeId={archetypeId} bestanNo={bestanNo} issuedAt={issuedAt} />
          <p className="mt-4 text-center font-mono text-xs text-white/40">📸 fă-i o poză legitimației tale</p>
        </div>

        <div className="space-y-9">
          <motion.p variants={fadeUp} className="text-lg leading-relaxed text-white/80">
            {archetype.description}
          </motion.p>

          <motion.div variants={fadeUp}>
            <h2 className="font-mono text-xs tracking-[0.3em] text-best-300 uppercase">Superputeri</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {archetype.superpowers.map((power) => (
                <motion.span
                  key={power}
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium"
                  style={{ borderColor: `${archetype.colors[0]}88`, background: `${archetype.colors[0]}18` }}
                >
                  <Zap className="size-4" style={{ color: archetype.colors[0] }} /> {power}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="font-mono text-xs tracking-[0.3em] text-best-300 uppercase">Unde te vedem în BEST</h2>
            <ul className="mt-3 space-y-2">
              {archetype.whereInBest.map((place) => (
                <li key={place} className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                  <ArrowRight className="size-4 shrink-0" style={{ color: archetype.colors[0] }} />
                  {place}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="mb-4 font-mono text-xs tracking-[0.3em] text-best-300 uppercase">Profilul tău complet</h2>
            <ScoreBreakdown rows={rows} delay={0.6} />
          </motion.div>
        </div>
      </div>

      <motion.div variants={fadeUp} className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button onClick={onRestart} size="xl">
          <RotateCcw className="size-5" /> Următorul student
        </Button>
        <Button href="/" size="xl" variant="ghost">
          <House className="size-5" /> Descoperă BEST
        </Button>
      </motion.div>
    </motion.div>
  );
}

/** Numele arhetipului apare literă cu literă, cu gradientul arhetipului. */
function AnimatedName({ text, colors }: { text: string; colors: [string, string] }) {
  const letter = {
    hidden: { y: "0.6em", opacity: 0, rotateX: -90 },
    show: { y: "0em", opacity: 1, rotateX: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <motion.span
      className="mt-1 block text-5xl leading-[1.05] sm:text-7xl lg:text-8xl"
      variants={staggerContainer(0.035, 0.1)}
    >
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={letter}
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                  backgroundSize: `${word.length * 100}% 100%`,
                  backgroundPosition: `${word.length > 1 ? (i / (word.length - 1)) * 100 : 0}% 0`,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </Fragment>
      ))}
    </motion.span>
  );
}
