import { cn } from "@/lib/cn";

/**
 * Text cu gradient care „curge”. În loc să animăm background-position (care redesenează
 * textul la fiecare cadru), suprapunem două gradiente statice și le facem crossfade din
 * opacitate, o animație pe care o face GPU-ul singur.
 */
export function ShimmerText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="text-gradient">{children}</span>
      <span aria-hidden className="absolute inset-0 animate-crossfade text-gradient-alt will-change-[opacity]">
        {children}
      </span>
    </span>
  );
}
