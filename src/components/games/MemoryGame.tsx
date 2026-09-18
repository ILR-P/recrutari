"use client";

import { AnimatePresence, motion } from "motion/react";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { Morisca } from "@/components/ui/Morisca";
import { PROJECTS } from "@/data/projects";
import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import { springs } from "@/lib/animations";
import { cn } from "@/lib/cn";

/** Proiectele folosite în joc (câte o pereche: nume ↔ descriere scurtă). */
const PAIR_IDS = ["jobshop", "coderun", "battlelab", "courses"];

type MemoryCard = { key: string; pairId: string; color: string; big: string; small: string; isName: boolean };

function buildDeck(): MemoryCard[] {
  return PROJECTS.filter((p) => PAIR_IDS.includes(p.id)).flatMap((p) => [
    { key: `${p.id}-name`, pairId: p.id, color: p.color, big: p.name, small: p.tag, isName: true },
    { key: `${p.id}-hint`, pairId: p.id, color: p.color, big: p.hint.emoji, small: p.hint.text, isName: false },
  ]);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MemoryGame({ onWin }: { onWin: (moves: number) => void }) {
  const [deck, setDeck] = useState(buildDeck);
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const locked = useRef(false);
  const later = useSafeTimeout();

  const start = () => {
    setDeck(shuffle(buildDeck()));
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setStarted(true);
  };

  const flip = (i: number) => {
    if (!started || locked.current || open.includes(i) || matched.includes(deck[i].pairId)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;

    const totalMoves = moves + 1;
    setMoves(totalMoves);
    const [a, b] = next;
    if (deck[a].pairId === deck[b].pairId) {
      const nowMatched = [...matched, deck[a].pairId];
      setMatched(nowMatched);
      setOpen([]);
      if (nowMatched.length === PAIR_IDS.length) later(() => onWin(totalMoves), 700);
    } else {
      locked.current = true;
      setWrong(next);
      later(() => {
        setOpen([]);
        setWrong([]);
        locked.current = false;
      }, 950);
    }
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between font-mono text-sm text-white/60">
        <span>
          Perechi: {matched.length}/{PAIR_IDS.length}
        </span>
        <span>Mutări: {moves}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 perspective-distant sm:grid-cols-4 sm:gap-4">
        {deck.map((card, i) => {
          const isMatched = matched.includes(card.pairId);
          const faceUp = isMatched || open.includes(i);
          return (
            <motion.button
              key={card.key}
              type="button"
              layout
              onClick={() => flip(i)}
              aria-label={faceUp ? `${card.big}: ${card.small}` : "Carte ascunsă"}
              className="relative h-32 cursor-pointer rounded-2xl transform-3d will-change-transform sm:h-44"
              animate={{
                rotateY: faceUp ? 180 : 0,
                x: wrong.includes(i) ? [0, -10, 10, -6, 6, 0] : 0,
                scale: isMatched ? [1, 1.08, 1] : 1,
              }}
              transition={{ rotateY: springs.soft, x: { duration: 0.45 }, scale: { duration: 0.4 } }}
              whileHover={started && !faceUp ? { y: -6 } : undefined}
            >
              {/* Spatele cărții (ascunsă) */}
              <span className="absolute inset-0 grid place-items-center overflow-hidden rounded-2xl border border-white/15 bg-linear-to-br from-best-700 to-best-950 backface-hidden">
                <span className="absolute inset-0 grid-bg opacity-40" />
                <Morisca className="relative size-12 opacity-80 sm:size-16" />
              </span>
              {/* Fața cărții */}
              <span
                className={cn(
                  "absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center backface-hidden",
                  isMatched && "shadow-[0_0_30px_-5px_var(--glow)]",
                )}
                style={
                  {
                    background: `linear-gradient(150deg, ${card.color}33, #140a26 70%)`,
                    borderColor: isMatched ? card.color : `${card.color}55`,
                    "--glow": card.color,
                  } as React.CSSProperties
                }
              >
                <span className={cn("font-display font-bold", card.isName ? "text-lg sm:text-xl" : "text-4xl sm:text-5xl")}>
                  {card.big}
                </span>
                <span className="text-xs text-white/65 sm:text-sm">{card.small}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 top-9 grid place-items-center rounded-3xl bg-ink/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            {/* Plutirea e CSS (GPU); hover/tap rămân pe butonul din interior */}
            <span className="animate-bob will-change-transform">
              <motion.button
                type="button"
                onClick={start}
                className="flex h-16 cursor-pointer items-center gap-3 rounded-full bg-white px-8 font-display text-lg font-bold text-ink shadow-[0_0_60px_-10px_rgba(162,108,255,0.9)]"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                <Play className="size-5 fill-current" /> Începe jocul
              </motion.button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
