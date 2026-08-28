import { Link } from "@tanstack/react-router";
import { MessageCircle, Map, Scan, CreditCard, LayoutGrid } from "lucide-react";
import { AGENTS } from "@/lib/catalog";
import { useGuide } from "@/lib/store";
import { withViewTransition } from "@/lib/motion";
import { TabStage } from "@/components/tab-stage";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "feed" as const, label: "Tablica", Icon: LayoutGrid },
  { id: "chat" as const, label: "Czat", Icon: MessageCircle },
  { id: "mapa" as const, label: "Mapa", Icon: Map },
  { id: "ar" as const, label: "AR", Icon: Scan },
  { id: "karta" as const, label: "Klub", Icon: CreditCard },
];

export function AppShell() {
  const agentId = useGuide((s) => s.agentId)!;
  const agent = AGENTS[agentId];
  const tab = useGuide((s) => s.tab);
  const setTab = useGuide((s) => s.setTab);
  const points = useGuide((s) => s.points);
  const resetAgent = useGuide((s) => s.resetAgent);
  const { isPending } = useCurrentUserState();
  const navIndex = Math.max(0, TABS.findIndex((t) => t.id === tab));

  return (
    <div className="mx-auto flex h-dvh max-w-lg flex-col bg-bg">
      <header className="flex items-center gap-3 bg-card px-3 py-2.5 shadow-card">
        <Link to="/" className="font-display text-base tracking-tight">
          hypeat.club
        </Link>
        <button type="button" onClick={resetAgent} className="shrink-0" aria-label="Zmień avatara">
          <img
            src={agent.img}
            alt=""
            className="img-frame size-10 rounded-full object-cover object-top"
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base text-foreground">{agent.name}</p>
          <p className="truncate text-sm text-muted-foreground">{agent.role}</p>
        </div>
        <button
          type="button"
          onClick={() => withViewTransition(() => setTab("karta"))}
          className="rounded-full bg-muted px-3 py-1 text-sm font-medium tabular-nums text-foreground"
        >
          {points} pkt
        </button>
        {isPending ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        ) : (
          <>
            <SignedOut>
              <Link to="/login" className="text-sm font-medium text-primary">
                Wejdź
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        )}
      </header>

      <nav className="relative flex bg-card">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => withViewTransition(() => setTab(t.id))}
            className={cn(
              "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-sm transition-colors duration-200 sm:flex-row sm:gap-1.5",
              tab === t.id ? "font-medium text-primary" : "text-muted-foreground",
            )}
          >
            <t.Icon className="size-4" />
            {t.label}
          </button>
        ))}
        <span
          className="pointer-events-none absolute bottom-0 h-0.5 bg-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${100 / TABS.length}%`,
            transform: `translateX(${navIndex * 100}%)`,
          }}
        />
      </nav>

      <TabStage />
    </div>
  );
}
