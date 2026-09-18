"use client";

import { motion } from "motion/react";
import { CalendarDays, Globe, MapPin, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/data/site";
import { fadeUp, staggerContainer } from "@/lib/animations";

const ICONS = [CalendarDays, MapPin, Globe, Users];

export function Stats() {
  return (
    <section id="despre" className="scroll-mt-24 px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="// 01 · Despre noi" title="Ce este BEST?" accent="BEST?" subtitle={SITE.about} />

      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4"
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {SITE.stats.map((stat, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group glass relative overflow-hidden rounded-3xl p-5 sm:p-7"
            >
              <Icon className="size-6 text-best-300" />
              <AnimatedCounter
                value={stat.value}
                from={stat.from}
                grouping={stat.grouping}
                suffix={stat.suffix}
                className="mt-4 block font-display text-4xl font-bold tracking-tight sm:text-5xl"
              />
              <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              {/* Gradient radial (nu blur) + crossfade din opacitate la hover */}
              <div className="absolute -right-16 -bottom-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(139,61,255,0.35)_0%,transparent_65%)]" />
              <div className="absolute -right-16 -bottom-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(232,121,249,0.55)_0%,transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
