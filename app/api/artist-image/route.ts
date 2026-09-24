import { NextRequest, NextResponse } from "next/server";

// Resolves an artist name to a photo URL via Deezer's public API, cached in the
// same Redis store as the leaderboard. Falls back to live lookups when no store
// is configured; on any failure returns { url: null } and the UI shows a
// gradient monogram instead — an image is never required to render.

const URL_ENV = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const cacheEnabled = Boolean(URL_ENV && TOKEN_ENV);

const CACHE_TTL = 60 * 60 * 24 * 30; // 30 days
const MISS = "∅"; // sentinel cached when Deezer has no match

async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${URL_ENV}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_ENV}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const json = (await res.json()) as { result: unknown }[];
  return json.map((r) => r.result);
}

async function fromDeezer(name: string): Promise<string | null> {
  const res = await fetch(
    `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    data?: { picture_big?: string; picture_medium?: string }[];
  };
  const artist = data.data?.[0];
  return artist?.picture_big || artist?.picture_medium || null;
}

export async function GET(req: NextRequest) {
  const id = (req.nextUrl.searchParams.get("id") || "").slice(0, 80);
  const name = (req.nextUrl.searchParams.get("name") || "").slice(0, 120);
  if (!id || !name) return NextResponse.json({ url: null });

  const key = `cf:img:${id}`;

  try {
    if (cacheEnabled) {
      const [cached] = (await redis([["GET", key]])) as [string | null];
      if (cached !== null && cached !== undefined) {
        return NextResponse.json({ url: cached === MISS ? null : cached });
      }
    }

    const url = await fromDeezer(name);

    if (cacheEnabled) {
      await redis([["SET", key, url ?? MISS, "EX", CACHE_TTL]]);
    }
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ url: null });
  }
}
