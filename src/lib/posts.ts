import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { FOOD_SPOTS } from "./catalog";
import { UGC_DAILY_CAP, UGC_POINTS, type PostKind } from "./social";

export type FeedPost = {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  spotId: string;
  kind: PostKind;
  caption: string;
  media: string | null;
  points: number;
  likes: number;
  createdAt: string;
  liked: boolean;
};

type Row = {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  spotId: string;
  kind: string;
  caption: string;
  media: string | null;
  points: number;
  likes: number;
  createdAt: string;
  liked: boolean | number | string;
};

function toPost(r: Row): FeedPost {
  return {
    id: r.id,
    userId: r.userId,
    authorName: r.authorName,
    authorAvatar: r.authorAvatar,
    spotId: r.spotId,
    kind: r.kind as PostKind,
    caption: r.caption,
    media: r.media,
    points: Number(r.points),
    likes: Number(r.likes),
    createdAt: r.createdAt,
    liked: r.liked === true || r.liked === 1 || r.liked === "1" || r.liked === "t",
  };
}

function feedSql(filter: "all" | "spot" | "user") {
  const extra =
    filter === "spot" ? "and p.spot_id = $1" : filter === "user" ? "and p.user_id = $1" : "";
  return `
    select
      p.id,
      p.user_id as "userId",
      p.author_name as "authorName",
      p.author_avatar as "authorAvatar",
      p.spot_id as "spotId",
      p.kind,
      p.caption,
      p.media,
      p.points,
      0 as likes,
      p.created_at::text as "createdAt",
      false as liked
    from posts p
    where 1=1 ${extra}
    order by p.created_at desc
    limit 60
  `;
}

export const listFeed = createServerFn({ method: "POST" })
  .validator((input?: { spotId?: string; userId?: string; viewerId?: string }) => input ?? {})
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.spotId) {
      const rows = await sql.query<Row>(feedSql("spot"), [data.spotId]);
      return rows.map(toPost);
    }
    if (data.userId) {
      const rows = await sql.query<Row>(feedSql("user"), [data.userId]);
      return rows.map(toPost);
    }
    const rows = await sql.query<Row>(feedSql("all"));
    return rows.map(toPost);
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { spotId: string; kind: PostKind; caption: string; media?: string; authorName?: string; authorAvatar?: string | null }) =>
      input,
  )
  .handler(async ({ context, data }) => {
    const spot = FOOD_SPOTS.find((s) => s.id === data.spotId);
    const kind = data.kind;
    if (!spot || !(kind in UGC_POINTS)) return { ok: false as const, reason: "spot" };
    const caption = data.caption.trim().slice(0, 400);
    if (kind === "review" && caption.length < 8) return { ok: false as const, reason: "caption" };
    if ((kind === "photo" || kind === "video") && !data.media) return { ok: false as const, reason: "media" };
    if (data.media && data.media.length > 220_000) return { ok: false as const, reason: "size" };
    const media = data.media ?? null;
    const sql = await getSql();
    const today = await sql.query<{ pts: number }>(
      `select coalesce(sum(points),0)::int as pts from posts
       where user_id = $1 and created_at >= current_date`,
      [context.userId],
    );
    const used = Number(today[0]?.pts ?? 0);
    if (used >= UGC_DAILY_CAP) return { ok: false as const, reason: "cap" };
    const award = Math.min(UGC_POINTS[kind], UGC_DAILY_CAP - used);
    const id = crypto.randomUUID();
    const name = (data.authorName ?? "Członek").slice(0, 80);
    const avatar = data.authorAvatar ?? null;
    await sql.query(
      `insert into posts (id, user_id, author_name, author_avatar, spot_id, kind, caption, media, points)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, context.userId, name, avatar, data.spotId, kind, caption, media, award],
    );
    return { ok: true as const, id, points: award };
  });

export const toggleLike = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((postId: string) => postId)
  .handler(async ({ context, data: postId }) => {
    const sql = await getSql();
    const existing = await sql.query<{ post_id: string }>(
      `select post_id from post_likes where post_id = $1 and user_id = $2`,
      [postId, context.userId],
    );
    if (existing.length) {
      await sql.query(`delete from post_likes where post_id = $1 and user_id = $2`, [
        postId,
        context.userId,
      ]);
      return { liked: false };
    }
    await sql.query(`insert into post_likes (post_id, user_id) values ($1,$2)`, [
      postId,
      context.userId,
    ]);
    return { liked: true };
  });

export const ugcPoints = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<{ pts: number }>(
      `select coalesce(sum(points),0)::int as pts from posts where user_id = $1`,
      [context.userId],
    );
    return Number(rows[0]?.pts ?? 0);
  });
