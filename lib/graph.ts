import { EDGES } from "./graph-data";

export type ArtistId = string;

export interface Artist {
  id: ArtistId;
  name: string;
}

// A playable move: the song you write, and the artist it takes you to.
export interface Move {
  song: string;
  to: ArtistId;
  toName: string;
}

// Slugify a display name into a stable, URL-safe id.
export function toId(name: string): ArtistId {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build the graph once at module load.
const nameById = new Map<ArtistId, string>();
// neighbour id -> the song that links the two artists
const adjacency = new Map<ArtistId, Map<ArtistId, string>>();

function ensure(name: string): ArtistId {
  const id = toId(name);
  if (!nameById.has(id)) {
    nameById.set(id, name);
    adjacency.set(id, new Map());
  }
  return id;
}

for (const [a, b, song] of EDGES) {
  const ida = ensure(a);
  const idb = ensure(b);
  if (ida === idb) continue;
  // Keep the first song encountered for a given pair (data is authored so the
  // most iconic collab comes first).
  if (!adjacency.get(ida)!.has(idb)) adjacency.get(ida)!.set(idb, song);
  if (!adjacency.get(idb)!.has(ida)) adjacency.get(idb)!.set(ida, song);
}

export const ARTISTS: Artist[] = [...nameById.entries()]
  .map(([id, name]) => ({ id, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getName(id: ArtistId): string {
  return nameById.get(id) ?? id;
}

export function exists(id: ArtistId): boolean {
  return nameById.has(id);
}

export function neighbors(id: ArtistId): ArtistId[] {
  return [...(adjacency.get(id)?.keys() ?? [])];
}

export function areConnected(a: ArtistId, b: ArtistId): boolean {
  return adjacency.get(a)?.has(b) ?? false;
}

// The song linking two adjacent artists (if any).
export function songBetween(a: ArtistId, b: ArtistId): string | undefined {
  return adjacency.get(a)?.get(b);
}

// Every song you can write from `id`, one entry per destination artist,
// sorted by song title for a stable, searchable list.
export function movesFrom(id: ArtistId): Move[] {
  const map = adjacency.get(id);
  if (!map) return [];
  return [...map.entries()]
    .map(([to, song]) => ({ song, to, toName: getName(to) }))
    .sort((a, b) => a.song.localeCompare(b.song) || a.toName.localeCompare(b.toName));
}

// Breadth-first shortest path (by number of hops). Returns the list of ids
// from `start` to `end` inclusive, or null if unreachable.
export function shortestPath(start: ArtistId, end: ArtistId): ArtistId[] | null {
  if (start === end) return [start];
  if (!exists(start) || !exists(end)) return null;

  const prev = new Map<ArtistId, ArtistId | null>([[start, null]]);
  const queue: ArtistId[] = [start];

  while (queue.length) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current)?.keys() ?? []) {
      if (prev.has(next)) continue;
      prev.set(next, current);
      if (next === end) {
        const path: ArtistId[] = [end];
        let step: ArtistId | null = current;
        while (step !== null) {
          path.push(step);
          step = prev.get(step) ?? null;
        }
        return path.reverse();
      }
      queue.push(next);
    }
  }
  return null;
}

// The number of hops on the shortest path, or Infinity if unreachable.
export function distance(start: ArtistId, end: ArtistId): number {
  const path = shortestPath(start, end);
  return path ? path.length - 1 : Infinity;
}

// The best next move from `from` toward `to`: the first edge on a shortest
// path. Powers hints so a player never gets stuck on an artist they don't know.
export function hintStep(from: ArtistId, to: ArtistId): Move | null {
  const path = shortestPath(from, to);
  if (!path || path.length < 2) return null;
  const next = path[1];
  return { song: songBetween(from, next) ?? "", to: next, toName: getName(next) };
}

// Connected components, largest first.
function computeComponents(): ArtistId[][] {
  const seen = new Set<ArtistId>();
  const components: ArtistId[][] = [];
  for (const id of nameById.keys()) {
    if (seen.has(id)) continue;
    const comp: ArtistId[] = [];
    const stack = [id];
    seen.add(id);
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      for (const nb of adjacency.get(cur)?.keys() ?? []) {
        if (!seen.has(nb)) {
          seen.add(nb);
          stack.push(nb);
        }
      }
    }
    components.push(comp);
  }
  return components.sort((a, b) => b.length - a.length);
}

export const COMPONENTS = computeComponents();
export const MAIN_COMPONENT: ArtistId[] = COMPONENTS[0] ?? [];
