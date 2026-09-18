"use client";

import { motion } from "motion/react";
import { BookOpen, Bot, Briefcase, CodeXml, Plane, RotateCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { PROJECTS, type Project, type ProjectIcon } from "@/data/projects";
import { easeOut, springs } from "@/lib/animations";

const ICONS: Record<ProjectIcon, typeof Briefcase> = {
  briefcase: Briefcase,
  code: CodeXml,
  bot: Bot,
  plane: Plane,
  book: BookOpen,
  sparkles: Sparkles,
};

export function Projects() {
  return (
    <section id="proiecte" className="scroll-mt-24 px-4 py-24 sm:py-32">
      <SectionHeading
        eyebrow="// 02 · Proiecte"
        title="Ce facem la BEST Cluj"
        accent="BEST"
        subtitle="Atinge un card ca să-l întorci."
      />
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = ICONS[project.icon];

  return (
    <motion.div
      className="h-80"
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: easeOut, delay: (index % 3) * 0.1 }}
    >
      <TiltCard className="size-full rounded-3xl" max={10}>
        <motion.button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={`${project.name}: ${flipped ? "ascunde detaliile" : "arată detaliile"}`}
          className="relative size-full cursor-pointer rounded-3xl text-left transform-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={springs.soft}
        >
          {/* Fața */}
          <span className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-ink-2/85 p-6 backface-hidden">
            <span
              aria-hidden
              className="absolute -top-28 -right-28 size-72 rounded-full"
              style={{ background: `radial-gradient(circle, ${project.color}50 0%, transparent 62%)` }}
            />
            <span className="relative flex items-start justify-between">
              <span
                className="grid size-14 place-items-center rounded-2xl"
                style={{ background: `${project.color}22`, color: project.color }}
              >
                <Icon className="size-7" />
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] tracking-wider text-white/70 uppercase">
                {project.tag}
              </span>
            </span>
            <span className="relative">
              <span className="block font-display text-3xl font-bold">{project.name}</span>
              <span className="mt-1 block text-white/60">{project.tagline}</span>
            </span>
            <span className="relative flex items-center gap-2 font-mono text-xs text-white/40">
              <RotateCw className="size-3.5" /> atinge pentru detalii
            </span>
          </span>

          {/* Spatele */}
          <span
            className="absolute inset-0 flex rotate-y-180 flex-col overflow-hidden rounded-3xl border p-6 backface-hidden"
            style={{
              background: `linear-gradient(150deg, ${project.color}38, #140a26 65%)`,
              borderColor: `${project.color}66`,
            }}
          >
            <span className="font-display text-2xl font-bold" style={{ color: project.color }}>
              {project.name}
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-white/85">{project.description}</span>
            <span className="mt-auto block text-sm">
              <span className="text-white/50">Pentru cine: </span>
              {project.forWho}
            </span>
            {project.url && (
              <span className="mt-3 block font-mono text-xs text-white/50">{project.url.replace("https://", "")}</span>
            )}
          </span>
        </motion.button>
      </TiltCard>
    </motion.div>
  );
}
