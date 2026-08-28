import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AGENTS, type AgentId } from "@/lib/catalog";
import { getClub } from "@/lib/visits";
import { listFeed, type FeedPost } from "@/lib/posts";
import { memberQrValue } from "@/lib/qr";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useGuide } from "@/lib/store";
import { ClubHeader } from "@/components/club-header";
import { PassCard } from "@/components/pass-card";
import { Figurine, ProfileStack } from "@/components/figurine-badge";
import { QrImg } from "@/components/qr-img";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Badge, ClubVisit } from "@/lib/club";

const MASCOTS: AgentId[] = ["skarbnik", "hopla", "podciep", "fachura", "hanys"];

export function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const mascotId = useGuide((s) => s.mascotId);
  const setMascot = useGuide((s) => s.setMascot);
  const setAgent = useGuide((s) => s.setAgent);
  const points = useGuide((s) => s.points);
  const [club, setClub] = useState<{
    visits: ClubVisit[];
    totals: { visits: number; points: number; donated: number; spots: number };
    badges: Badge[];
  } | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    getClub()
      .then(setClub)
      .catch(() => setClub(null));
    listFeed({ data: { userId: user.id, viewerId: user.id } })
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-4">
        <ClubHeader compact />
        <div className="surface mt-4 h-56 animate-pulse" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-4 pb-12">
        <ClubHeader compact />
        <PassCard>
          <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">Legitymacja</p>
          <h1 className="mt-2 font-display text-4xl">Tu będzie twój profil</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Po wejściu: karta członkowska, figurka beboka, sezon, relacje.
          </p>
          <img src="/beboki/figs/skarbnik.png" alt="" className="animate-fig mt-4 h-28 w-28 object-contain" />
          <Button className="mt-4" asChild>
            <Link to="/login">Wejdź do klubu</Link>
          </Button>
        </PassCard>
      </main>
    );
  }

  const totals = club?.totals ?? { visits: 0, points: 0, donated: 0, spots: 0 };
  const badges = club?.badges ?? [];
  const earned = badges.filter((b) => b.earned);
  const season = Math.min(100, totals.points);
  const mascot = AGENTS[mascotId];
  const memberNo = user.id.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase() || "000000";

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-16">
      <ClubHeader compact />

      <PassCard>
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">hypeat.club</p>
            <h1 className="mt-1 font-display text-3xl leading-tight">{user.displayName ?? "Członek"}</h1>
            <p className="mt-1 text-sm tabular-nums text-muted-foreground">Nr {memberNo} · sezon 26</p>
          </div>
          <ProfileStack src={user.profileImageUrl} label={user.displayName ?? "C"} mascot={mascotId} size="lg" />
        </div>
        <dl className="relative z-10 mt-6 grid grid-cols-3 gap-3">
          {[
            ["Punkty", points || totals.points],
            ["Stoły", totals.visits],
            ["Pieski", `${totals.donated.toFixed(0)} zł`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd className="font-display text-2xl tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="relative z-10 mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${season}%` }} />
        </div>
        <p className="relative z-10 mt-2 text-sm text-muted-foreground">Sezon do 100 pkt z rachunków.</p>
        <div className="relative z-10 mt-5 flex items-end justify-between">
          <Figurine id={mascotId} className="h-24 w-24" />
          <div className="rounded-xl bg-card p-2">
            <QrImg value={memberQrValue(user.id)} label="Kod członkowski" className="size-24" />
          </div>
        </div>
      </PassCard>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Twój bebok</h2>
        <p className="mt-1 text-sm text-muted-foreground">Figurka przy awatarze. {mascot.name} teraz z tobą.</p>
        <div className="mt-4 flex justify-between gap-2">
          {MASCOTS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMascot(id)}
              className={cn(
                "flex flex-1 flex-col items-center rounded-2xl py-2 transition-transform duration-150 active:scale-[0.96]",
                mascotId === id ? "bg-card shadow-card" : "opacity-60",
              )}
            >
              <img src={AGENTS[id].fig} alt={AGENTS[id].name} className="h-14 w-14 object-contain" />
              <span className="mt-1 text-xs">{AGENTS[id].name}</span>
            </button>
          ))}
        </div>
        <Button className="mt-4 w-full" variant="secondary" asChild>
          <Link to="/app" onClick={() => setAgent(mascotId)}>
            Rozmowa z {mascot.name}
          </Link>
        </Button>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Odznaki</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {badges.map((b) => (
            <article
              key={b.id}
              className={cn(
                "w-32 shrink-0 rounded-2xl p-3",
                b.earned ? "bg-card shadow-card" : "bg-muted opacity-50",
              )}
            >
              <p className="font-display text-lg">{b.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.hint}</p>
            </article>
          ))}
        </div>
        {earned.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">Pierwszy paragon otwiera Pierwszy stół.</p>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Twoje relacje</h2>
          <Link to="/tablica" className="text-sm font-medium text-primary">
            Tablica
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="mt-3 text-base text-muted-foreground">Jeszcze cisza. Wrzuć kadr z lokalu — punkty wracają tu.</p>
        ) : (
          <ol className="mt-4 grid grid-cols-3 gap-2">
            {posts.slice(0, 9).map((p) => (
              <li key={p.id} className="overflow-hidden rounded-xl bg-muted">
                {p.media ? (
                  <img src={p.media} alt="" className="aspect-square w-full object-cover" />
                ) : (
                  <p className="p-2 text-xs">{p.caption.slice(0, 60)}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {authEnabled && (
        <Button
          className="mt-10 w-full"
          variant="ghost"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
        >
          {signingOut ? "Wylogowuję…" : "Wyloguj"}
        </Button>
      )}
    </main>
  );
}
