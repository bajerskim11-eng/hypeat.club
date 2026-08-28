import { FOOD_SPOTS } from "./catalog";

export type ClubVisit = {
  id: string;
  spotId: string;
  amount: number;
  points: number;
  dogPln: number;
  dogId: string | null;
  note: string;
  createdAt: string;
};

export type Badge = {
  id: string;
  name: string;
  hint: string;
  earned: boolean;
};

export function badgesFrom(visits: ClubVisit[]): Badge[] {
  const n = visits.length;
  const spots = new Set(visits.map((v) => v.spotId));
  const points = visits.reduce((a, v) => a + v.points, 0);
  const donated = visits.reduce((a, v) => a + v.dogPln, 0);
  const foodN = FOOD_SPOTS.length;
  return [
    { id: "first", name: "Pierwszy stół", hint: "Jedna wizyta w klubie", earned: n >= 1 },
    { id: "regular", name: "Stały gość", hint: "5 wpisów w pamiętniku", earned: n >= 5 },
    { id: "map", name: "Po sieci", hint: "3 różne lokale", earned: spots.size >= 3 },
    { id: "hundred", name: "100 pkt", hint: "Setka punktów z rachunków", earned: points >= 100 },
    { id: "angel", name: "Miska", hint: "20 zł dla piesków", earned: donated >= 20 },
    { id: "ten", name: "Sezon", hint: "10 wizyt", earned: n >= 10 },
    { id: "nikisz", name: "Nikisz", hint: "Wpis z Cafe Byfyj", earned: spots.has("byfyj") },
    { id: "full", name: "Pełna karta", hint: "Wszystkie restauracje programu", earned: FOOD_SPOTS.every((s) => spots.has(s.id)) && foodN > 0 },
    { id: "host", name: "Gospodarz", hint: "500 pkt", earned: points >= 500 },
    { id: "pack", name: "Wataha", hint: "100 zł na przytulisko", earned: donated >= 100 },
  ];
}

export function clubTotals(visits: ClubVisit[]) {
  return {
    visits: visits.length,
    points: visits.reduce((a, v) => a + v.points, 0),
    donated: Math.round(visits.reduce((a, v) => a + v.dogPln, 0) * 100) / 100,
    spots: new Set(visits.map((v) => v.spotId)).size,
  };
}
