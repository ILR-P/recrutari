"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Morisca } from "@/components/ui/Morisca";
import { springs } from "@/lib/animations";

const LINKS = [
  { href: "/#despre", label: "Despre" },
  { href: "/#proiecte", label: "Proiecte" },
  { href: "/#an", label: "Un an în BEST" },
  { href: "/#joc", label: "Joc" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const inQuiz = pathname.startsWith("/quiz");
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const taps = useRef<number[]>([]);

  // Se ascunde când derulezi în jos și reapare când urci.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 160);
  });

  // Easter egg pentru voluntari: triplu-tap pe logo deschide panoul /stand.
  const onLogoTap = () => {
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 700), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      router.push("/stand");
    }
  };

  const logo = (
    <motion.span className="flex items-center gap-2.5" whileHover="spin">
      <Morisca className="size-8" variants={{ spin: { rotate: 180 } }} transition={springs.bouncy} />
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight">BEST</span>
        <span className="block font-mono text-[10px] tracking-widest text-best-300 uppercase">Cluj-Napoca</span>
      </span>
    </motion.span>
  );

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4"
      animate={{ y: hidden ? -110 : 0 }}
      transition={springs.snappy}
    >
      <nav className="flex w-full max-w-5xl items-center justify-between gap-2 rounded-full border border-white/10 bg-ink/75 py-2 pr-2 pl-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {inQuiz ? (
          <button type="button" onClick={onLogoTap} className="cursor-default" aria-label="BEST Cluj-Napoca">
            {logo}
          </button>
        ) : (
          <Link href="/" onClick={onLogoTap} aria-label="BEST Cluj-Napoca, pagina principală">
            {logo}
          </Link>
        )}

        {!inQuiz && (
          <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {LINKS.map((link) => (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  onPointerEnter={() => setHovered(link.href)}
                  className="relative z-10 block px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={springs.snappy}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {inQuiz ? (
          <Button href="/" variant="ghost" size="md" magnetic={false}>
            <X className="size-4" /> Ieși
          </Button>
        ) : (
          <Button href="/quiz" size="md">
            Fă quizul ✨
          </Button>
        )}
      </nav>
    </motion.header>
  );
}
