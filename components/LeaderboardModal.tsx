"use client";

import { useEffect, useState } from "react";
import { Trophy, PencilSimple, Check, GlobeHemisphereWest } from "@phosphor-icons/react";
import { Modal } from "./Modal";
import { Board, BoardEntry, fetchBoard } from "@/lib/leaderboard";

const RANK_TINT = ["#f5c14e", "#c9ccd6", "#d08b5b"]; // gold / silver / bronze

export function LeaderboardModal({
  open,
  onClose,
  number,
  playerName,
  onSaveName,
  myResult,
}: {
  open: boolean;
  onClose: () => void;
  number: number;
  playerName: string;
  onSaveName: (name: string) => void;
  myResult: { hops: number; hints: number; score: number } | null;
}) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(playerName);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setBoard(null);
    fetchBoard(number)
      .then(setBoard)
      .finally(() => setLoading(false));
  }, [open, number]);

  useEffect(() => {
    setDraft(playerName);
  }, [playerName, open]);

  function refetch() {
    setLoading(true);
    fetchBoard(number)
      .then(setBoard)
      .finally(() => setLoading(false));
  }

  function saveName() {
    const clean = draft.trim().slice(0, 20);
    onSaveName(clean);
    setEditing(false);
    // Give the submit a beat, then refresh.
    setTimeout(refetch, 500);
  }

  const entries = board?.entries ?? [];

  return (
    <Modal open={open} onClose={onClose} title="Leaderboard">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Today · <span className="tabular font-semibold text-ink">Crossfade #{number}</span>
          </p>
          <span className="flex items-center gap-1.5 text-xs text-faint">
            <GlobeHemisphereWest size={14} weight="bold" /> Global
          </span>
        </div>

        {/* Your identity */}
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-3">
          {editing ? (
            <>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                maxLength={20}
                placeholder="Your name"
                className="w-full bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none"
              />
              <button
                onClick={saveName}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral text-bg transition-transform active:scale-90"
                aria-label="Save name"
              >
                <Check size={16} weight="bold" />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-[15px]">
                {playerName ? (
                  <span className="font-medium text-ink">{playerName}</span>
                ) : (
                  <span className="text-faint">Set a name to appear on the board</span>
                )}
              </span>
              <button
                onClick={() => setEditing(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink active:scale-95"
              >
                <PencilSimple size={13} weight="bold" /> {playerName ? "Edit" : "Add name"}
              </button>
            </>
          )}
        </div>

        {loading && <p className="py-6 text-center text-sm text-faint">Loading…</p>}

        {!loading && board && !board.enabled && (
          <div className="rounded-2xl border border-line bg-surface-2 px-4 py-6 text-center">
            <Trophy size={28} weight="fill" className="mx-auto text-faint" />
            <p className="mt-2 text-sm font-medium text-muted">Global board is warming up</p>
            <p className="mt-1 text-xs text-faint">
              {myResult
                ? `You scored ${myResult.score}/100 today (${myResult.hops} ${
                    myResult.hops === 1 ? "song" : "songs"
                  }).`
                : "Solve today's puzzle to post a score."}
            </p>
          </div>
        )}

        {!loading && board?.enabled && entries.length === 0 && (
          <p className="py-6 text-center text-sm text-faint">
            No scores yet. Be the first to link today&apos;s pair.
          </p>
        )}

        {!loading && board?.enabled && entries.length > 0 && (
          <ol className="space-y-1">
            {entries.map((e, i) => (
              <Row key={i} rank={i + 1} entry={e} mine={!!playerName && e.name === playerName} />
            ))}
          </ol>
        )}
      </div>
    </Modal>
  );
}

function Row({ rank, entry, mine }: { rank: number; entry: BoardEntry; mine: boolean }) {
  const tint = rank <= 3 ? RANK_TINT[rank - 1] : null;
  return (
    <li
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
        mine ? "bg-coral/10 ring-1 ring-coral/30" : ""
      }`}
    >
      <span
        className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold"
        style={
          tint
            ? { background: `${tint}22`, color: tint }
            : { background: "var(--color-surface-2)", color: "var(--color-faint)" }
        }
      >
        {rank}
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">
        {entry.name}
        {mine && <span className="ml-1.5 text-xs text-coral-soft">you</span>}
      </span>
      <span className="shrink-0 text-xs text-faint">
        {entry.hops} {entry.hops === 1 ? "song" : "songs"}
        {entry.hints > 0 && ` · ${entry.hints} ${entry.hints === 1 ? "hint" : "hints"}`}
      </span>
      <span className="tabular shrink-0 text-sm font-semibold text-ink">
        {entry.score}
        <span className="text-xs font-normal text-faint">/100</span>
      </span>
    </li>
  );
}
