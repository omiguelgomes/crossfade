import { getClientId } from "./storage";

export interface BoardEntry {
  name: string;
  hops: number;
  hints: number;
  score: number;
  ts: number;
}

export interface Board {
  enabled: boolean;
  entries: BoardEntry[];
  error?: boolean;
}

export async function fetchBoard(number: number): Promise<Board> {
  try {
    const res = await fetch(`/api/leaderboard?n=${number}`, { cache: "no-store" });
    if (!res.ok) return { enabled: false, entries: [] };
    return (await res.json()) as Board;
  } catch {
    return { enabled: false, entries: [] };
  }
}

export async function submitScore(
  number: number,
  name: string,
  hops: number,
  hints: number,
  par: number,
): Promise<boolean> {
  try {
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, name, hops, hints, par, cid: getClientId() }),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { ok?: boolean; enabled?: boolean };
    return Boolean(json.ok);
  } catch {
    return false;
  }
}
