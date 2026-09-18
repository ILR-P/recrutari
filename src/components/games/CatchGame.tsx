"use client";

import { motion, useAnimate, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import { Timer, Trophy } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { ArchetypeId } from "@/data/archetypes";
import type { CatchGameStep, Scores } from "@/data/quiz";
import { cn } from "@/lib/cn";
import { getStandData, recordCatchScore, useStandData } from "@/lib/stand-stats";
import type { GameResult } from "./GameShell";

type Falling = { id: number; emoji: string; archetype: ArchetypeId | null; x: number; y: number; speed: number; spin: number; rot: number };
type Pop = { id: number; x: number; y: number; text: string; good: boolean; born: number };

const ITEM_SIZE = 44;
const BASKET_W = 104;
const BASKET_H = 52;
const HAZARD_CHANCE = 0.22;
const HAZARD_PENALTY = 2;

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Mini-joc „Prinde-le pe toate”: muți coșul cu degetul, cu mouse-ul sau cu săgețile. */
export function CatchGame({ step, onFinish }: { step: CatchGameStep; onFinish: (r: GameResult) => void }) {
  const [arena, animateArena] = useAnimate<HTMLDivElement>();
  const [items, setItems] = useState<Falling[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(step.durationSec);
  const record = useStandData().catchRecord;

  // Starea jocului stă în ref-uri ca bucla de animație să nu depindă de re-render-uri.
  const game = useRef({
    running: true,
    elapsed: 0,
    lastSpawn: 0,
    nextId: 0,
    score: 0,
    hazardsHit: 0,
    target: 0.5,
    pos: 0.5,
    catches: {} as Partial<Record<ArchetypeId, number>>,
    falling: [] as Falling[],
    pops: [] as Pop[],
  });
  const keys = useRef({ left: false, right: false });

  const basketX = useMotionValue(0.5);
  const basketTilt = useMotionValue(0);
  const basketLeft = useTransform(basketX, (v) => `${v * 100}%`);

  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = down;
      else if (e.key === "ArrowRight" || e.key === "d") keys.current.right = down;
      else return;
      e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  const end = () => {
    const g = game.current;
    g.running = false;
    const delta: Scores = {};
    for (const [id, count] of Object.entries(g.catches) as [ArchetypeId, number][]) {
      delta[id] = Math.min(step.maxPointsPerArchetype, count * step.pointsPerCatch);
    }
    const isRecord = recordCatchScore(g.score);
    onFinish({
      delta,
      headline: isRecord ? `🏆 Record nou: ${g.score} puncte!` : `${g.score} puncte!`,
      detail: isRecord
        ? "Ești noul campion al standului. Spune-le și prietenilor!"
        : `Recordul standului: ${getStandData().catchRecord} puncte · Restanțe prinse: ${g.hazardsHit}`,
    });
  };

  useAnimationFrame((_, deltaMs) => {
    const g = game.current;
    const el = arena.current;
    if (!g.running || !el) return;

    const dt = Math.min(deltaMs, 50) / 1000;
    const width = el.clientWidth;
    const height = el.clientHeight;
    g.elapsed += dt;
    const progress = Math.min(1, g.elapsed / step.durationSec);

    // Coșul: tastatura mută ținta, iar coșul o urmează lin.
    if (keys.current.left) g.target = Math.max(0.06, g.target - 1.3 * dt);
    if (keys.current.right) g.target = Math.min(0.94, g.target + 1.3 * dt);
    const previous = g.pos;
    g.pos += (g.target - g.pos) * Math.min(1, dt * 16);
    basketX.set(g.pos);
    basketTilt.set(Math.max(-20, Math.min(20, ((g.pos - previous) / dt) * 14)));

    // Obiectele apar tot mai des și cad tot mai repede.
    if (g.elapsed - g.lastSpawn > 0.62 - progress * 0.3) {
      g.lastSpawn = g.elapsed;
      const hazard = Math.random() < HAZARD_CHANCE;
      const source = hazard ? { ...pick(step.hazards), archetype: null } : pick(step.items);
      g.falling.push({
        id: g.nextId++,
        emoji: source.emoji,
        archetype: source.archetype,
        x: 0.08 + Math.random() * 0.84,
        y: -ITEM_SIZE,
        speed: 0.34 + Math.random() * 0.22 + progress * 0.32,
        spin: (Math.random() - 0.5) * 220,
        rot: 0,
      });
    }

    const basketTop = height - BASKET_H - 16;
    const reach = (BASKET_W / 2 + ITEM_SIZE * 0.3) / width;
    const stillFalling: Falling[] = [];

    for (const item of g.falling) {
      item.y += item.speed * height * dt;
      item.rot += item.spin * dt;
      const bottom = item.y + ITEM_SIZE;
      const inBasket = bottom >= basketTop + 6 && item.y <= basketTop + 20 && Math.abs(item.x - g.pos) <= reach;

      if (inBasket) {
        const good = item.archetype !== null;
        if (good) {
          g.score += 1;
          g.catches[item.archetype!] = (g.catches[item.archetype!] ?? 0) + 1;
        } else {
          g.score = Math.max(0, g.score - HAZARD_PENALTY);
          g.hazardsHit += 1;
          animateArena(el, { x: [0, -12, 12, -7, 7, 0] }, { duration: 0.35 });
        }
        g.pops.push({
          id: item.id,
          x: item.x,
          y: basketTop - 24,
          text: good ? "+1" : `-${HAZARD_PENALTY} Restanță!`,
          good,
          born: g.elapsed,
        });
        setScore(g.score);
        continue;
      }
      if (item.y < height) stillFalling.push(item);
    }

    g.falling = stillFalling;
    g.pops = g.pops.filter((p) => g.elapsed - p.born < 0.75);
    setItems(stillFalling.map((item) => ({ ...item })));
    setPops([...g.pops]);
    setTimeLeft(Math.max(0, Math.ceil(step.durationSec - g.elapsed)));

    if (g.elapsed >= step.durationSec) end();
  });

  const steer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    game.current.target = Math.max(0.06, Math.min(0.94, (e.clientX - rect.left) / rect.width));
  };

  const urgent = timeLeft <= 5;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between font-display">
        <div className="text-3xl font-bold tabular-nums sm:text-4xl">
          {score} <span className="text-base font-medium text-white/50">puncte</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-sm text-white/50 sm:flex">
            <Trophy className="size-4" /> record: {record}
          </span>
          <motion.span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xl font-bold tabular-nums",
              urgent ? "bg-rose-500/25 text-rose-300" : "bg-white/10",
            )}
            animate={urgent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, repeat: urgent ? Infinity : 0 }}
          >
            <Timer className="size-5" /> {timeLeft}s
          </motion.span>
        </div>
      </div>

      <div
        ref={arena}
        onPointerMove={steer}
        onPointerDown={steer}
        className="glass relative h-[58svh] max-h-140 min-h-90 w-full cursor-none touch-none overflow-hidden rounded-3xl select-none"
      >
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-best-600/30 to-transparent" />

        <motion.p
          className="pointer-events-none absolute inset-x-0 top-1/3 text-center font-mono text-sm text-white/60"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          ← mișcă degetul sau mouse-ul →
        </motion.p>

        {items.map((item) => (
          <span
            key={item.id}
            className={cn(
              "absolute top-0 left-0 leading-none will-change-transform",
              item.archetype === null && "drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]",
            )}
            style={{
              fontSize: ITEM_SIZE - 6,
              left: `${item.x * 100}%`,
              transform: `translate(-50%, ${item.y}px) rotate(${item.rot}deg)`,
            }}
          >
            {item.emoji}
          </span>
        ))}

        {pops.map((pop) => (
          <motion.span
            key={pop.id}
            className={cn(
              "pointer-events-none absolute -translate-x-1/2 font-display text-xl font-bold whitespace-nowrap",
              pop.good ? "text-lime-300" : "text-rose-400",
            )}
            style={{ left: `${pop.x * 100}%`, top: pop.y }}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -70, scale: 1.3 }}
            transition={{ duration: 0.75 }}
          >
            {pop.text}
          </motion.span>
        ))}

        <motion.div
          className="absolute bottom-4 -translate-x-1/2"
          style={{ left: basketLeft, rotate: basketTilt, width: BASKET_W, height: BASKET_H }}
        >
          <div className="relative size-full">
            <div className="absolute inset-x-0 top-0 h-3 rounded-full bg-best-200 shadow-[0_0_20px_rgba(217,199,255,0.8)]" />
            <div className="absolute inset-x-1.5 top-2 bottom-0 grid place-items-center rounded-b-3xl bg-linear-to-b from-best-500 to-best-800 font-mono text-xs font-bold tracking-widest">
              BEST
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
