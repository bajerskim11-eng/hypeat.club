import type { Spot } from "./catalog";

export const UGC_POINTS = {
  photo: 12,
  video: 20,
  review: 8,
} as const;

export const UGC_DAILY_CAP = 60;

export type PostKind = keyof typeof UGC_POINTS;

export function mapsUrl(spot: Pick<Spot, "name" | "lat" | "lng">) {
  return `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}&query_display=${encodeURIComponent(spot.name)}`;
}

export function igSearchUrl(name: string) {
  return `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(name + " Katowice")}`;
}

export function googleReviewsUrl(spot: Pick<Spot, "name" | "area">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + " " + spot.area + " Katowice")}`;
}
