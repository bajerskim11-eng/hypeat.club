import { useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { FOOD_SPOTS } from "@/lib/catalog";
import { CASHBACK_RATE, DOG_RATE, dogById } from "@/lib/loyalty";
import {
  CHANNEL_LABEL,
  REWARDS,
  SHELTER,
  VENUE_PIN,
  dogIdForSpot,
  pinOk,
  venueById,
  widgetSnippet,
  type SaleChannel,
} from "@/lib/venue";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrImg } from "@/components/qr-img";
import { spotQrValue } from "@/lib/qr";

export function VenuePanel() {
  const [spotId, setSpotId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [bill, setBill] = useState("64");
  const [channel, setChannel] = useState<SaleChannel>("salon");
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ledger = useGuide((s) => s.ledger);
  const coupons = useGuide((s) => s.coupons);
  const payouts = useGuide((s) => s.payouts) ?? [];
  const bookSale = useGuide((s) => s.bookSale);
  const confirmCoupon = useGuide((s) => s.confirmCoupon);
  const issueReward = useGuide((s) => s.issueReward);
  const payoutShelter = useGuide((s) => s.payoutShelter);

  const venue = spotId ? venueById(spotId) : undefined;
  const dog = spotId ? dogById(dogIdForSpot(spotId) ?? "") : undefined;

  const stats = useMemo(() => {
    if (!spotId) return null;
    const sales = ledger.filter((l) => l.spotId === spotId && l.kind === "bill");
    const turnover = sales.reduce((a, l) => a + l.amount, 0);
    const dogIn = sales.reduce((a, l) => a + (l.dogPln ?? 0), 0);
    const sent = payouts.filter((p) => p.spotId === spotId).reduce((a, p) => a + p.amount, 0);
    const pending = Math.round((dogIn - sent) * 100) / 100;
    return { turnover, count: sales.length, dogIn, sent, pending };
  }, [ledger, payouts, spotId]);

  const openCoupons = coupons.filter((c) => c.spotId === spotId && !c.used);

  function login(e: FormEvent) {
    e.preventDefault();
    const id = (document.getElementById("venue-select") as HTMLSelectElement | null)?.value;
    if (!id || !pinOk(id, pin)) {
      setErr("Zły PIN. Demo: 1010 przy AiOLI, 2020 Basiliana, 3030 Żurownia.");
      return;
    }
    setSpotId(id);
    setErr(null);
  }

  if (!venue || !stats) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-4 py-8">
        <Link to="/" className="font-display text-xl tracking-tight">
          hypeat.club
        </Link>
        <h1 className="mt-3 font-display text-3xl">Panel lokalu</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Kasa: rachunek, punkty, zniżki, gratisy i przelew 2% na {SHELTER.name}. Bez konta — PIN demo.
        </p>
        <form onSubmit={login} className="mt-6 space-y-3 surface p-4">
          <label className="block text-sm text-muted-foreground">Restauracja</label>
          <select id="venue-select" className="h-11 w-full rounded-md border border-border bg-card px-3 text-base">
            {FOOD_SPOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · PIN {VENUE_PIN[s.id]}
              </option>
            ))}
          </select>
          <label className="block text-sm text-muted-foreground">PIN</label>
          <Input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" aria-label="PIN lokalu" />
          {err && <p className="text-sm text-primary">{err}</p>}
          <Button type="submit" className="w-full">
            Wejdź do kasy
          </Button>
        </form>
      </main>
    );
  }

  const amount = Number(bill.replace(",", "."));

  const onSale = () => {
    const res = bookSale(venue.id, amount, channel);
    if (!res) {
      setNote("Wpisz kwotę rachunku.");
      return;
    }
    setNote(
      `${CHANNEL_LABEL[channel]} ${amount} zł. Gość: ${Math.round(amount * CASHBACK_RATE)} pkt. ${SHELTER.name}: ${res.dogPln.toFixed(2)} zł.`,
    );
  };

  const onPayout = () => {
    const p = payoutShelter(venue.id);
    setNote(
      p
        ? `Przelew ${p.amount.toFixed(2)} zł na ${SHELTER.name} (demo księgowe).`
        : "Za mało na przelew — minimum 1 zł zebranych.",
    );
  };

  const copyWidget = () => {
    void navigator.clipboard?.writeText(widgetSnippet(venue.id));
    setCopied(true);
  };

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 py-6 pb-16">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="font-display text-base tracking-tight">
          hypeat.club
        </Link>
        <button type="button" className="text-sm text-muted-foreground" onClick={() => setSpotId(null)}>
          Wyloguj kasy
        </button>
      </div>
      <h1 className="mt-3 font-display text-3xl">{venue.name}</h1>
      <p className="text-base text-muted-foreground">
        {venue.area} · piesek {dog?.name} · {SHELTER.name}
      </p>

      <section className="mt-4 grid grid-cols-2 gap-2">
        {[
          ["Obrót", `${stats.turnover.toFixed(0)} zł`],
          ["Rachunki", String(stats.count)],
          ["Dla pieska", `${stats.dogIn.toFixed(2)} zł`],
          ["Do przelewu", `${stats.pending.toFixed(2)} zł`],
        ].map(([k, v]) => (
          <article key={k} className="surface p-3">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-display text-xl tabular-nums">{v}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 surface p-4">
        <h2 className="font-display text-xl">Nowe rozliczenie</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {Math.round(CASHBACK_RATE * 100)}% w punktach gościa · {Math.round(DOG_RATE * 100)}% na schronisko. Dowóz = ten sam
          podział, bez logowania do Pyszne.
        </p>
        <div className="mt-3 flex gap-2">
          {(["salon", "dowoz"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`min-h-11 flex-1 rounded-lg border text-sm ${channel === c ? "border-primary bg-muted text-primary" : "border-border"}`}
            >
              {CHANNEL_LABEL[c]}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-sm text-muted-foreground">Kwota rachunku</label>
        <Input className="mt-1" inputMode="decimal" value={bill} onChange={(e) => setBill(e.target.value)} />
        <Button className="mt-3 w-full" onClick={onSale}>
          Nalicz i odłóż na pieska
        </Button>
      </section>

      <section className="mt-4 surface p-4">
        <h2 className="font-display text-xl">Kupony gości</h2>
        {openCoupons.length === 0 ? (
          <p className="mt-2 text-base text-muted-foreground">Brak otwartych kuponów na ten lokal.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {openCoupons.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <span className="tabular-nums">{c.value} zł</span>
                <Button size="sm" onClick={() => confirmCoupon(c.id)}>
                  Potwierdź przy kasie
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 surface p-4">
        <h2 className="font-display text-xl">Zniżki i gratisy</h2>
        <div className="mt-3 grid gap-2">
          {REWARDS.map((r) => (
            <Button
              key={r.id}
              variant="secondary"
              className="w-full justify-between"
              onClick={() => {
                const out = issueReward(venue.id, r.id);
                setNote(out ? `Wydano: ${out.label}` : "Za mało punktów gościa na tę nagrodę.");
              }}
            >
              <span>{r.label}</span>
              <span className="text-sm text-muted-foreground">
                {r.house ? "z domu" : `${r.points} pkt`}
              </span>
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-4 surface p-4">
        <h2 className="font-display text-xl">Przelew na schronisko</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Zbiera się 2% z każdego rachunku. Kasa zatwierdza paczkę — jak rozliczenie z FaniMani, tylko od stołu, nie od
          sklepu internetowego.
        </p>
        <Button className="mt-3 w-full" onClick={onPayout}>
          Przelej {stats.pending.toFixed(2)} zł
        </Button>
        <Link to="/schronisko" className="mt-3 block text-center text-sm font-medium text-primary">
          Widok przytuliska
        </Link>
      </section>

      <section className="mt-4 surface p-4">
        <h2 className="font-display text-xl">Kod kasy i wtyczka</h2>
        <div className="mx-auto mt-3 max-w-40">
          <QrImg value={spotQrValue(venue.id)} label={`Kod ${venue.name}`} className="w-full" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Wtyczka jak FaniMani: jedna ramka na stronę lokalu. Pyszne Business zostawiamy do zamówień — ich pieczątki nie
          mają otwartego API.
        </p>
        <pre className="mt-3 overflow-auto rounded-lg bg-muted p-3 text-sm">{widgetSnippet(venue.id)}</pre>
        <Button variant="secondary" className="mt-2 w-full" onClick={copyWidget}>
          {copied ? "Skopiowane" : "Kopiuj wtyczkę"}
        </Button>
      </section>

      {note && <p className="mt-4 text-base text-primary">{note}</p>}
    </main>
  );
}
