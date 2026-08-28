import { FOOD_SPOTS } from "./catalog";

export function spotQrValue(id: string) {
  return `hypeat:spot:${id}`;
}

export function couponQrValue(id: string, value: number) {
  return `hypeat:kupon:${id}:${value}`;
}

export function cardQrValue(points: number) {
  return `hypeat:karta:${points}`;
}

export function memberQrValue(userId: string) {
  return `hypeat:czlonek:${userId}`;
}

export function parseSpotQr(text: string): string | null {
  const raw = text.trim();
  const m = raw.match(/hypeat:spot:([a-z0-9-]+)/i);
  if (m && FOOD_SPOTS.some((s) => s.id === m[1])) return m[1];
  if (FOOD_SPOTS.some((s) => s.id === raw)) return raw;
  try {
    const u = new URL(raw);
    const id = u.searchParams.get("spot");
    if (id && FOOD_SPOTS.some((s) => s.id === id)) return id;
  } catch {
    /* not a url */
  }
  const byName = FOOD_SPOTS.find((s) => raw.toLowerCase().includes(s.name.toLowerCase().slice(0, 8)));
  return byName?.id ?? null;
}
