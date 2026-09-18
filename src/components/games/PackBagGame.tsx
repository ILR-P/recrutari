"use client";

import { LayoutGroup, motion, useAnimate, type PanInfo } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { PackGameStep } from "@/data/quiz";
import { springs } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { mergeScores } from "@/lib/quiz-engine";
import type { GameResult } from "./GameShell";

type Item = PackGameStep["items"][number];

/** Mini-joc drag & drop: tragi obiecte în rucsac (sau le atingi) până se umple. */
export function PackBagGame({ step, onFinish }: { step: PackGameStep; onFinish: (r: GameResult) => void }) {
  const [packed, setPacked] = useState<string[]>([]);
  const [hot, setHot] = useState(false);
  const [bag, animateBag] = useAnimate<HTMLDivElement>();
  const full = packed.length >= step.capacity;

  const shakeBag = () => {
    if (bag.current) animateBag(bag.current, { x: [0, -14, 14, -8, 8, 0] }, { duration: 0.45 });
  };

  // Verificăm în updater: după un drag, onDragEnd și onTap pot rula în același tick.
  const pack = (id: string) => {
    if (packed.includes(id)) return;
    if (full) return shakeBag();
    setPacked((list) => (list.includes(id) || list.length >= step.capacity ? list : [...list, id]));
  };

  const unpack = (id: string) => setPacked((list) => list.filter((x) => x !== id));

  // info.point e în coordonate de pagină; getBoundingClientRect e relativ la viewport.
  const overBag = (info: PanInfo) => {
    const rect = bag.current?.getBoundingClientRect();
    if (!rect) return false;
    const x = info.point.x - window.scrollX;
    const y = info.point.y - window.scrollY;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const close = () => {
    const chosen = step.items.filter((item) => packed.includes(item.id));
    onFinish({
      delta: mergeScores(chosen.map((item) => item.scores)),
      headline: "Rucsacul e gata de drum! ✈️",
      detail: `Ai luat: ${chosen.map((item) => `${item.emoji} ${item.label}`).join(", ")}`,
    });
  };

  const half = Math.ceil(step.items.length / 2);
  const columns = [step.items.slice(0, half), step.items.slice(half)];

  const renderItem = (item: Item) => {
    const isPacked = packed.includes(item.id);
    if (isPacked) {
      return (
        <div
          key={item.id}
          className="grid h-24 place-items-center rounded-2xl border-2 border-dashed border-white/10 text-3xl opacity-25 grayscale sm:h-28"
        >
          {item.emoji}
        </div>
      );
    }
    return (
      <motion.div
        key={item.id}
        className="glass relative z-10 flex h-24 cursor-grab touch-none flex-col items-center justify-center gap-1 rounded-2xl select-none will-change-transform active:cursor-grabbing sm:h-28"
        drag
        dragSnapToOrigin
        dragElastic={1}
        whileDrag={{ scale: 1.2, rotate: 8, zIndex: 50 }}
        whileHover={{ y: -5 }}
        onDrag={(_, info) => {
          const over = overBag(info);
          if (over !== hot) setHot(over);
        }}
        onDragEnd={(_, info) => {
          setHot(false);
          if (overBag(info)) pack(item.id);
        }}
        onTap={() => pack(item.id)}
      >
        <motion.span layoutId={`pack-${item.id}`} className="text-4xl sm:text-5xl">
          {item.emoji}
        </motion.span>
        <span className="text-xs text-white/70">{item.label}</span>
      </motion.div>
    );
  };

  return (
    <LayoutGroup>
      <div className="flex flex-col items-center gap-6">
        <p className="text-center font-mono text-sm text-white/60">
          Trage obiectele în rucsac sau atinge-le · {packed.length}/{step.capacity}
        </p>

        <div className="grid w-full items-center gap-5 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          <div className="grid grid-cols-4 gap-3 md:grid-cols-2">{columns[0].map(renderItem)}</div>

          <motion.div
            ref={bag}
            className={cn(
              "relative mx-auto flex size-60 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed transition-colors sm:size-64",
              hot ? "border-best-300 bg-best-500/25" : "border-white/25 bg-white/5",
            )}
            animate={{ scale: hot ? 1.06 : 1 }}
            transition={springs.snappy}
          >
            <span className={cn("text-7xl will-change-transform", hot && "animate-wiggle")}>🎒</span>
            <div className="mt-3 flex min-h-14 flex-wrap justify-center gap-2 px-4">
              {packed.map((id) => {
                const item = step.items.find((i) => i.id === id)!;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    layoutId={`pack-${id}`}
                    onClick={() => unpack(id)}
                    aria-label={`Scoate ${item.label} din rucsac`}
                    className="grid size-14 cursor-pointer place-items-center rounded-2xl bg-white/15 text-3xl"
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    transition={springs.bouncy}
                  >
                    {item.emoji}
                  </motion.button>
                );
              })}
            </div>
            <div className="absolute bottom-4 flex gap-1.5">
              {Array.from({ length: step.capacity }, (_, i) => (
                <motion.span
                  key={i}
                  className="size-2.5 rounded-full"
                  animate={{ backgroundColor: i < packed.length ? "#c4a1ff" : "rgba(255,255,255,0.2)", scale: i < packed.length ? 1.2 : 1 }}
                />
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-4 gap-3 md:grid-cols-2">{columns[1].map(renderItem)}</div>
        </div>

        <motion.div animate={{ opacity: full ? 1 : 0.4, scale: full ? 1 : 0.95 }}>
          <Button onClick={close} disabled={!full} size="lg">
            Închide rucsacul <Check className="size-5" />
          </Button>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}
