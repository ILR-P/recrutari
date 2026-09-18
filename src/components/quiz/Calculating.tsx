"use client";

import { motion } from "motion/react";
import { useEffect, useEffectEvent } from "react";
import { Morisca } from "@/components/ui/Morisca";
import { staggerContainer } from "@/lib/animations";

const DURATION_MS = 3200;

const LINES = [
  "> pornim scanerul de BESTani...",
  "> analizăm răspunsurile........ ✓",
  "> numărăm ștampilele din pașaport ✓",
  "> măsurăm energia de la petreceri ✓",
  "> calibrăm ochiul pentru design... ✓",
  "> compilăm rezultatul......... 100%",
];

const typeLine = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show: { clipPath: "inset(0 0% 0 0)", opacity: 1, transition: { duration: 0.35, ease: "linear" as const } },
};

/** Suspansul dinaintea rezultatului: un „terminal” care tastează și o morișcă tot mai rapidă. */
export function Calculating({ onDone }: { onDone: () => void }) {
  const finish = useEffectEvent(onDone);

  useEffect(() => {
    const id = setTimeout(() => finish(), DURATION_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      className="flex w-full max-w-lg flex-col items-center gap-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.25, transition: { duration: 0.4 } }}
    >
      <div className="relative grid place-items-center">
        {/* Strălucirea e un gradient static în spate; o umbră pe morișca ce se rotește s-ar redesena la fiecare cadru */}
        <div className="absolute size-56 rounded-full bg-[radial-gradient(circle,rgba(162,108,255,0.55)_0%,transparent_65%)] sm:size-72" />
        <Morisca
          palette="archetypes"
          className="relative size-28 will-change-transform sm:size-36"
          animate={{ rotate: 2160 }}
          transition={{ duration: DURATION_MS / 1000, ease: [0.55, 0, 0.85, 0.35] }}
        />
      </div>

      <div className="glass relative w-full overflow-hidden rounded-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-3 rounded-full bg-rose-400/80" />
          <span className="size-3 rounded-full bg-amber-400/80" />
          <span className="size-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-white/40">bestan-scanner.sh</span>
        </div>
        <motion.div
          className="space-y-1.5 p-5 font-mono text-xs text-lime-300/90 sm:text-sm"
          variants={staggerContainer(0.45, 0.2)}
          initial="hidden"
          animate="show"
        >
          {LINES.map((line) => (
            <motion.p key={line} variants={typeLine} className="whitespace-pre">
              {line}
            </motion.p>
          ))}
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-scan bg-linear-to-b from-transparent via-best-400/20 to-transparent" />
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full origin-left bg-linear-to-r from-best-400 via-fuchsia-400 to-lime-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: DURATION_MS / 1000 - 0.2, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.p
        className="font-display text-2xl font-semibold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Calculăm vibe-ul tău…
      </motion.p>
    </motion.div>
  );
}
