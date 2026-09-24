import { ArtistId } from "./graph";

const STATS_KEY = "crossfade:stats:v1";
const GAME_PREFIX = "crossfade:game:v1:";
const SEEN_HOWTO_KEY = "crossfade:seen-howto:v1";
const CLIENT_ID_KEY = "crossfade:cid:v1";
const PLAYER_NAME_KEY = "crossfade:name:v1";

export type GameStatus = "playing" | "won" | "gaveup";

export interface GameState {
  number: number;
  chain: ArtistId[]; // includes the start artist at index 0
  status: GameStatus;
  hintsUsed: number;
  par: number;
}

export interface Stats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  lastWonNumber: number | null;
  // distribution of (hops used - par): 0 = perfect, capped at "3+"
  overPar: [number, number, number, number]; // [+0, +1, +2, +3 or more]
}

const EMPTY_STATS: Stats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastWonNumber: null,
  overPar: [0, 0, 0, 0],
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function getStats(): Stats {
  return read<Stats>(STATS_KEY, EMPTY_STATS);
}

// Record a finished daily game. Only the first completion of a given number
// affects stats — call this exactly once when a daily puzzle ends.
export function recordDaily(number: number, won: boolean, hopsUsed: number, par: number): Stats {
  const stats = getStats();
  stats.played += 1;

  if (won) {
    stats.won += 1;
    const bucket = Math.min(3, Math.max(0, hopsUsed - par));
    stats.overPar[bucket] += 1;
    const consecutive = stats.lastWonNumber === number - 1;
    stats.currentStreak = consecutive ? stats.currentStreak + 1 : 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.lastWonNumber = number;
  } else {
    stats.currentStreak = 0;
  }

  write(STATS_KEY, stats);
  return stats;
}

export function loadGame(number: number): GameState | null {
  return read<GameState | null>(GAME_PREFIX + number, null);
}

export function saveGame(state: GameState) {
  write(GAME_PREFIX + state.number, state);
}

export function hasSeenHowTo(): boolean {
  return read<boolean>(SEEN_HOWTO_KEY, false);
}

export function markSeenHowTo() {
  write(SEEN_HOWTO_KEY, true);
}

// Stable anonymous id so a device gets one leaderboard row per day (updatable).
export function getClientId(): string {
  let id = read<string>(CLIENT_ID_KEY, "");
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    write(CLIENT_ID_KEY, id);
  }
  return id;
}

export function getPlayerName(): string {
  return read<string>(PLAYER_NAME_KEY, "");
}

export function setPlayerName(name: string) {
  write(PLAYER_NAME_KEY, name.slice(0, 20));
}
