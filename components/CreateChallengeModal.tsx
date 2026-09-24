"use client";

import { useState } from "react";
import { ArrowClockwise, LinkSimple, Play, Shuffle } from "@phosphor-icons/react";
import { Modal } from "./Modal";
import { ArtistSearch } from "./ArtistSearch";
import { ArtistId, distance, getName } from "@/lib/graph";
import { encodeChallenge, getPuzzle } from "@/lib/daily";

export function CreateChallengeModal({
  open,
  onClose,
  onPlay,
  onCopied,
}: {
  open: boolean;
  onClose: () => void;
  onPlay: (start: ArtistId, end: ArtistId) => void;
  onCopied: (label: string) => void;
}) {
  const [start, setStart] = useState<ArtistId | null>(null);
  const [end, setEnd] = useState<ArtistId | null>(null);

  const par = start && end ? distance(start, end) : null;
  const ready = start && end && start !== end && par !== null && isFinite(par);

  function reset() {
    setStart(null);
    setEnd(null);
  }

  function surprise() {
    const p = getPuzzle(Math.floor(Math.random() * 1_000_000_000));
    setStart(p.start);
    setEnd(p.end);
  }

  async function copyLink() {
    if (!start || !end) return;
    const url = `${window.location.origin}/${encodeChallenge(start, end)}`;
    try {
      await navigator.clipboard.writeText(url);
      onCopied("Challenge link copied");
    } catch {
      onCopied("Couldn't copy");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a challenge">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Pick a start and a target, or let us throw you a pair.
          </p>
          <button
            onClick={surprise}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink active:scale-95"
          >
            <Shuffle size={14} weight="bold" /> Surprise me
          </button>
        </div>

        <Field label="Start" tint="var(--color-coral)">
          {start ? (
            <Chip name={getName(start)} onClear={() => setStart(null)} tint="var(--color-coral)" />
          ) : (
            <ArtistSearch
              onSelect={setStart}
              exclude={end ? new Set([end]) : undefined}
              placeholder="First artist…"
            />
          )}
        </Field>

        <Field label="Target" tint="var(--color-teal)">
          {end ? (
            <Chip name={getName(end)} onClear={() => setEnd(null)} tint="var(--color-teal)" />
          ) : (
            <ArtistSearch
              onSelect={setEnd}
              exclude={start ? new Set([start]) : undefined}
              placeholder="Second artist…"
            />
          )}
        </Field>

        {start && end && (
          <div className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-center text-sm">
            {ready ? (
              <span className="text-muted">
                Shortest link:{" "}
                <span className="tabular font-semibold text-ink">{par}</span>{" "}
                {par === 1 ? "song" : "songs"}
              </span>
            ) : (
              <span className="text-coral-soft">These two can&apos;t be linked. Try another pair.</span>
            )}
          </div>
        )}

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={reset}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line text-muted transition-colors hover:bg-surface-2 active:scale-95"
            aria-label="Reset"
          >
            <ArrowClockwise size={18} weight="bold" />
          </button>
          <button
            disabled={!ready}
            onClick={copyLink}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors enabled:hover:bg-surface-2 enabled:active:scale-[0.98] disabled:opacity-35"
          >
            <LinkSimple size={17} weight="bold" /> Copy link
          </button>
          <button
            disabled={!ready}
            onClick={() => ready && onPlay(start!, end!)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-bg transition-transform enabled:active:scale-[0.98] disabled:opacity-35"
          >
            <Play size={17} weight="fill" /> Play now
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  tint,
  children,
}: {
  label: string;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium" style={{ color: tint }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({ name, onClear, tint }: { name: string; onClear: () => void; tint: string }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border px-4 py-3"
      style={{ borderColor: `${tint}55`, background: `${tint}12` }}
    >
      <span className="font-medium text-ink">{name}</span>
      <button
        onClick={onClear}
        className="text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        Change
      </button>
    </div>
  );
}
