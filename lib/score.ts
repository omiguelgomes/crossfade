// A single, legible score. Higher is better, starts at 100 for a flawless run.
// A hint costs more than a detour, so leaning on hints visibly lowers it.
// Used live during play and for the global leaderboard ranking.
export const HINT_PENALTY = 15;
export const OVER_PAR_PENALTY = 10;

export function computeScore(songsUsed: number, hints: number, par: number): number {
  const overPar = Math.max(0, songsUsed - par);
  return Math.max(0, 100 - overPar * OVER_PAR_PENALTY - hints * HINT_PENALTY);
}
