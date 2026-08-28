import { AGENTS, type AgentId } from "@/lib/catalog";
import { useGuide } from "@/lib/store";
import { cn } from "@/lib/utils";

export function useMascot(): AgentId {
  return useGuide((s) => s.mascotId ?? s.agentId ?? "skarbnik");
}

export function Figurine({
  id,
  className,
}: {
  id?: AgentId;
  className?: string;
}) {
  const fallback = useMascot();
  const agent = AGENTS[id ?? fallback];
  return (
    <img
      src={agent.fig}
      alt=""
      className={cn("pointer-events-none select-none animate-fig object-contain", className)}
    />
  );
}

export function ProfileStack({
  src,
  label,
  mascot,
  size = "md",
}: {
  src?: string | null;
  label: string;
  mascot?: AgentId;
  size?: "sm" | "md" | "lg";
}) {
  const box = size === "lg" ? "size-16" : size === "sm" ? "size-8" : "size-10";
  const fig = size === "lg" ? "size-9" : size === "sm" ? "size-5" : "size-6";
  return (
    <span className={cn("relative inline-block shrink-0", box)}>
      {src ? (
        <img src={src} alt="" className={cn("img-frame size-full rounded-full object-cover object-top", box)} />
      ) : (
        <span className={cn("grid size-full place-items-center rounded-full bg-muted text-sm font-medium", box)}>
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      <Figurine id={mascot} className={cn("absolute -right-1.5 -bottom-1 drop-shadow-md", fig)} />
    </span>
  );
}
