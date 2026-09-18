"use client";

import { motion } from "motion/react";
import { useEffect, useEffectEvent, useState } from "react";
import { ARCHETYPES } from "@/data/archetypes";
import type { ChoiceOption, QuestionStep, Scores } from "@/data/quiz";
import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import { easeOut, pulseSelect, questionEntrances, springs, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { dominantArchetype } from "@/lib/quiz-engine";

const optionVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: springs.bouncy },
};

type Props = { step: QuestionStep; index: number; onAnswer: (scores: Scores) => void };

export function QuestionCard({ step, index, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const later = useSafeTimeout();
  const entrance = questionEntrances[index % questionEntrances.length];

  const choose = (option: ChoiceOption) => {
    if (selected) return;
    setSelected(option.id);
    later(() => onAnswer(option.scores), 700);
  };

  // Tastele 1–9 aleg opțiunea corespunzătoare (util pe laptopurile de la stand).
  const chooseByKey = useEffectEvent((key: string) => {
    const option = step.options[Number(key) - 1];
    if (option) choose(option);
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => chooseByKey(e.key);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isEmoji = step.variant === "emoji";

  return (
    <motion.div className="w-full max-w-4xl" variants={entrance} initial="hidden" animate="show" exit="exit">
      <h2 className="text-center font-display text-3xl leading-tight font-bold text-balance sm:text-5xl">
        {step.prompt}
      </h2>
      {step.hint && <p className="mt-3 text-center text-white/60">{step.hint}</p>}

      <motion.div
        className={cn(
          "mx-auto mt-8 grid gap-3 sm:mt-10 sm:gap-4",
          isEmoji ? "max-w-2xl grid-cols-2 sm:grid-cols-3" : "max-w-3xl sm:grid-cols-2",
        )}
        variants={staggerContainer(0.08, 0.3)}
        initial="hidden"
        animate="show"
      >
        {step.options.map((option, i) => {
          const isSelected = selected === option.id;
          const dimmed = selected !== null && !isSelected;
          const color = ARCHETYPES[dominantArchetype(option.scores)].colors[0];

          return (
            <motion.button
              key={option.id}
              type="button"
              variants={optionVariants}
              onClick={() => choose(option)}
              disabled={selected !== null}
              whileHover={selected ? undefined : { y: -6, scale: 1.02 }}
              whileTap={selected ? undefined : { scale: 0.96 }}
              animate={
                isSelected
                  ? { ...pulseSelect, y: -8, boxShadow: `0 0 50px -10px ${color}` }
                  : dimmed
                    ? { opacity: 0.25, scale: 0.94, filter: "grayscale(1)" }
                    : undefined
              }
              style={isSelected ? { borderColor: color } : undefined}
              className={cn(
                "group glass relative flex cursor-pointer items-center rounded-3xl border-2 border-white/10 text-left transition-colors hover:border-best-300/60 hover:bg-white/10 disabled:cursor-default",
                isEmoji ? "flex-col justify-center gap-2 px-3 py-6 text-center" : "min-h-22 gap-4 p-4 sm:p-5",
              )}
            >
              <span
                className={cn(
                  "grid shrink-0 place-items-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
                  isEmoji ? "text-6xl sm:text-7xl" : "size-14 rounded-2xl bg-white/10 text-3xl",
                )}
              >
                {option.emoji}
              </span>
              <span className={cn("font-medium", isEmoji ? "text-sm text-white/75" : "flex-1 text-base sm:text-lg")}>
                {option.label}
              </span>
              {!isEmoji && (
                <span className="hidden size-7 shrink-0 place-items-center rounded-lg border border-white/15 font-mono text-xs text-white/40 sm:grid">
                  {i + 1}
                </span>
              )}
              {isSelected && <Burst color={color} />}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/** Mică explozie de particule în jurul opțiunii alese. */
function Burst({ color }: { color: string }) {
  const count = 12;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute size-2.5 rounded-full"
            style={{ background: i % 2 ? color : "#ffffff" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 150, y: Math.sin(angle) * 80, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.7, ease: easeOut }}
          />
        );
      })}
    </span>
  );
}
