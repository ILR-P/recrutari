import { MapPin } from "lucide-react";
import { Morisca } from "@/components/ui/Morisca";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-4 pt-12 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="flex items-center gap-3">
            <Morisca className="size-10 animate-spin-slow" />
            <span className="font-display text-2xl font-bold">{SITE.name}</span>
          </div>
          <p className="flex items-center gap-2 text-sm text-white/55">
            <MapPin className="size-4 shrink-0" /> {SITE.address}
          </p>
        </div>

        <div className="flex gap-3">
          {SITE.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="glass grid size-12 place-items-center rounded-full text-white/80 transition hover:-translate-y-1 hover:bg-best-500/30 hover:text-white"
            >
              <SocialIcon label={social.label} className="size-5" />
            </a>
          ))}
          <a
            href={SITE.website}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex h-12 items-center rounded-full px-5 font-mono text-sm text-white/80 transition hover:-translate-y-1 hover:bg-best-500/30 hover:text-white"
          >
            bestcj.ro
          </a>
        </div>
      </div>
      <p className="mt-10 text-center text-sm text-white/40">Făcut cu 💜 de voluntarii BEST Cluj-Napoca</p>
    </footer>
  );
}
