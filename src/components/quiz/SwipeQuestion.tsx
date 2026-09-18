"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { Check, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Scores, SwipeStep } from "@/data/quiz";
import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import { questionEntrances, springs } from "@/lib/animations";
import { mergeScores } from "@/lib/quiz-engine";

type Statement = SwipeStep["statements"][number];
type Direction = 1 | -1;

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 600;

const cardVariants = {
  exit: (dir: Direction) => ({ x: dir * 520, rotate: dir * 28, opacity: 0, transition: { duration: 0.35 } }),
};

/** Carduri în stil Tinder: glisezi la dreapta pentru DA și la stânga pentru NU. */
export function SwipeQuestion({ step, index, onAnswer }: { step: SwipeStep; index: number; onAnswer: (s: Scores) => void }) {
  const [position, setPosition] = useState(0);
  const [dir, setDir] = useState<Direction>(1);
  const yes = useRef<Scores[]>([]);
  const later = useSafeTimeout();
  const total = step.statements.length;

  const decide = (d: Direction) => {
    if (position >= total) return;
    if (d === 1) yes.current.push(step.statements[position].scores);
    setDir(d);
    setPosition(position + 1);
    if (position + 1 >= total) later(() => onAnswer(mergeScores(yes.current)), 450);
  };

  const decideByKey = useEffectEvent((key: string) => {
    if (key === "ArrowRight") decide(1);
    if (key === "ArrowLeft") decide(-1);
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => decideByKey(e.key);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = step.statements.slice(position, position + 3);

  return (
    <motion.div
      className="flex w-full max-w-xl flex-col items-center"
      variants={questionEntrances[index % questionEntrances.length]}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <h2 className="text-center font-display text-3xl font-bold sm:text-5xl">{step.prompt}</h2>
      {step.hint && <p className="mt-3 font-mono text-sm text-white/55">{step.hint}</p>}

      <div className="relative mt-8 h-80 w-full max-w-sm sm:h-96">
        <AnimatePresence custom={dir}>
          {visible
            .map((statement, depth) => (
              <SwipeCard key={statement.id} statement={statement} depth={depth} onDecide={decide} />
            ))
            .reverse()}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <motion.button
          type="button"
          aria-label="Nu"
          onClick={() => decide(-1)}
          whileHover={{ scale: 1.1, rotate: -8 }}
          whileTap={{ scale: 0.85 }}
          className="grid size-16 cursor-pointer place-items-center rounded-full border-2 border-rose-400/70 bg-rose-500/10 text-rose-300"
        >
          <X className="size-7" />
        </motion.button>
        <span className="font-mono text-sm text-white/50 tabular-nums">
          {Math.min(position + 1, total)}/{total}
        </span>
        <motion.button
          type="button"
          aria-label="Da"
          onClick={() => decide(1)}
          whileHover={{ scale: 1.1, rotate: 8 }}
          whileTap={{ scale: 0.85 }}
          className="grid size-16 cursor-pointer place-items-center rounded-full border-2 border-emerald-400/70 bg-emerald-500/10 text-emerald-300"
        >
          <Check className="size-7" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function SwipeCard({
  statement,
  depth,
  onDecide,
}: {
  statement: Statement;
  depth: number;
  onDecide: (d: Direction) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-18, 18]);
  const yesOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1]);
  const noOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0]);
  const isTop = depth === 0;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onDecide(1);
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onDecide(-1);
  };

  return (
    <motion.div
      className="absolute inset-0 flex touch-none flex-col items-center justify-center gap-5 rounded-[2rem] border border-white/15 bg-linear-to-br from-ink-3 to-ink-2 p-8 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] select-none"
      style={{ x, rotate, zIndex: 10 - depth, cursor: isTop ? "grab" : "default" }}
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      initial={{ scale: 0.8, y: 50, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.06, y: depth * 18, opacity: depth > 1 ? 0.6 : 1 }}
      transition={springs.soft}
      variants={cardVariants}
      exit="exit"
    >
      <motion.span
        className="absolute top-6 left-6 -rotate-12 rounded-xl border-4 border-emerald-400 px-3 py-1 font-display text-2xl font-black text-emerald-400"
        style={{ opacity: yesOpacity }}
      >
        DA ✓
      </motion.span>
      <motion.span
        className="absolute top-6 right-6 rotate-12 rounded-xl border-4 border-rose-400 px-3 py-1 font-display text-2xl font-black text-rose-400"
        style={{ opacity: noOpacity }}
      >
        NU ✗
      </motion.span>
      <span className="text-7xl sm:text-8xl">{statement.emoji}</span>
      <p className="font-display text-2xl leading-snug font-semibold text-balance sm:text-3xl">{statement.text}</p>
    </motion.div>
  );
}
