import { AGENTS, SPOTS, haversineMeters } from "@/lib/catalog";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";

const KIND_PL = { food: "jedzenie", shop: "sklep", fun: "rozrywka", story: "historia" } as const;

export function HuntPanel() {
  const agentId = useGuide((s) => s.agentId);
  const pos = useGuide((s) => s.pos);
  const setPos = useGuide((s) => s.setPos);
  const addStamp = useGuide((s) => s.addStamp);
  const setCameraSpot = useGuide((s) => s.setCameraSpot);
  const pushTurn = useGuide((s) => s.pushTurn);
  const setTab = useGuide((s) => s.setTab);

  const pool =
    !agentId || AGENTS[agentId].kind === "all"
      ? SPOTS
      : SPOTS.filter((s) => s.kind === AGENTS[agentId].kind);
  const ranked = pool.map((s) => ({
    s,
    m: pos ? haversineMeters(pos.lat, pos.lng, s.lat, s.lng) : null,
  })).sort((a, b) => (a.m ?? 9e9) - (b.m ?? 9e9));
  const nearest = ranked[0];

  function enableGps() {
    if (!navigator.geolocation) {
      pushTurn({ role: "assistant", text: "Brak GPS w tej przeglądarce." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => pushTurn({ role: "assistant", text: "Nie mam zgody na lokalizację. Użyj trybu demo." }),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
      <section className="surface p-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Radar
        </p>
        <p className="mt-1 font-display text-2xl tabular-nums text-primary">
          {!pos
            ? "brak pozycji"
            : nearest.m !== null && nearest.m < 1000
              ? `${Math.round(nearest.m)} m do ${nearest.s.name}`
              : `${((nearest.m ?? 0) / 1000).toFixed(1)} km do ${nearest.s.name}`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={enableGps}>
            Włącz GPS
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPos({ lat: 50.2596, lng: 19.0216 });
              setTab("chat");
              pushTurn({
                role: "assistant",
                text: "Stoimy na Rynku. Stąd Hopla skacze do AiOLI, Fachura do Galerii, Hanys do Rialta.",
              });
            }}
          >
            Tryb demo: Rynek
          </Button>
        </div>
      </section>

      <div className="mt-4 space-y-3">
        {ranked.map(({ s, m }) => {
          const ag = AGENTS[s.agent];
          const near = m !== null && m < 120;
          return (
            <article key={s.id} className="surface p-4">
              <h3 className="font-display text-lg text-primary">{s.name}</h3>
              <p className="text-sm text-muted-foreground">
                {ag.name} · {KIND_PL[s.kind]} · {s.area}
                {m !== null ? ` · ${Math.round(m)} m` : ""}
              </p>
              <p className="mt-2 text-sm">{near ? "Bebok w zasięgu — gadaj i rób zdjęcie." : s.promo}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const fresh = addStamp(s.id);
                    pushTurn({
                      role: "assistant",
                      text: fresh ? `Pieczątka: ${s.name}.` : `Tu już byłeś: ${s.name}.`,
                    });
                  }}
                >
                  Check-in
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setCameraSpot(s.id)}>
                  Zdjęcie
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
