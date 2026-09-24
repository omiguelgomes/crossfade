"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { ARTISTS, Artist, ArtistId } from "@/lib/graph";

export function ArtistSearch({
  onSelect,
  exclude,
  placeholder = "Add an artist…",
  autoFocus = false,
  disabled = false,
}: {
  onSelect: (id: ArtistId) => void;
  exclude?: Set<ArtistId>;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scored: { a: Artist; rank: number }[] = [];
    for (const a of ARTISTS) {
      if (exclude?.has(a.id)) continue;
      const name = a.name.toLowerCase();
      const idx = name.indexOf(q);
      if (idx === -1) continue;
      // prefix match ranks highest, then word-boundary, then anywhere
      const rank = idx === 0 ? 0 : name[idx - 1] === " " ? 1 : 2;
      scored.push({ a, rank });
    }
    return scored
      .sort((x, y) => x.rank - y.rank || x.a.name.localeCompare(y.a.name))
      .slice(0, 40)
      .map((s) => s.a);
  }, [query, exclude]);

  const open = focused && results.length > 0;

  function choose(a: Artist) {
    onSelect(a.id);
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
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors focus-within:border-muted">
        <MagnifyingGlass size={18} className="shrink-0 text-faint" weight="bold" />
        <input
          ref={inputRef}
          value={query}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder={placeholder}
          aria-label="Search for an artist"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none disabled:opacity-40"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto quiet-scroll rounded-2xl border border-line bg-surface p-1.5 shadow-[0_20px_48px_-20px_rgba(20,20,30,0.32)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0, duration: 0.22 }}
          >
            {results.map((a, i) => (
              <li key={a.id}>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(a);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors ${
                    i === active ? "bg-coral/15 text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {a.name}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
