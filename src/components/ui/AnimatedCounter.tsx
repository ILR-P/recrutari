"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { easeOut } from "@/lib/animations";

type Props = {
  value: number;
  from?: number;
  duration?: number;
  suffix?: string;
  /** false pentru ani (1989, nu 1.989) */
  grouping?: boolean;
  className?: string;
};

const format = (v: number, grouping: boolean, suffix: string) =>
  Math.round(v).toLocaleString("ro-RO", { useGrouping: grouping }) + suffix;

/** Numără de la `from` la `value` când intră în ecran. Scrie direct în DOM, fără re-render. */
export function AnimatedCounter({ value, from = 0, duration = 2, suffix = "", grouping = true, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, value, {
      duration,
      ease: easeOut,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v, grouping, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, from, value, duration, grouping, suffix]);

  return (
    <span ref={ref} className={className}>
      {format(from, grouping, suffix)}
    </span>
  );
}
