import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FOOD_SPOTS } from "@/lib/catalog";
import { dogById } from "@/lib/loyalty";
import { getClub } from "@/lib/visits";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { ProfileStack } from "@/components/figurine-badge";
import { cn } from "@/lib/utils";
import type { Badge, ClubVisit } from "@/lib/club";

type ClubState = {
  visits: ClubVisit[];
  totals: { visits: number; points: number; donated: number; spots: number };
  badges: Badge[];
};

export function ClubCard({ refreshKey = 0 }: { refreshKey?: number }) {
  const { user, isPending } = useCurrentUserState();
  const [club, setClub] = useState<ClubState | null>(null);
  const [view, setView] = useState<"dziennik" | "odznaki">("dziennik");

  useEffect(() => {
    if (!user) {
      setClub(null);
      return;
    }
    getClub()
      .then(setClub)
      .catch(() => setClub(null));
  }, [user, refreshKey]);

  if (isPending) {
    return <div className="surface h-40 animate-pulse" />;
  }

  if (!user) {
    return (
      <section className="surface p-5">
        <p className="font-display text-2xl">Twój sezon w klubie</p>
        <p className="mt-2 text-base text-muted-foreground">
          Konto zapisuje paragony, punkty, wpisy i to, ile poszło na pieski. Odznaki widać od pierwszej wizyty.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/login">Zostań członkiem</Link>
        </Button>
      </section>
    );
  }

  const totals = club?.totals ?? { visits: 0, points: 0, donated: 0, spots: 0 };
  const badges = club?.badges ?? [];
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div>
      <section className="surface p-5">
        <div className="flex items-center gap-4">
          <Link to="/ja" aria-label="Otwórz profil">
            <ProfileStack src={user.profileImageUrl} label={user.displayName ?? "Gość"} size="lg" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Członkostwo</p>
            <p className="mt-1 font-display text-3xl">{user.displayName ?? "Gość klubu"}</p>
            <Link to="/ja" className="mt-1 inline-block text-sm font-medium text-primary">
              Otwórz profil
            </Link>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Punkty", totals.points],
            ["Wizyty", totals.visits],
            ["Dla piesków", `${totals.donated.toFixed(0)} zł`],
            ["Odznaki", `${earned}/${badges.length}`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd className="font-display text-2xl tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-3 flex gap-2">
        {(["dziennik", "odznaki"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "min-h-11 flex-1 rounded-xl text-sm",
              view === v ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-card",
            )}
          >
            {v === "dziennik" ? "Pamiętnik" : "Odznaki"}
          </button>
        ))}
      </div>

      {view === "dziennik" ? (
        <section className="mt-3 surface p-5">
          <h3 className="font-display text-xl">Pamiętnik wizyt</h3>
          {!club || club.visits.length === 0 ? (
            <p className="mt-2 text-base text-muted-foreground">
              Zeskanuj lokal i zrób zdjęcie paragonu. Pierwszy wpis otwiera odznakę Pierwszy stół.
            </p>
          ) : (
            <ol className="mt-4 space-y-4">
              {club.visits.map((v) => {
                const place = FOOD_SPOTS.find((s) => s.id === v.spotId);
                const dog = v.dogId ? dogById(v.dogId) : undefined;
                const day = v.createdAt.slice(0, 10);
                return (
                  <li key={v.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <p className="text-sm text-muted-foreground">{day}</p>
                    <p className="font-display text-xl">{place?.name ?? v.spotId}</p>
                    {v.note && <p className="mt-1 text-base">{v.note}</p>}
                    <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                      {v.amount.toFixed(2)} zł · +{v.points} pkt
                      {dog ? ` · ${v.dogPln.toFixed(2)} zł dla ${dog.name}` : ""}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      ) : (
        <section className="mt-3 grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <article
              key={b.id}
              className={cn("surface p-4", b.earned ? "text-foreground" : "opacity-50")}
            >
              <div
                className={cn(
                  "mb-3 size-10 rounded-full",
                  b.earned ? "bg-primary" : "bg-muted",
                )}
              />
              <h3 className="font-display text-lg">{b.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.hint}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
