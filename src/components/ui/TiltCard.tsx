"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionStyle } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  style?: MotionStyle;
  /** Înclinarea maximă, în grade */
  max?: number;
  /** "glare" = reflexie albă, "holo" = reflexie holografică curcubeu */
  effect?: "glare" | "holo" | "none";
  /** Cardul se clatină singur când nu e atins (bun pentru ecranele de la stand) */
  idleWobble?: boolean;
};

const HOLO_GRADIENT =
  "linear-gradient(115deg, transparent 20%, rgba(255,0,200,0.45) 34%, rgba(0,255,255,0.45) 45%, rgba(255,255,0,0.35) 55%, rgba(120,80,255,0.45) 64%, transparent 78%)";
const GLARE_GRADIENT = "radial-gradient(circle at center, rgba(255,255,255,0.28), transparent 28%)";

/**
 * Card 3D care se înclină după cursor. Reflexiile sunt straturi desenate o singură dată și
 * mutate din transform. Clătinatul automat e o animație CSS, deci rulează pe GPU.
 */
export function TiltCard({ children, className, style, max = 12, effect = "glare", idleWobble = false }: Props) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const [hovering, setHovering] = useState(false);
  const wobbling = idleWobble && !hovering;

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });

  // Stratul de glare are 200% din card, cel holografic 250%; le mutăm relativ la propria mărime.
  const glareX = useTransform(px, (v) => `${(v - 0.5) * 50}%`);
  const glareY = useTransform(py, (v) => `${(v - 0.5) * 50}%`);
  const holoX = useTransform(px, (v) => `${-v * 60}%`);
  const holoY = useTransform(py, (v) => `${-v * 60}%`);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onPointerLeave = () => {
    setHovering(false);
    px.set(0.5);
    py.set(0.5);
  };

  const tiltVar = { "--tilt": `${max}deg` } as MotionStyle;

  return (
    <motion.div
      className={cn("relative", wobbling && "animate-tilt-wobble", className)}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d", ...tiltVar, ...style }}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
      {effect !== "none" && (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          {effect === "holo" && (
            <span className="absolute inset-0 opacity-60 mix-blend-color-dodge">
              <motion.span
                className={cn(
                  "absolute top-0 left-0 size-[250%] will-change-transform",
                  wobbling && "animate-holo-wobble",
                )}
                style={{ x: holoX, y: holoY, backgroundImage: HOLO_GRADIENT }}
              />
            </span>
          )}
          <span className="absolute inset-0 mix-blend-overlay">
            <motion.span
              className={cn(
                "absolute -top-1/2 -left-1/2 size-[200%] will-change-transform",
                wobbling && "animate-glare-wobble",
              )}
              style={{ x: glareX, y: glareY, backgroundImage: GLARE_GRADIENT }}
            />
          </span>
        </span>
      )}
    </motion.div>
  );
}
