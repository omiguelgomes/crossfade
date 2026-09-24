import { ArtistId, MAIN_COMPONENT, neighbors, shortestPath, exists } from "./graph";

// Launch epoch — puzzle #1 is this day.
const EPOCH = Date.UTC(2025, 0, 1); // 2025-01-01
const DAY_MS = 86_400_000;

export interface Puzzle {
  start: ArtistId;
  end: ArtistId;
  par: number; // shortest number of hops
}

// Deterministic PRNG (mulberry32) so a given day yields the same puzzle for
// everyone, with no server involved.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Local-day number since launch (matches how Wordle rolls over at local midnight).
export function puzzleNumber(date = new Date()): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((local - EPOCH) / DAY_MS) + 1;
}

// Endpoints should be recognisable, so only pick artists with a few collabs.
const ELIGIBLE = MAIN_COMPONENT.filter((id) => neighbors(id).length >= 3).sort();

// Single-source BFS returning hop-distance to every reachable node.
function distancesFrom(start: ArtistId): Map<ArtistId, number> {
  const dist = new Map<ArtistId, number>([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    const d = dist.get(cur)!;
    for (const nb of neighbors(cur)) {
      if (!dist.has(nb)) {
        dist.set(nb, d + 1);
        queue.push(nb);
      }
    }
  }
  return dist;
}

// A puzzle for a given day. Difficulty target: shortest path of 3-4 hops.
export function getPuzzle(number: number): Puzzle {
  const rand = mulberry32(number * 2654435761);
  const start = ELIGIBLE[Math.floor(rand() * ELIGIBLE.length)];
  const dist = distancesFrom(start);

  const pick = (lo: number, hi: number) =>
    ELIGIBLE.filter((id) => {
      const d = dist.get(id);
      return d !== undefined && d >= lo && d <= hi;
    });

  let targets = pick(3, 4);
  if (targets.length === 0) targets = pick(2, 5);
  if (targets.length === 0) targets = ELIGIBLE.filter((id) => id !== start);

  const end = targets[Math.floor(rand() * targets.length)];
  return { start, end, par: dist.get(end) ?? 0 };
}

export function getDailyPuzzle(date = new Date()): Puzzle & { number: number } {
  const number = puzzleNumber(date);
  return { ...getPuzzle(number), number };
}

// Milliseconds until the next local midnight (for the "next puzzle" countdown).
export function msUntilTomorrow(now = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

// ---- Custom challenges ----
// Encoded simply as readable artist ids in the URL: ?a=drake&b=daft-punk

export function encodeChallenge(start: ArtistId, end: ArtistId): string {
  const params = new URLSearchParams({ a: start, b: end });
  return `?${params.toString()}`;
}

export function decodeChallenge(search: string): Puzzle | null {
  const params = new URLSearchParams(search);
  const start = params.get("a");
  const end = params.get("b");
  if (!start || !end || !exists(start) || !exists(end) || start === end) return null;
  const path = shortestPath(start, end);
  if (!path) return null;
  return { start, end, par: path.length - 1 };
}
