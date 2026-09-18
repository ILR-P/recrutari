"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect } from "react";

const GRID_SIZE = 56;
const SPOTLIGHT = 1040;

/**
 * Fundalul viu: blob-uri care plutesc, grid cu parallax, spotlight pe cursor și noise.
 * Totul se mișcă doar din transform: blob-urile sunt gradiente radiale (nu filter: blur),
 * iar spotlight-ul e un cerc desenat o singură dată și mutat, nu redesenat la fiecare mișcare.
 */
export function AnimatedBackground() {
  const spotX = useMotionValue(-SPOTLIGHT);
  const spotY = useMotionValue(-SPOTLIGHT);

  const { scrollY } = useScroll();
  // Grid-ul se repetă la GRID_SIZE px, deci modulo dă un parallax infinit fără goluri.
  const gridY = useTransform(scrollY, (v) => -((v * 0.2) % GRID_SIZE));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      spotX.set(e.clientX - SPOTLIGHT / 2);
      spotY.set(e.clientY - SPOTLIGHT / 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [spotX, spotY]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2c065e_0%,#0c0618_65%)]" />
      <div className="absolute -top-80 -left-80 size-[68rem] animate-blob rounded-full bg-[radial-gradient(circle,rgba(124,34,245,0.34)_0%,transparent_62%)] will-change-transform" />
      <div className="absolute top-[10%] -right-80 size-[60rem] animate-blob rounded-full bg-[radial-gradient(circle,rgba(192,38,211,0.24)_0%,transparent_62%)] will-change-transform [animation-delay:-7s]" />
      <div className="absolute -bottom-80 left-[5%] size-[64rem] animate-blob rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.24)_0%,transparent_62%)] will-change-transform [animation-delay:-14s]" />
      <motion.div
        className="absolute inset-x-0 -top-16 -bottom-16 grid-bg mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)] will-change-transform"
        style={{ y: gridY }}
      />
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-[radial-gradient(circle,rgba(139,61,255,0.16)_0%,transparent_50%)] will-change-transform"
        style={{ x: spotX, y: spotY, width: SPOTLIGHT, height: SPOTLIGHT }}
      />
      <div className="absolute inset-0 noise opacity-[0.04]" />
    </div>
  );
}
