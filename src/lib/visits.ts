import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { cashbackOf, dogShareOf, SPONSOR } from "./loyalty";
import { badgesFrom, clubTotals, type ClubVisit } from "./club";
import { FOOD_SPOTS } from "./catalog";

type Row = {
  id: string;
  spotId: string;
  amount: string;
  points: number;
  dogPln: string;
  dogId: string | null;
  note: string;
  createdAt: string;
};

function toVisit(r: Row): ClubVisit {
  return {
    id: r.id,
    spotId: r.spotId,
    amount: Number(r.amount),
    points: Number(r.points),
    dogPln: Number(r.dogPln),
    dogId: r.dogId,
    note: r.note ?? "",
    createdAt: r.createdAt,
  };
}

async function loadVisits(userId: string): Promise<ClubVisit[]> {
  const sql = await getSql();
  const rows = await sql<Row>`
    select
      id,
      spot_id as "spotId",
      amount::text as amount,
      points,
      dog_pln::text as "dogPln",
      dog_id as "dogId",
      note,
      created_at::text as "createdAt"
    from visits
    where user_id = ${userId}
    order by created_at desc
  `;
  return rows.map(toVisit);
}

export const getClub = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const visits = await loadVisits(context.userId);
    return {
      visits,
      totals: clubTotals(visits),
      badges: badgesFrom(visits),
    };
  });

export const addVisit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { spotId: string; amount: number; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const spot = FOOD_SPOTS.find((s) => s.id === data.spotId);
    if (!spot || !(data.amount > 0)) return { ok: false as const };
    const points = cashbackOf(data.amount);
    const dogPln = dogShareOf(data.amount);
    const dogId = SPONSOR[data.spotId] ?? null;
    const id = crypto.randomUUID();
    const note = (data.note ?? "").trim().slice(0, 280);
    const sql = await getSql();
    await sql`
      insert into visits (id, user_id, spot_id, amount, points, dog_pln, dog_id, note, channel)
      values (${id}, ${context.userId}, ${data.spotId}, ${data.amount}, ${points}, ${dogPln}, ${dogId}, ${note}, ${"app"})
    `;
    const visits = await loadVisits(context.userId);
    return {
      ok: true as const,
      visit: visits.find((v) => v.id === id) ?? null,
      totals: clubTotals(visits),
      badges: badgesFrom(visits),
    };
  });
