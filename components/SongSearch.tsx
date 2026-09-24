"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, MusicNotes } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { ArtistId, Move, movesFrom } from "@/lib/graph";
import { Avatar } from "./Avatar";

// Write a song. The search is scoped to real collaborations of the artist you
// are standing on, so every result is a legal move — you can't enter a song
// that doesn't exist. The skill is choosing the one that heads for the target.
export function SongSearch({
  from,
  onPlay,
  exclude,
  placeholder = "Write a song…",
  autoFocus = false,
  highlight,
}: {
  from: ArtistId;
  onPlay: (move: Move) => void;
  exclude?: Set<ArtistId>;
  placeholder?: string;
  autoFocus?: boolean;
  highlight?: Move | null; // hinted move to spotlight
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const all = useMemo(
    () => movesFrom(from).filter((m) => !exclude?.has(m.to)),
    [from, exclude],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Don't reveal the valid moves on focus — the player searches by memory.
    if (!q) return [];
    const scored: { m: Move; rank: number }[] = [];
    for (const m of all) {
      const song = m.song.toLowerCase();
      const dest = m.toName.toLowerCase();
      const si = song.indexOf(q);
      const di = dest.indexOf(q);
      if (si === -1 && di === -1) continue;
      // Song matches rank above destination matches; prefixes above the rest.
      const rank = si === 0 ? 0 : si > 0 ? 1 : di === 0 ? 2 : 3;
      scored.push({ m, rank });
    }
    return scored.sort((x, y) => x.rank - y.rank || x.m.song.localeCompare(y.m.song)).map((s) => s.m);
  }, [query, all]);

  const open = focused && results.length > 0;

  function choose(m: Move) {
    onPlay(m);
    setQuery("");
    setActive(0);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors focus-within:border-muted">
        <MagnifyingGlass size={18} className="shrink-0 text-faint" weight="bold" />
        <input
          ref={inputRef}
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 140)}
          placeholder={placeholder}
          aria-label="Write a song that features this artist"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none"
        />
        {query.trim() && (
          <span className="shrink-0 text-xs text-faint tabular">{results.length}</span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto quiet-scroll rounded-2xl border border-line bg-surface p-1.5 shadow-[0_20px_48px_-20px_rgba(20,20,30,0.32)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0, duration: 0.22 }}
          >
            {results.map((m, i) => {
              const hinted = highlight && highlight.to === m.to && highlight.song === m.song;
              return (
                <li key={`${m.song}::${m.to}`}>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(m);
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      i === active ? "bg-coral/15" : ""
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-faint">
                      <MusicNotes size={16} weight="fill" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-ink">
                        {m.song}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <span className="text-faint">leads to</span>
                        <span className="truncate">{m.toName}</span>
                      </span>
                    </span>
                    <Avatar id={m.to} size={26} ring={hinted ? "var(--color-coral)" : undefined} />
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
