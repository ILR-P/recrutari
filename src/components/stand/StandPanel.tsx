"use client";

import { motion } from "motion/react";
import { House, Maximize, Minimize, Play, Sun, Timer, Trash2, Trophy, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ScoreBreakdown } from "@/components/results/ScoreBreakdown";
import { Button } from "@/components/ui/Button";
import { ARCHETYPE_IDS } from "@/data/archetypes";
import { SITE } from "@/data/site";
import { useWakeLock } from "@/hooks/useWakeLock";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { toPercentages, type ScoreBoard } from "@/lib/quiz-engine";
import { resetStandStats, setIdleEnabled, useStandData } from "@/lib/stand-stats";

/** Panoul voluntarilor: statistici pe dispozitiv și setări pentru ecranul de la stand. */
export function StandPanel() {
  const data = useStandData();
  const wakeLock = useWakeLock();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Unele browsere (ex. Safari pe iPhone) nu permit fullscreen pe pagini web.
    }
  };

  const reset = () => {
    if (window.confirm("Ștergi statisticile de pe acest dispozitiv?")) resetStandStats();
  };

  const board = Object.fromEntries(ARCHETYPE_IDS.map((id) => [id, data.results[id] ?? 0])) as ScoreBoard;
  const percentages = toPercentages(board);
  const rows = [...ARCHETYPE_IDS]
    .sort((a, b) => board[b] - board[a])
    .map((id) => ({ id, percent: data.total ? percentages[id] : 0, note: `(${board[id]})` }));

  return (
    <motion.main
      className="mx-auto w-full max-w-5xl px-4 pt-28 pb-16"
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <p className="font-mono text-xs tracking-[0.3em] text-best-300 uppercase">Doar pentru voluntari 🤫</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Panoul standului</h1>
        <p className="mt-3 text-white/60">
          Datele se salvează doar pe acest dispozitiv.
          {data.since && <> Numărăm de la {new Date(data.since).toLocaleString("ro-RO")}.</>}
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-8 grid gap-4 sm:grid-cols-2">
        <Kpi icon={<Users className="size-5" />} label="Quizuri completate" value={data.total} />
        <Kpi icon={<Trophy className="size-5" />} label="Record „Prinde-le pe toate”" value={data.catchRecord} />
      </motion.div>

      <motion.section variants={fadeUp} className="glass mt-4 rounded-3xl p-6 sm:p-8">
        <h2 className="mb-5 font-display text-xl font-bold">Ce BESTani am găsit</h2>
        {data.total === 0 ? (
          <p className="text-white/50">Încă niciun rezultat. Dă-le studenților tableta! 📱</p>
        ) : (
          <ScoreBreakdown key={data.total} rows={rows} />
        )}
      </motion.section>

      <motion.section variants={fadeUp} className="mt-4 grid gap-3 sm:grid-cols-3">
        <Toggle
          icon={fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
          label="Ecran complet"
          on={fullscreen}
          onClick={toggleFullscreen}
        />
        <Toggle icon={<Sun className="size-5" />} label="Ecran mereu aprins" on={wakeLock.active} onClick={wakeLock.toggle} />
        <Toggle
          icon={<Timer className="size-5" />}
          label={`Resetare după ${SITE.idleTimeoutSec}s de pauză`}
          on={data.idleEnabled}
          onClick={() => setIdleEnabled(!data.idleEnabled)}
        />
      </motion.section>
      {wakeLock.error && <p className="mt-3 text-sm text-amber-300">{wakeLock.error}</p>}

      <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/quiz" size="lg">
          <Play className="size-5 fill-current" /> Deschide quizul
        </Button>
        <Button href="/" size="lg" variant="ghost">
          <House className="size-5" /> Pagina principală
        </Button>
        <button
          type="button"
          onClick={reset}
          className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-rose-400/40 px-6 font-display font-semibold text-rose-300 transition hover:bg-rose-500/15 sm:ml-auto"
        >
          <Trash2 className="size-5" /> Resetează statisticile
        </button>
      </motion.div>
    </motion.main>
  );
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 text-best-300">
        {icon}
        <span className="text-sm text-white/60">{label}</span>
      </div>
      <p className="mt-3 font-display text-5xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function Toggle({ icon, label, on, onClick }: { icon: ReactNode; label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 text-left transition",
        on ? "border-best-300/60 bg-best-500/20" : "border-white/10 bg-white/5 hover:bg-white/10",
      )}
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        {icon}
        {label}
      </span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition", on ? "bg-best-400" : "bg-white/20")}>
        <motion.span
          className="absolute top-1 left-1 size-4 rounded-full bg-white"
          animate={{ x: on ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  );
}
