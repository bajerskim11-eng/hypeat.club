import { useMemo, useState } from "react";
import { Camera, QrCode } from "lucide-react";
import { FOOD_SPOTS, SPOTS } from "@/lib/catalog";
import { CASHBACK_RATE, DOG_RATE, DOGS, MIN_REDEEM, SPONSOR, dogById } from "@/lib/loyalty";
import { cardQrValue, couponQrValue, spotQrValue } from "@/lib/qr";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { QrImg } from "@/components/qr-img";
import { QrSheet } from "@/components/qr-sheet";
import { ReceiptSheet } from "@/components/receipt-sheet";
import { ClubCard } from "@/components/club-card";
import { cn } from "@/lib/utils";

export function StampPanel() {
  const [view, setView] = useState<"klub" | "karta" | "pieski">("klub");
  const [scan, setScan] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const points = useGuide((s) => s.points);
  const stamps = useGuide((s) => s.stamps);
  const dogFunds = useGuide((s) => s.dogFunds);
  const adoptedDogId = useGuide((s) => s.adoptedDogId);
  const ledger = useGuide((s) => s.ledger);
  const coupons = useGuide((s) => s.coupons);
  const cardSpotId = useGuide((s) => s.cardSpotId);
  const setCardSpot = useGuide((s) => s.setCardSpot);
  const redeem = useGuide((s) => s.redeem);
  const adoptDog = useGuide((s) => s.adoptDog);
  const pushTurn = useGuide((s) => s.pushTurn);
  const clubTick = useGuide((s) => s.clubTick);

  const spot = FOOD_SPOTS.find((s) => s.id === cardSpotId);
  const adopted = adoptedDogId ? dogById(adoptedDogId) : null;
  const totalDogs = useMemo(
    () => Object.values(dogFunds).reduce((a, b) => a + b, 0),
    [dogFunds],
  );

  function onSpot(id: string) {
    setCardSpot(id);
    setScan(false);
    const place = FOOD_SPOTS.find((s) => s.id === id);
    setNote(`Lokal: ${place?.name}. Teraz zdjęcie paragonu.`);
    setReceipt(true);
  }

  function onRedeem() {
    if (!cardSpotId) {
      setNote("Najpierw zeskanuj kod restauracji, w której chcesz zapłacić kuponem.");
      setScan(true);
      return;
    }
    const value = Math.min(points, Math.max(MIN_REDEEM, 20));
    const c = redeem(cardSpotId, value);
    const place = FOOD_SPOTS.find((s) => s.id === cardSpotId);
    if (!c) {
      setNote(`Kupon od ${MIN_REDEEM} pkt. Masz ${points} pkt.`);
      return;
    }
    setNote(`Kupon ${c.value} zł do ${place?.name}. Pokaż kod przy kasie.`);
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
      <div className="flex gap-2">
        {(["klub", "karta", "pieski"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "min-h-11 flex-1 rounded-xl text-sm",
              view === v ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-card",
            )}
          >
            {v === "klub" ? "Klub" : v === "karta" ? "Kasa" : "Pieski"}
          </button>
        ))}
      </div>

      {view === "klub" && (
        <div className="mt-3">
          <ClubCard refreshKey={clubTick} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={() => setScan(true)}>
              <QrCode className="size-4" />
              Skanuj QR
            </Button>
            <Button variant="secondary" onClick={() => setReceipt(true)}>
              <Camera className="size-4" />
              Paragon
            </Button>
          </div>
          {note && <p className="mt-3 text-base text-primary">{note}</p>}
        </div>
      )}

      {view === "karta" && (
        <>
          <section className="mt-3 surface p-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              HypEat · zwrot 10%
            </p>
            <p className="mt-1 font-display text-4xl tabular-nums text-foreground">{points} pkt</p>
            <p className="mt-2 text-base text-muted-foreground">
              1 pkt = 1 zł, w każdej restauracji programu. Lokal oddaje 2% obrotu na pieska.
            </p>
            {adopted && (
              <p className="mt-2 text-base">
                Adopcja: <span className="font-medium">{adopted.name}</span>
              </p>
            )}
            <div className="mx-auto mt-4 max-w-48">
              <QrImg value={cardQrValue(points)} label="Kod Twojej karty" className="w-full" />
              <p className="mt-2 text-center text-sm text-muted-foreground">Karta przy kasie</p>
            </div>
          </section>

          <section className="mt-3 surface p-4">
            <h3 className="font-display text-xl text-foreground">Po rachunku</h3>
            <ol className="mt-3 space-y-2 text-base">
              <li>1. Zeskanuj QR restauracji.</li>
              <li>2. Zrób zdjęcie paragonu — odczytamy kwotę.</li>
              <li>3. 10% wraca na kartę, 2% na pieska lokalu.</li>
            </ol>
            {spot && (
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-base">
                Wybrany lokal: <b>{spot.name}</b>
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => setScan(true)}>
                <QrCode className="size-4" />
                Skanuj QR
              </Button>
              <Button variant="secondary" onClick={() => setReceipt(true)}>
                <Camera className="size-4" />
                Paragon
              </Button>
            </div>
            <Button className="mt-2 w-full" variant="outline" onClick={onRedeem}>
              Kupon od {MIN_REDEEM} pkt
            </Button>
            {note && <p className="mt-3 text-base text-primary">{note}</p>}
          </section>

          {coupons.length > 0 && (
            <section className="mt-3 surface p-4">
              <h3 className="font-display text-xl text-foreground">Kupony</h3>
              <ul className="mt-3 space-y-4">
                {coupons.slice(0, 4).map((c) => {
                  const place = SPOTS.find((s) => s.id === c.spotId);
                  return (
                    <li key={c.id} className="flex items-center gap-3 border-b border-border pb-3">
                      <QrImg
                        value={couponQrValue(c.id, c.value)}
                        label={`Kupon ${c.value} zł`}
                        className="size-20 shrink-0"
                      />
                      <div>
                        <p className="font-medium">{place?.name}</p>
                        <p className="tabular-nums text-primary">{c.value} zł{c.used ? " · użyty" : ""}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="mt-3 surface p-4">
            <h3 className="font-display text-xl text-foreground">Historia</h3>
            {ledger.length === 0 ? (
              <p className="mt-2 text-base text-muted-foreground">
                Zeskanuj kod po obiedzie. Albo otwórz przykładowy paragon, żeby zobaczyć zwrot.
              </p>
            ) : (
              <ul className="mt-2 space-y-2 text-base">
                {ledger.slice(0, 8).map((row) => {
                  const place = SPOTS.find((s) => s.id === row.spotId);
                  const label =
                    row.kind === "bill"
                      ? `Paragon ${row.amount} zł`
                      : row.kind === "redeem"
                        ? "Kupon"
                        : row.kind === "treat"
                          ? "Gratis / zniżka"
                          : row.kind === "payout"
                            ? "Przelew na pieska"
                            : "Check-in";
                  return (
                    <li key={row.id} className="flex justify-between gap-3">
                      <span className="min-w-0 truncate text-muted-foreground">
                        {label} · {place?.name}
                      </span>
                      <span className="tabular-nums font-medium">
                        {row.points > 0 ? "+" : ""}
                        {row.points}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          <div className="mt-3 space-y-3">
            <p className="text-base text-muted-foreground">Kody przy kasie — dotknij jak skan.</p>
          {FOOD_SPOTS.map((s) => {
            const d = dogById(SPONSOR[s.id] ?? "");
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSpot(s.id)}
                className="flex w-full items-center gap-3 surface p-3 text-left"
              >
                <QrImg value={spotQrValue(s.id)} label={`Kod ${s.name}`} className="size-24 shrink-0" />
                <span>
                  <b className="block font-display text-lg">{s.name}</b>
                  <span className="block text-sm text-muted-foreground">{s.area}</span>
                  <span className="mt-1 block text-sm">
                    Zwrot {Math.round(CASHBACK_RATE * 100)}% · piesek {d?.name ?? "—"}
                  </span>
                </span>
              </button>
            );
          })}
          </div>
        </>
      )}

      {view === "pieski" && (
        <>
          <section className="mt-3 surface p-4">
            <h3 className="font-display text-xl text-foreground">Wirtualna adopcja</h3>
            <p className="mt-1 text-base text-muted-foreground">
              2% rachunku idzie na pieska lokalu. Razem:{" "}
              <span className="tabular-nums font-medium text-foreground">{totalDogs.toFixed(0)} zł</span>
            </p>
          </section>
          <div className="mt-3 space-y-3">
            {DOGS.map((d) => {
              const funded = dogFunds[d.id] ?? 0;
              const pct = Math.min(100, Math.round((funded / d.goal) * 100));
              const houses = FOOD_SPOTS.filter((s) => SPONSOR[s.id] === d.id);
              const mine = adoptedDogId === d.id;
              return (
                <article key={d.id} className="surface p-3">
                  <div className="flex gap-3">
                    <img src={d.img} alt={d.name} className="img-frame size-24 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <h3 className="font-display text-xl text-foreground">{d.name}</h3>
                      <p className="text-sm text-muted-foreground">{d.age}</p>
                      <p className="mt-1 text-base">{d.story}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                    {funded.toFixed(2)} / {d.goal} zł · {houses.map((h) => h.name.split(" ")[0]).join(", ")}
                  </p>
                  <Button
                    className="mt-3"
                    variant={mine ? "default" : "secondary"}
                    onClick={() => {
                      adoptDog(mine ? null : d.id);
                      pushTurn({
                        role: "assistant",
                        text: mine
                          ? `Adopcja ${d.name} zdjęta.`
                          : `${d.name} jest Twoim pieskiem. Jedząc u ${houses.map((h) => h.name).join(" / ")} dokładasz do miski.`,
                      });
                    }}
                  >
                    {mine ? "Twoja adopcja" : "Adoptuj wirtualnie"}
                  </Button>
                </article>
              );
            })}
          </div>
        </>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        Demo księgowania. Check-in: {stamps.length} lokali. Umowa z lokalem przychodzi później.
      </p>

      <QrSheet open={scan} onClose={() => setScan(false)} onSpot={onSpot} />
      <ReceiptSheet open={receipt} onClose={() => setReceipt(false)} />
    </div>
  );
}
