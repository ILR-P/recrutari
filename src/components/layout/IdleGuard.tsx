"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useEffectEvent, useState } from "react";
import { SITE } from "@/data/site";
import { useIdle } from "@/hooks/useIdle";
import { springs } from "@/lib/animations";
import { useStandData } from "@/lib/stand-stats";

/**
 * Pentru stand: după un minut fără activitate apare „Mai ești aici?” cu o
 * numărătoare inversă, apoi `onTimeout` pregătește ecranul pentru următorul student.
 * Orice atingere anulează numărătoarea.
 */
export function IdleGuard({ onTimeout }: { onTimeout: () => void }) {
  const { idleEnabled } = useStandData();
  const { idle, dismiss } = useIdle(SITE.idleTimeoutSec * 1000, idleEnabled);

  return <AnimatePresence>{idle && <IdleOverlay onStay={dismiss} onTimeout={onTimeout} />}</AnimatePresence>;
}

function IdleOverlay({ onStay, onTimeout }: { onStay: () => void; onTimeout: () => void }) {
  const total: number = SITE.idleCountdownSec;
  const [left, setLeft] = useState(total);
  const fireTimeout = useEffectEvent(onTimeout);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const remaining = Math.max(0, total - Math.floor((Date.now() - start) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        fireTimeout();
      }
    }, 200);
    return () => clearInterval(id);
  }, [total]);

  const circumference = 2 * Math.PI * 44;

  return (
    <motion.div
      className="fixed inset-0 z-70 grid place-items-center bg-ink/80 p-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onStay}
    >
      <motion.div
        className="glass flex max-w-sm flex-col items-center gap-5 rounded-3xl p-8 text-center"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={springs.bouncy}
      >
        <div className="relative size-28">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#a26cff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - left / total) }}
              transition={{ duration: 0.3 }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-4xl font-bold">{left}</span>
        </div>
        <h2 className="font-display text-2xl font-bold">Mai ești aici? 👀</h2>
        <p className="text-white/65">Dacă nu atingi ecranul, o luăm de la capăt pentru următorul student.</p>
        <button
          type="button"
          onClick={onStay}
          className="h-12 cursor-pointer rounded-full bg-white px-6 font-display font-semibold text-ink"
        >
          Sunt aici!
        </button>
      </motion.div>
    </motion.div>
  );
}

/** Pe landing: după o perioadă de inactivitate, pagina revine lin sus, la hero. */
export function IdleScrollTop() {
  const { idleEnabled } = useStandData();
  const { idle } = useIdle(SITE.landingIdleSec * 1000, idleEnabled);

  useEffect(() => {
    if (idle && window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idle]);

  return null;
}
