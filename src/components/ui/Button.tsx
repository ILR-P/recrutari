"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { easeOut } from "@/lib/animations";
import { cn } from "@/lib/cn";

const MotionLink = motion.create(Link);

const VARIANTS = {
  primary: "bg-best-500 text-white shadow-[0_0_48px_-10px_rgba(139,61,255,0.9)]",
  ghost: "glass text-white hover:bg-white/10",
  light: "bg-white text-ink hover:bg-best-50",
};

const SIZES = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
  xl: "h-16 px-9 text-lg sm:h-20 sm:px-12 sm:text-xl",
};

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  magnetic?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

/** Buton „magnetic” (urmărește cursorul) cu efect de ripple la apăsare. */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "lg",
  magnetic = true,
  disabled,
  className,
  ariaLabel,
}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 18 });
  const sy = useSpring(y, { stiffness: 300, damping: 18 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = nextId.current++;
    setRipples((list) => [...list, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((list) => list.filter((r) => r.id !== id)), 700);
  };

  const content = (
    <>
      {variant === "primary" && (
        // Gradientul alunecă din transform (GPU), nu din background-position (redesenare la fiecare cadru).
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[200%] animate-gradient-slide bg-linear-to-r from-best-500 via-fuchsia-500 to-best-600 will-change-transform"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute size-5 -translate-1/2 rounded-full bg-white/40"
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        />
      ))}
    </>
  );

  const shared = {
    className: cn(
      "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full font-display font-semibold select-none will-change-transform",
      "disabled:pointer-events-none disabled:opacity-40",
      VARIANTS[variant],
      SIZES[size],
      className,
    ),
    style: { x: sx, y: sy },
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.94 },
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <MotionLink href={href} {...shared}>
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} disabled={disabled} {...shared}>
      {content}
    </motion.button>
  );
}
