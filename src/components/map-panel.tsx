import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { AGENTS, SPOTS, type Spot } from "@/lib/catalog";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";

type LeafletMap = { setView: (ll: [number, number], z: number) => void; remove: () => void };

export function MapPanel() {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const setTab = useGuide((s) => s.setTab);
  const addStamp = useGuide((s) => s.addStamp);
  const pushTurn = useGuide((s) => s.pushTurn);
  const setCameraSpot = useGuide((s) => s.setCameraSpot);
  const setAgent = useGuide((s) => s.setAgent);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !host.current || mapRef.current) return;
      const map = L.map(host.current);
      map.setView([50.2596, 19.0216], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      SPOTS.forEach((s) => {
        const m = L.circleMarker([s.lat, s.lng], {
          radius: 9,
          color: "#c4b08a",
          fillColor: "#c4b08a",
          fillOpacity: 0.9,
          weight: 2,
        });
        m.addTo(map);
        m.on("click", () => setSpot(s));
      });
      mapRef.current = map;
    };
    void boot();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const ag = spot ? AGENTS[spot.agent] : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={host} className="min-h-[240px] flex-1 bg-muted" />
      <div className="max-h-[42%] overflow-auto border-t border-border bg-card px-4 py-3">
        {spot && ag ? (
          <>
            <h3 className="font-display text-lg text-primary">{spot.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {spot.area} · {spot.tag}
              <br />
              {spot.note}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const fresh = addStamp(spot.id);
                  pushTurn({
                    role: "assistant",
                    text: fresh
                      ? `Pieczątka zbita: ${spot.name}.`
                      : `Tu już byłeś: ${spot.name}.`,
                  });
                }}
              >
                Check-in
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setCameraSpot(spot.id)}>
                Zdjęcie z {ag.name}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAgent(spot.agent);
                  setTab("feed");
                }}
              >
                Relacje
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTab("hunt")}>
                Polowanie
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAgent(spot.agent);
                  setTab("chat");
                  pushTurn({
                    role: "assistant",
                    text: `${ag.name} przy ${spot.name}. ${spot.note} ${spot.promo}`,
                  });
                }}
              >
                Pogadaj
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-display text-lg text-primary">Katowice</h3>
            <p className="text-sm text-muted-foreground">
              Wybierz pinezkę — lokale to punkty gry terenowej.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
