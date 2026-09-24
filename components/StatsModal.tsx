"use client";

import { Modal } from "./Modal";
import { Stats } from "@/lib/storage";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular text-3xl font-semibold text-ink">{value}</span>
      <span className="mt-1 text-center text-xs leading-tight text-faint">{label}</span>
    </div>
  );
}

const OVER_PAR_LABELS = ["Perfect", "+1", "+2", "+3 or more"];

export function StatsModal({
  open,
  onClose,
  stats,
}: {
  open: boolean;
  onClose: () => void;
  stats: Stats;
}) {
  const winPct = stats.played ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxBar = Math.max(1, ...stats.overPar);

  return (
    <Modal open={open} onClose={onClose} title="Statistics">
      <div className="grid grid-cols-4 gap-2">
        <Stat value={stats.played} label="Played" />
        <Stat value={`${winPct}%`} label="Win rate" />
        <Stat value={stats.currentStreak} label="Streak" />
        <Stat value={stats.maxStreak} label="Best streak" />
      </div>

      <div className="mt-7">
        <h3 className="mb-3 text-sm font-semibold text-muted">Hops over par</h3>
        {stats.won === 0 ? (
          <p className="text-sm text-faint">Win a puzzle to start your record.</p>
        ) : (
          <div className="space-y-2">
            {stats.overPar.map((count, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-faint">{OVER_PAR_LABELS[i]}</span>
                <div className="h-6 flex-1">
                  <div
                    className="flex h-full items-center justify-end rounded-md px-2"
                    style={{
                      width: `${Math.max(8, (count / maxBar) * 100)}%`,
                      background: i === 0 ? "var(--color-teal)" : "var(--color-surface-2)",
                    }}
                  >
                    <span
                      className={`tabular text-xs font-semibold ${
                        i === 0 ? "text-bg" : "text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
