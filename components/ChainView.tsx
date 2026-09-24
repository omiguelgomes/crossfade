"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X } from "@phosphor-icons/react";
import { ArtistId, getName, songBetween } from "@/lib/graph";
import { Avatar } from "./Avatar";

// Clean state tags: start reads coral, the target reads teal. No gradients, no
// per-node tinting — the two ends carry all the colour, everything between is
// neutral so the chain stays legible.
function Tag({ kind, done }: { kind: "start" | "target"; done?: boolean }) {
  const start = kind === "start";
  const accent = start ? "var(--color-coral)" : "var(--color-teal)";
  const text = start ? "var(--color-coral-soft)" : "var(--color-teal-soft)";
  return (
    <span
      className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: text }}
    >
      {done && <Check size={12} weight="bold" />}
      {start ? "Start" : "Target"}
    </span>
  );
}

function Node({
  id,
  reduce,
  onRemove,
  tag,
  done,
  goal,
}: {
  id: ArtistId;
  reduce: boolean | null;
  onRemove?: () => void;
  tag?: "start" | "target";
  done?: boolean;
  goal?: boolean; // the target artist, not yet reached
}) {
  const ring = tag === "start" ? "var(--color-coral)" : tag === "target" ? "var(--color-teal)" : undefined;
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.94 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", bounce: 0.32, duration: 0.42 }}
      className="flex items-center gap-3 rounded-2xl border bg-surface px-3.5 py-3"
      style={
        goal
          ? {
              borderColor: "color-mix(in srgb, var(--color-teal) 32%, transparent)",
              background: "color-mix(in srgb, var(--color-teal) 5%, var(--color-surface))",
            }
          : { borderColor: "var(--color-line)" }
      }
    >
      <Avatar id={id} size={40} ring={ring} />
      <span className="flex-1 truncate text-[15px] font-medium text-ink">{getName(id)}</span>
      {tag && <Tag kind={tag} done={done} />}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${getName(id)}`}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-ink active:scale-90"
        >
          <X size={15} weight="bold" />
        </button>
      )}
    </motion.div>
  );
}

function Connector({ song }: { song: string | null }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 pl-[27px]">
      <span className="h-6 w-px shrink-0 bg-line" />
      {song ? (
        <span className="truncate text-[13px] text-muted">{song}</span>
      ) : (
        <span className="text-[13px] text-faint">Add a song</span>
      )}
    </div>
  );
}

export function ChainView({
  end,
  chain,
  reached,
  onRemoveLast,
  editable,
}: {
  start: ArtistId;
  end: ArtistId;
  chain: ArtistId[]; // [start, ...intermediate picks]
  reached: boolean;
  onRemoveLast?: () => void;
  editable: boolean;
}) {
  const reduce = useReducedMotion();
  const lastIdx = chain.length - 1;

  return (
    <div className="flex flex-col">
      <AnimatePresence initial={false}>
        {chain.map((id, i) => {
          const nextId = i < lastIdx ? chain[i + 1] : reached ? end : null;
          const song = nextId ? songBetween(id, nextId) ?? null : null;
          const isRemovable = editable && i === lastIdx && i > 0 && !reached;
          return (
            <div key={id}>
              <Node
                id={id}
                reduce={reduce}
                tag={i === 0 ? "start" : undefined}
                onRemove={isRemovable && onRemoveLast ? onRemoveLast : undefined}
              />
              <Connector song={song} />
            </div>
          );
        })}
      </AnimatePresence>

      <Node id={end} reduce={reduce} tag="target" done={reached} goal={!reached} />
    </div>
  );
}
