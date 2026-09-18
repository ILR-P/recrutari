"use client";

import { motion } from "motion/react";
import { easeOut, fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: string;
  /** Cuvântul din titlu care primește gradient */
  accent?: string;
  subtitle?: string;
  className?: string;
};

const word = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.65, ease: easeOut } },
};

export function SectionHeading({ eyebrow, title, accent, subtitle, className }: Props) {
  return (
    <div className={cn("mx-auto mb-12 max-w-3xl text-center md:mb-16", className)}>
      <motion.p
        className="font-mono text-xs tracking-[0.3em] text-best-300 uppercase"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-3 font-display text-4xl leading-[1.05] font-bold text-balance sm:text-5xl md:text-6xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.07)}
      >
        {title.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span variants={word} className={cn("inline-block pr-[0.25em]", w === accent && "text-gradient")}>
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="mt-5 text-base text-pretty text-white/65 sm:text-lg"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
