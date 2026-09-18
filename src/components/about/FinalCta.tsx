"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Morisca } from "@/components/ui/Morisca";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { springs } from "@/lib/animations";

export function FinalCta() {
  return (
    <section className="px-4 py-24 sm:py-32">
      <motion.div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/15 bg-linear-to-br from-best-600/50 via-best-900/60 to-fuchsia-700/40 px-6 py-16 text-center sm:px-16 sm:py-20"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={springs.soft}
      >
        <Morisca palette="archetypes" className="absolute -top-24 -right-24 size-72 animate-spin-slow opacity-25" />
        <Morisca className="absolute -bottom-28 -left-20 size-64 animate-spin-slow opacity-20 [animation-direction:reverse]" />
        <div className="absolute inset-0 grid-bg opacity-40 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative">
          <p className="font-mono text-xs tracking-[0.3em] text-best-100 uppercase">Durează 2 minute</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-balance sm:text-6xl">
            Acum e rândul <ShimmerText>tău.</ShimmerText>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
            Răspunde la câteva întrebări, joacă două mini-jocuri și primești legitimația ta de BESTan.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/quiz" size="xl" variant="light">
              Începe quizul <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
