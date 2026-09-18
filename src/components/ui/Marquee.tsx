import { cn } from "@/lib/cn";

/** Bandă care derulează la infinit. Conținutul e dublat ca bucla să nu se vadă. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "relative flex overflow-hidden mask-[linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="flex items-center gap-10 font-display text-xl font-semibold whitespace-nowrap text-white/70 sm:text-2xl"
          >
            {item}
            <span className="text-best-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
