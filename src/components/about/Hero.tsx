"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Morisca } from "@/components/ui/Morisca";
import { PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";
import { springs } from "@/lib/animations";
import { cn } from "@/lib/cn";

const WORDS = [
  { text: "organizezi", color: "#fbbf24" },
  { text: "călătorești", color: "#22d3ee" },
  { text: "petreci", color: "#e879f9" },
  { text: "creezi", color: "#a3e635" },
];

const FLOATERS = [
  { emoji: "📋", className: "left-[5%] top-[20%]" },
  { emoji: "✈️", className: "right-[6%] top-[24%]" },
  { emoji: "🎉", className: "left-[9%] bottom-[24%]" },
  { emoji: "🎨", className: "right-[10%] bottom-[28%]" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  const word = WORDS[index];

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col overflow-hidden pt-24">
      {/* Morișca uriașă din spate: se rotește continuu și, în plus, odată cu scroll-ul */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[140vw] max-h-[950px] max-w-[950px] -translate-1/2 opacity-[0.13] sm:size-[95vw]"
        style={{ rotate }}
      >
        <Morisca className="size-full animate-spin-slow" />
      </motion.div>

      {/* Emoji-uri pe care le poți trage cu mouse-ul sau cu degetul */}
      {FLOATERS.map((f, i) => (
        <motion.div
          key={f.emoji}
          className={cn(
            "absolute z-20 hidden cursor-grab touch-none text-5xl select-none active:cursor-grabbing sm:block lg:text-6xl",
            f.className,
          )}
          drag
          dragSnapToOrigin
          dragElastic={0.7}
          whileDrag={{ scale: 1.5, rotate: 20 }}
          whileHover={{ scale: 1.2 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.bouncy, delay: 0.9 + i * 0.15 }}
        >
          <span className="block animate-float drop-shadow-[0_10px_25px_rgba(162,108,255,0.5)]" style={{ animationDelay: `${i * -1.5}s` }}>
            {f.emoji}
          </span>
        </motion.div>
      ))}

      <div className="relative z-10 flex flex-1 items-center justify-center px-4">
        <motion.div
          className="flex max-w-5xl flex-col items-center text-center"
          style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        >
          <motion.span
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-xs tracking-wider text-best-100 uppercase sm:text-sm"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.soft}
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-best-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-best-400" />
            </span>
            {SITE.season}
          </motion.span>

          <h1 className="mt-6 font-display text-[clamp(3.6rem,14vw,10.5rem)] leading-[0.88] font-bold tracking-tighter">
            <motion.span
              className="block"
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...springs.soft, delay: 0.1 }}
            >
              Hai în
            </motion.span>
            <motion.span
              className="block text-gradient"
              initial={{ y: 90, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ ...springs.soft, delay: 0.25 }}
            >
              BEST.
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 font-display text-2xl font-semibold sm:text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white/70">Aici</span>
            <span className="relative inline-flex h-[1.25em] min-w-[6.3em] overflow-hidden text-left">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={word.text}
                  className="block"
                  style={{ color: word.color }}
                  initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
                  transition={springs.snappy}
                >
                  {word.text}.
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.p>

          <motion.p
            className="mt-5 max-w-2xl text-base text-pretty text-white/65 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            Board of European Students of Technology: comunitatea studenților de la Politehnică care organizează
            evenimente, călătoresc prin Europa și se distrează împreună.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.soft, delay: 0.8 }}
          >
            <Button href="/quiz" size="xl">
              Ce tip de BESTan ești? <ArrowRight className="size-5" />
            </Button>
            <Button href="#despre" size="xl" variant="ghost">
              Descoperă BEST
            </Button>
          </motion.div>

          <motion.p
            className="mt-6 hidden font-mono text-xs text-white/40 sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            psst… poți trage de emoji-uri 👆
          </motion.p>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 pt-10 pb-8">
        <a href="#despre" aria-label="Derulează în jos" className="flex flex-col items-center gap-2 text-white/45">
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="size-5" />
          </motion.span>
        </a>
        <Marquee className="w-full" items={PROJECTS.map((p) => p.name)} />
      </div>
    </section>
  );
}
