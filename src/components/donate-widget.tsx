import { FOOD_SPOTS } from "@/lib/catalog";
import { DOG_RATE, dogById } from "@/lib/loyalty";
import { SHELTER, dogIdForSpot } from "@/lib/venue";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function DonateWidget({ spotId }: { spotId: string }) {
  const spot = FOOD_SPOTS.find((s) => s.id === spotId) ?? FOOD_SPOTS[0];
  const dog = dogById(dogIdForSpot(spot.id) ?? "");
  const funded = useGuide((s) => s.dogFunds[dog?.id ?? ""] ?? 0);

  if (!spot || !dog) {
    return <p className="p-4 text-base">Nieznany lokal.</p>;
  }

  return (
    <article className="flex h-full min-h-[26rem] flex-col bg-bg p-4 text-foreground">
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">HypEat · 2% z rachunku</p>
      <img src={dog.img} alt={dog.name} className="mt-3 aspect-square w-full rounded-2xl object-cover" />
      <h1 className="mt-3 font-display text-2xl">{dog.name}</h1>
      <p className="mt-1 text-base">
        Jesz w {spot.name} — {Math.round(DOG_RATE * 100)}% idzie do {SHELTER.name}. Zebrane:{" "}
        <span className="tabular-nums font-medium">{funded.toFixed(0)} zł</span>
      </p>
      <Button asChild className="mt-4">
        <Link to="/app">Otwórz kartę</Link>
      </Button>
    </article>
  );
}
