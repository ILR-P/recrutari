"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
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

export function TiltCard({ children, className, style, max = 12, effect = "glare", idleWobble = false }: Props) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const [hovering, setHovering] = useState(false);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });

  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 55%)`;
  const holoPosition = useMotionTemplate`${gx} ${gy}`;

  useEffect(() => {
    if (!idleWobble || hovering) return;
    const a = animate(px, [0.5, 0.85, 0.5, 0.15, 0.5], { duration: 9, repeat: Infinity, ease: "easeInOut" });
    const b = animate(py, [0.5, 0.25, 0.75, 0.35, 0.5], { duration: 9, repeat: Infinity, ease: "easeInOut" });
    return () => {
      a.stop();
      b.stop();
    };
  }, [idleWobble, hovering, px, py]);

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

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d", ...style }}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
      {effect === "glare" && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: glare }}
        />
      )}
      {effect === "holo" && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-color-dodge"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 20%, rgba(255,0,200,0.45) 34%, rgba(0,255,255,0.45) 45%, rgba(255,255,0,0.35) 55%, rgba(120,80,255,0.45) 64%, transparent 78%)",
              backgroundSize: "250% 250%",
              backgroundPosition: holoPosition,
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
            style={{ background: glare }}
          />
        </>
      )}
    </motion.div>
  );
}
