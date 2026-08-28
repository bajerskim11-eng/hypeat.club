import { Link } from "@tanstack/react-router";
import { FOOD_SPOTS } from "@/lib/catalog";
import { DOGS, dogById, SPONSOR } from "@/lib/loyalty";
import { SHELTER } from "@/lib/venue";
import { useGuide } from "@/lib/store";

export function ShelterPanel() {
  const dogFunds = useGuide((s) => s.dogFunds);
  const payouts = useGuide((s) => s.payouts) ?? [];
  const ledger = useGuide((s) => s.ledger);
  const collected = Object.values(dogFunds).reduce((a, b) => a + b, 0);
  const received = payouts.reduce((a, p) => a + p.amount, 0);

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 py-8 pb-16">
      <Link to="/" className="font-display text-xl tracking-tight">
        hypeat.club
      </Link>
      <h1 className="mt-3 font-display text-3xl">{SHELTER.name}</h1>
      <p className="mt-2 text-base text-muted-foreground">{SHELTER.note}</p>

      <section className="mt-5 grid grid-cols-2 gap-2">
        <article className="surface p-4">
          <p className="text-sm text-muted-foreground">Naliczone z obrotu</p>
          <p className="font-display text-2xl tabular-nums">{collected.toFixed(2)} zł</p>
        </article>
        <article className="surface p-4">
          <p className="text-sm text-muted-foreground">Przelane przez lokale</p>
          <p className="font-display text-2xl tabular-nums">{received.toFixed(2)} zł</p>
        </article>
      </section>

      <section className="mt-5 space-y-3">
        {DOGS.map((d) => {
          const houses = FOOD_SPOTS.filter((s) => SPONSOR[s.id] === d.id);
          const got = payouts.filter((p) => p.dogId === d.id).reduce((a, p) => a + p.amount, 0);
          const accrued = dogFunds[d.id] ?? 0;
          return (
            <article key={d.id} className="flex gap-3 surface p-3">
              <img src={d.img} alt={d.name} className="size-20 rounded-lg object-cover" />
              <div>
                <h2 className="font-display text-xl">{d.name}</h2>
                <p className="text-sm text-muted-foreground">{houses.map((h) => h.name.split(" ")[0]).join(", ")}</p>
                <p className="mt-1 text-base tabular-nums">
                  {accrued.toFixed(2)} zł z rachunków · {got.toFixed(2)} zł na koncie przytuliska
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-5 surface p-4">
        <h2 className="font-display text-xl">Przelewy</h2>
        {payouts.length === 0 ? (
          <p className="mt-2 text-base text-muted-foreground">
            Lokal zatwierdza paczkę w panelu kasy. To księgowość demo — prawdziwy przelew to umowa i konto NGO.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-base">
            {payouts.map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span className="truncate text-muted-foreground">
                  {FOOD_SPOTS.find((s) => s.id === p.spotId)?.name} · {dogById(p.dogId)?.name}
                </span>
                <span className="tabular-nums">{p.amount.toFixed(2)} zł</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-4 text-sm text-muted-foreground">
        {ledger.filter((l) => l.kind === "bill").length} rachunków w programie.
      </p>
    </main>
  );
}
