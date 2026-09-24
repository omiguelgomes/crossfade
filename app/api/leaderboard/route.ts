import { NextRequest, NextResponse } from "next/server";
import { computeScore } from "@/lib/score";

// Global daily leaderboard backed by a Redis REST store (Upstash / Vercel KV).
// If no store is configured the API reports `enabled: false` and the UI falls
// back to a local-only view — the game never breaks.

const URL_ENV = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const enabled = Boolean(URL_ENV && TOKEN_ENV);

interface Entry {
  name: string;
  hops: number;
  hints: number;
  score: number;
  ts: number;
}

// Run Redis commands through the Upstash REST pipeline endpoint.
async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${URL_ENV}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN_ENV}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const json = (await res.json()) as { result: unknown }[];
  return json.map((r) => r.result);
}

const setKey = (n: number) => `cf:lb:${n}`;
const hashKey = (n: number) => `cf:lbn:${n}`;

function clampName(name: unknown): string {
  return String(name ?? "")
    .replace(/[^\p{L}\p{N} _.'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20);
}

export async function GET(req: NextRequest) {
  const number = Number(req.nextUrl.searchParams.get("n"));
  if (!enabled) return NextResponse.json({ enabled: false, entries: [] });
  if (!Number.isFinite(number)) {
    return NextResponse.json({ enabled: true, entries: [] });
  }
  try {
    const [ids, details] = (await redis([
      // Highest score first (REV); we re-sort below for stable tie-breaks.
      ["ZRANGE", setKey(number), 0, 99, "REV"],
      ["HGETALL", hashKey(number)],
    ])) as [string[], string[]];

    const detailMap = new Map<string, Entry>();
    for (let i = 0; i < (details?.length ?? 0); i += 2) {
      try {
        detailMap.set(details[i], JSON.parse(details[i + 1]) as Entry);
      } catch {
        // skip malformed
      }
    }
    const entries = (ids ?? [])
      .map((id) => detailMap.get(id))
      .filter((e): e is Entry => Boolean(e))
      .sort(
        (a, b) =>
          b.score - a.score || a.hops - b.hops || a.hints - b.hints || a.ts - b.ts,
      );

    return NextResponse.json({ enabled: true, entries });
  } catch {
    return NextResponse.json({ enabled: true, entries: [], error: true });
  }
}

export async function POST(req: NextRequest) {
  if (!enabled) return NextResponse.json({ enabled: false });
  let body: {
    number?: number;
    cid?: string;
    name?: string;
    hops?: number;
    hints?: number;
    par?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const number = Number(body.number);
  const hops = Number(body.hops);
  const hints = Math.max(0, Number(body.hints) || 0);
  const par = Math.max(1, Number(body.par) || hops);
  const cid = String(body.cid ?? "").slice(0, 64);
  const name = clampName(body.name) || "Anonymous";
  if (!Number.isFinite(number) || !Number.isFinite(hops) || hops <= 0 || !cid) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Higher score is better; recomputed server-side so it can't be tampered with.
  const score = computeScore(hops, hints, par);
  const entry: Entry = { name, hops, hints, score, ts: Date.now() };

  try {
    await redis([
      ["ZADD", setKey(number), score, cid],
      ["HSET", hashKey(number), cid, JSON.stringify(entry)],
      // Keep daily boards ~10 days so the store stays small.
      ["EXPIRE", setKey(number), 864000],
      ["EXPIRE", hashKey(number), 864000],
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
