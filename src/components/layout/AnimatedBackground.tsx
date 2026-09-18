"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect } from "react";

const GRID_SIZE = 56;

/** Fundalul viu: blob-uri care plutesc, grid cu parallax, spotlight pe cursor și noise. */
export function AnimatedBackground() {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(139, 61, 255, 0.16), transparent 70%)`;

  const { scrollY } = useScroll();
  // Grid-ul se repetă la GRID_SIZE px, deci modulo dă un parallax infinit fără goluri.
  const gridY = useTransform(scrollY, (v) => -((v * 0.2) % GRID_SIZE));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2c065e_0%,#0c0618_65%)]" />
      <div className="absolute -top-48 -left-48 size-[44rem] animate-blob rounded-full bg-best-600/30 blur-[120px] will-change-transform" />
      <div className="absolute top-1/3 -right-48 size-[36rem] animate-blob rounded-full bg-fuchsia-600/20 blur-[120px] will-change-transform [animation-delay:-7s]" />
      <div className="absolute -bottom-48 left-1/4 size-[40rem] animate-blob rounded-full bg-indigo-600/20 blur-[120px] will-change-transform [animation-delay:-14s]" />
      <motion.div
        className="absolute inset-x-0 -top-16 -bottom-16 grid-bg mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        style={{ y: gridY }}
      />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <div className="absolute inset-0 noise opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
