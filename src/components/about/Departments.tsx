"use client";

import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEPARTMENTS } from "@/data/departments";
import { springs } from "@/lib/animations";
import { cn } from "@/lib/cn";

const GAP = 20;

/** Carusel care se trage cu degetul sau cu mouse-ul și se oprește pe carduri (snap). */
export function Departments() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);

  const metrics = () => {
    const viewportWidth = viewport.current?.offsetWidth ?? 0;
    const trackWidth = track.current?.scrollWidth ?? 0;
    const card = track.current?.firstElementChild as HTMLElement | null;
    return { min: Math.min(0, viewportWidth - trackWidth), step: (card?.offsetWidth ?? 300) + GAP };
  };

  const goTo = (target: number) => {
    const { min, step } = metrics();
    const clamped = Math.max(0, Math.min(DEPARTMENTS.length - 1, target));
    setIndex(clamped);
    animate(x, Math.max(min, -clamped * step), springs.soft);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { step } = metrics();
    const projected = x.get() + info.velocity.x * 0.25;
    goTo(Math.round(-projected / step));
  };

  return (
    <section id="echipe" className="scroll-mt-24 py-24 sm:py-32">
      <div className="px-4">
        <SectionHeading
          eyebrow="// 04 · Echipe"
          title="Unde te-ai potrivi?"
          accent="potrivi?"
          subtitle="Trage de carduri ca să vezi echipele din BEST Cluj."
        />
      </div>

      <div ref={viewport} className="mx-auto max-w-6xl overflow-hidden px-4">
        <motion.div
          ref={track}
          className="flex cursor-grab touch-pan-y gap-5 active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={viewport}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          {DEPARTMENTS.map((dept, i) => (
            <motion.article
              key={dept.id}
              className="group relative w-[78vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-ink-2/80 p-7 select-none sm:w-80"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...springs.soft, delay: i * 0.08 }}
              whileHover={{ y: -10 }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1.5 transition-all duration-500 group-hover:h-full group-hover:opacity-15"
                style={{ background: dept.color }}
              />
              <span
                className="relative grid size-16 place-items-center rounded-2xl text-4xl"
                style={{ background: `${dept.color}22`, boxShadow: `0 0 40px -10px ${dept.color}` }}
              >
                {dept.emoji}
              </span>
              <h3 className="relative mt-6 font-display text-3xl font-bold">{dept.name}</h3>
              <p className="relative mt-3 min-h-18 text-white/70">{dept.text}</p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {dept.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{ borderColor: `${dept.color}66`, color: dept.color }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4 px-4">
        <CarouselButton label="Echipa anterioară" onClick={() => goTo(index - 1)} disabled={index === 0}>
          <ChevronLeft className="size-5" />
        </CarouselButton>
        <div className="flex gap-2">
          {DEPARTMENTS.map((dept, i) => (
            <button
              key={dept.id}
              type="button"
              aria-label={`Mergi la ${dept.name}`}
              onClick={() => goTo(i)}
              className="grid h-6 cursor-pointer place-items-center"
            >
              <motion.span
                className={cn("block h-2 rounded-full", i === index ? "bg-best-300" : "bg-white/20")}
                animate={{ width: i === index ? 28 : 8 }}
                transition={springs.snappy}
              />
            </button>
          ))}
        </div>
        <CarouselButton
          label="Echipa următoare"
          onClick={() => goTo(index + 1)}
          disabled={index === DEPARTMENTS.length - 1}
        >
          <ChevronRight className="size-5" />
        </CarouselButton>
      </div>
    </section>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="glass grid size-12 cursor-pointer place-items-center rounded-full disabled:cursor-default disabled:opacity-30"
    >
      {children}
    </motion.button>
  );
}
