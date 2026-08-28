import { FOOD_SPOTS } from "./catalog";
import { SPONSOR } from "./loyalty";

export const SHELTER = {
  name: "Przytulisko Kąsek",
  place: "Katowice · demo",
  note: "Partnerskie przytulisko programu. 2% obrotu lokalu trafia tu po zatwierdzeniu przelewu w panelu.",
};

export const VENUE_PIN: Record<string, string> = {
  aioli: "1010",
  basiliana: "2020",
  zurownia: "3030",
  kaktusy: "4040",
  sztolnia: "5050",
  max: "6060",
  byfyj: "7070",
};

export const REWARDS = [
  { id: "zniżka10", label: "Zniżka 10 zł", points: 10, house: false },
  { id: "kawa", label: "Kawa gratis", points: 0, house: true },
  { id: "deser", label: "Deser gratis", points: 35, house: false },
] as const;

export type SaleChannel = "salon" | "dowoz" | "app";

export const CHANNEL_LABEL: Record<SaleChannel, string> = {
  salon: "Sala",
  dowoz: "Dowóz",
  app: "Aplikacja gościa",
};

export function venueById(id: string) {
  return FOOD_SPOTS.find((s) => s.id === id);
}

export function pinOk(spotId: string, pin: string) {
  return VENUE_PIN[spotId] === pin.trim();
}

export function widgetSnippet(spotId: string) {
  return `<iframe src="/wtyczka?spot=${spotId}" title="HypEat piesek" width="320" height="430" style="border:0;border-radius:16px"></iframe>`;
}

export function dogIdForSpot(spotId: string) {
  return SPONSOR[spotId];
}
