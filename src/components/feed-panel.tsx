import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FOOD_SPOTS } from "@/lib/catalog";
import { googleReviewsUrl, igSearchUrl, mapsUrl } from "@/lib/social";
import { listFeed, toggleLike, type FeedPost } from "@/lib/posts";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { ComposeSheet } from "@/components/compose-sheet";
import { cn } from "@/lib/utils";

function KindLabel({ kind }: { kind: FeedPost["kind"] }) {
  return (
    <span className="text-sm text-muted-foreground">
      {kind === "photo" ? "zdjęcie" : kind === "video" ? "film" : "opinia"}
    </span>
  );
}

export function FeedPanel({ spotId, userId }: { spotId?: string; userId?: string }) {
  const { user, isPending } = useCurrentUserState();
  const viewer = useCurrentUser();
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [compose, setCompose] = useState(false);
  const [tick, setTick] = useState(0);
  const [fail, setFail] = useState<string | null>(null);

  useEffect(() => {
    setFail(null);
    listFeed({ data: { spotId, userId, viewerId: viewer?.id } })
      .then((rows) => setPosts(Array.isArray(rows) ? rows : []))
      .catch((e: unknown) => {
        setPosts([]);
        setFail(e instanceof Error ? e.message : "Tablica nie wstała.");
      });
  }, [spotId, userId, viewer?.id, tick]);

  async function onLike(id: string) {
    if (!user) return;
    const res = await toggleLike({ data: id });
    setPosts((cur) =>
      cur?.map((p) =>
        p.id === id
          ? { ...p, liked: res.liked, likes: p.likes + (res.liked ? 1 : -1) }
          : p,
      ) ?? null,
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Tablica</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Relacje z stołów. Inni członkowie. Punkty za UGC — nie za lajki z Instagrama.
          </p>
        </div>
        <Button onClick={() => setCompose(true)}>Relacja</Button>
      </div>

      {fail && <p className="mt-3 text-base text-primary">{fail}</p>}
      {posts === null ? (
        <div className="surface mt-4 h-40 animate-pulse" />
      ) : posts.length === 0 ? (
        <p className="mt-6 text-base text-muted-foreground">Jeszcze cicho. Wrzuć pierwszy kadr.</p>
      ) : (
        <ol className="mt-5 space-y-4">
          {posts.map((p) => {
            const spot = FOOD_SPOTS.find((s) => s.id === p.spotId);
            const day = p.createdAt.slice(0, 10);
            return (
              <li key={p.id} className="surface overflow-hidden">
                {p.media && (
                  <img src={p.media} alt="" className="aspect-[4/5] w-full object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to="/u/$userId"
                      params={{ userId: p.userId }}
                      className="font-medium text-foreground"
                    >
                      {p.authorName}
                    </Link>
                    <KindLabel kind={p.kind} />
                  </div>
                  {spot && (
                    <Link to="/spot/$spotId" params={{ spotId: spot.id }} className="text-sm text-primary">
                      {spot.name} · {spot.area}
                    </Link>
                  )}
                  {p.caption && <p className="mt-2 text-base">{p.caption}</p>}
                  <p className="mt-2 text-sm tabular-nums text-muted-foreground">
                    {day} · +{p.points} pkt
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={p.liked ? "default" : "secondary"}
                      disabled={isPending || !user}
                      onClick={() => void onLike(p.id)}
                    >
                      Lubię {p.likes}
                    </Button>
                    {spot && (
                      <>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={mapsUrl(spot)} target="_blank" rel="noreferrer">
                            Maps
                          </a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={igSearchUrl(spot.name)} target="_blank" rel="noreferrer">
                            Instagram
                          </a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={googleReviewsUrl(spot)} target="_blank" rel="noreferrer">
                            Opinie Google
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ComposeSheet open={compose} onClose={() => setCompose(false)} onPosted={() => setTick((n) => n + 1)} spotId={spotId} />
    </div>
  );
}

export function FeedHint({ className }: { className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      Instagram i Google zostają do oznaczania lokalu. Cashback liczy hypeat.club.
    </p>
  );
}
