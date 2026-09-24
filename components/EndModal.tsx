"use client";

import { useEffect, useState } from "react";
import { Star, ShareNetwork, ChartBar, Sparkle, Trophy } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Modal } from "./Modal";

function useCountdown(msLeft: number) {
  const [ms, setMs] = useState(msLeft);
  useEffect(() => {
    setMs(msLeft);
    const t = setInterval(() => setMs((m) => Math.max(0, m - 1000)), 1000);
    return () => clearInterval(t);
  }, [msLeft]);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function EndModal({
  open,
  onClose,
  won,
  hopsUsed,
  score,
  hintsUsed,
  par,
  number,
  startName,
  endName,
  isDaily,
  shareText,
  challengeUrl,
  msLeft,
  onShowStats,
  onCreate,
  onLeaderboard,
  onCopied,
}: {
  open: boolean;
  onClose: () => void;
  won: boolean;
  hopsUsed: number;
  score: number;
  hintsUsed: number;
  par: number;
  number: number;
  startName: string;
  endName: string;
  isDaily: boolean;
  shareText: string;
  challengeUrl: string | null;
  msLeft: number;
  onShowStats: () => void;
  onCreate: () => void;
  onLeaderboard: () => void;
  onCopied: (what: string) => void;
}) {
  const countdown = useCountdown(msLeft);
  const over = hopsUsed - par;
  const stars = won ? (score >= 100 ? 3 : score >= 80 ? 2 : score >= 50 ? 1 : 0) : 0;
  const title = won
    ? over === 0
      ? "Perfect crossfade"
      : "Linked"
    : "The shortest link";

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      onCopied(label);
    } catch {
      onCopied("Couldn't copy");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        {won && (
          <div className="mb-3 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                <Star
                  size={30}
                  weight="fill"
                  className={i < stars ? "text-teal" : "text-surface-2"}
                />
              </motion.span>
            ))}
          </div>
        )}

        <p className="text-sm text-muted">
          {isDaily ? `Crossfade #${number}` : "Custom challenge"}
        </p>

        {won ? (
          <>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="tabular text-5xl font-semibold tracking-[-0.03em] text-ink">{score}</span>
              <span className="text-lg text-muted">/ 100</span>
            </div>
            <p className="mt-1 text-sm text-faint">
              {hopsUsed} {hopsUsed === 1 ? "song" : "songs"}
              {over === 0 && ", the shortest possible"}
              {hintsUsed > 0 &&
                ` · ${hintsUsed} ${hintsUsed === 1 ? "hint" : "hints"} (−${hintsUsed * 15})`}
            </p>
          </>
        ) : (
          <>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="tabular text-5xl font-semibold tracking-[-0.03em] text-ink">{par}</span>
              <span className="text-lg text-muted">{par === 1 ? "song" : "songs"}</span>
            </div>
            <p className="mt-1 text-sm text-faint">The shortest link.</p>
          </>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm">
          <span className="font-semibold text-coral-soft">{startName}</span>
          <span className="text-faint">→</span>
          <span className="font-semibold text-teal-soft">{endName}</span>
        </div>

        <div className="mt-6 w-full space-y-2.5">
          {isDaily ? (
            <button
              onClick={() => copy(shareText, "Result copied")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal px-5 py-3.5 text-[15px] font-semibold text-bg transition-transform active:scale-[0.98]"
            >
              <ShareNetwork size={19} weight="bold" /> Share result
            </button>
          ) : (
            challengeUrl && (
              <button
                onClick={() => copy(challengeUrl, "Challenge link copied")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal px-5 py-3.5 text-[15px] font-semibold text-bg transition-transform active:scale-[0.98]"
              >
                <ShareNetwork size={19} weight="bold" /> Copy challenge link
              </button>
            )
          )}

          <div className="flex gap-2.5">
            {isDaily && (
              <button
                onClick={onLeaderboard}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-2 active:scale-[0.98]"
              >
                <Trophy size={17} weight="bold" /> Board
              </button>
            )}
            {isDaily && (
              <button
                onClick={onShowStats}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-2 active:scale-[0.98]"
              >
                <ChartBar size={17} weight="bold" /> Stats
              </button>
            )}
            <button
              onClick={onCreate}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-2 active:scale-[0.98]"
            >
              <Sparkle size={17} weight="bold" /> {isDaily ? "Create" : "New"}
            </button>
          </div>
        </div>

        {isDaily && (
          <div className="mt-6 border-t border-line pt-4 text-center">
            <p className="text-xs text-faint">Next crossfade in</p>
            <p className="tabular mt-1 text-2xl font-semibold text-ink">{countdown}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
