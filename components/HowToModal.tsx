"use client";

import { MusicNote, Target, LinkSimple } from "@phosphor-icons/react";
import { Modal } from "./Modal";

export function HowToModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <div className="space-y-5 text-[15px] leading-relaxed text-muted">
        <p>
          Every day you get two artists. Connect them by{" "}
          <span className="font-semibold text-ink">writing songs</span>. Each
          song is a real collaboration that carries you to a new artist.
        </p>

        <div className="space-y-3">
          <Row icon={<MusicNote weight="fill" />} tint="var(--color-coral)">
            You start at the <span className="font-semibold text-ink">coral</span> artist.
          </Row>
          <Row icon={<LinkSimple weight="bold" />} tint="var(--color-muted)">
            Write a real track your current artist is on. It reveals whoever
            else is on the song. That&apos;s your next step.
          </Row>
          <Row icon={<Target weight="bold" />} tint="var(--color-teal)">
            Reach the <span className="font-semibold text-ink">teal</span> target to win. You start at{" "}
            <span className="font-semibold text-ink">100 points</span>, and every detour or hint costs you.
          </Row>
        </div>

        <div className="rounded-2xl border border-line bg-surface-2 p-4">
          <p className="text-sm text-faint">For example</p>
          <p className="mt-1 tabular text-sm text-ink">
            Drake <span className="text-faint">→</span> The Weeknd{" "}
            <span className="text-faint">→</span> Daft Punk
          </p>
          <p className="mt-2 text-sm">
            Two songs: write &ldquo;Crew Love&rdquo; to reach The Weeknd, then
            &ldquo;Starboy&rdquo; to reach Daft Punk.
          </p>
        </div>

        <p className="text-sm text-faint">
          Don&apos;t know an artist? Tap <span className="font-medium text-muted">Hint</span> and
          we&apos;ll hand you a song that keeps you on the shortest path, so you
          never get stuck.
        </p>
      </div>
    </Modal>
  );
}

function Row({
  icon,
  tint,
  children,
}: {
  icon: React.ReactNode;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[17px]"
        style={{ background: `${tint}1f`, color: tint }}
      >
        {icon}
      </span>
      <p className="flex-1 pt-1">{children}</p>
    </div>
  );
}
