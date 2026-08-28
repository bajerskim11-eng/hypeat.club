import { createFileRoute, Link } from "@tanstack/react-router";
import { FOOD_SPOTS } from "@/lib/catalog";
import { googleReviewsUrl, igSearchUrl, mapsUrl } from "@/lib/social";
import { ClubHeader } from "@/components/club-header";
import { FeedPanel } from "@/components/feed-panel";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/spot/$spotId")({ component: SpotPage });

function SpotPage() {
  const { spotId } = Route.useParams();
  const spot = FOOD_SPOTS.find((s) => s.id === spotId);
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-10">
      <ClubHeader compact />
      {spot ? (
        <section className="surface p-5">
          <p className="text-sm text-muted-foreground">{spot.area}</p>
          <h1 className="font-display text-3xl">{spot.name}</h1>
          <p className="mt-2 text-base text-muted-foreground">{spot.note}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <a href={mapsUrl(spot)} target="_blank" rel="noreferrer">
                Google Maps
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a href={igSearchUrl(spot.name)} target="_blank" rel="noreferrer">
                Instagram lokalu
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a href={googleReviewsUrl(spot)} target="_blank" rel="noreferrer">
                Opinie Google
              </a>
            </Button>
          </div>
        </section>
      ) : (
        <p>Nie ma takiego lokalu.</p>
      )}
      <FeedPanel spotId={spotId} />
      <Link to="/tablica" className="pb-8 text-center text-sm font-medium text-primary">
        Wróć do tablicy
      </Link>
    </main>
  );
}
