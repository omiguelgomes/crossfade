"use client";

import { Question, ChartBar, Sparkle, Trophy } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink active:scale-90"
    >
      {children}
    </button>
  );
}

export function Header({
  onHowTo,
  onStats,
  onCreate,
  onLeaderboard,
}: {
  onHowTo: () => void;
  onStats: () => void;
  onCreate: () => void;
  onLeaderboard: () => void;
}) {
  return (
    <header className="app-chrome sticky top-0 z-40">
      <div className="relative mx-auto flex w-full max-w-lg items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-0.5">
          <IconButton label="How to play" onClick={onHowTo}>
            <Question size={22} weight="bold" />
          </IconButton>
          <IconButton label="Leaderboard" onClick={onLeaderboard}>
            <Trophy size={20} weight="bold" />
          </IconButton>
        </div>

        {/* The wordmark's second half fades toward the faint neutral. Absolutely
            centred so the flanking icon groups can be uneven without shifting it. */}
        <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-[22px] font-semibold tracking-[-0.03em]">
          <span className="text-ink">Cross</span>
          <span className="text-faint">fade</span>
        </h1>

        <div className="flex items-center gap-0.5">
          <IconButton label="Create a challenge" onClick={onCreate}>
            <Sparkle size={21} weight="bold" />
          </IconButton>
          <IconButton label="Statistics" onClick={onStats}>
            <ChartBar size={21} weight="bold" />
          </IconButton>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
