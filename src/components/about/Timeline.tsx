"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TIMELINE, type TimelineItem } from "@/data/timeline";
import { slideIn, springs } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <section id="an" className="scroll-mt-24 px-4 py-24 sm:py-32">
      <SectionHeading
        eyebrow="// 03 · Timeline"
        title="Un an în BEST"
        accent="BEST"
        subtitle="Cam așa arată un an de voluntariat (spoiler: nu te plictisești)."
      />

      <div ref={ref} className="relative mx-auto max-w-5xl">
        {/* Linia de fundal și linia care se umple odată cu scroll-ul */}
        <div className="absolute top-0 bottom-0 left-5 w-0.5 -translate-x-1/2 bg-white/10 md:left-1/2" />
        <motion.div
          className="absolute top-0 bottom-0 left-5 w-1 origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-best-300 via-fuchsia-400 to-best-600 shadow-[0_0_24px_rgba(162,108,255,0.8)] md:left-1/2"
          style={{ scaleY }}
        />

        <ol className="space-y-10 md:space-y-14">
          {TIMELINE.map((item, i) => (
            <TimelineRow key={item.title} item={item} side={i % 2 === 0 ? "left" : "right"} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineRow({ item, side }: { item: TimelineItem; side: "left" | "right" }) {
  return (
    <li className="relative pl-14 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
      <motion.span
        className="absolute top-5 left-5 z-10 grid size-11 -translate-x-1/2 place-items-center rounded-full border-2 border-best-400 bg-ink text-xl shadow-[0_0_20px_rgba(162,108,255,0.6)] md:left-1/2"
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -35% 0px" }}
        transition={springs.bouncy}
      >
        {item.emoji}
      </motion.span>

      <motion.div
        variants={slideIn(side)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        whileHover={{ scale: 1.03 }}
        className={cn("glass rounded-3xl p-6", side === "right" ? "md:col-start-2" : "md:text-right")}
      >
        <p className="font-mono text-xs tracking-widest text-best-300 uppercase">{item.when}</p>
        <h3 className="mt-2 font-display text-2xl font-bold">{item.title}</h3>
        <p className="mt-2 text-white/65">{item.text}</p>
      </motion.div>
    </li>
  );
}
