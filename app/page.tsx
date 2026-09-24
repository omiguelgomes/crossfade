"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, ArrowUUpLeft, Flag, MusicNote, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { ArtistId, distance, getName, hintStep, Move, shortestPath } from "@/lib/graph";
import { computeScore, HINT_PENALTY } from "@/lib/score";
import {
  decodeChallenge,
  encodeChallenge,
  getDailyPuzzle,
  msUntilTomorrow,
  Puzzle,
} from "@/lib/daily";
import {
  getStats,
  hasSeenHowTo,
  loadGame,
  markSeenHowTo,
  recordDaily,
  saveGame,
  Stats,
  GameStatus,
  getPlayerName,
  setPlayerName as persistPlayerName,
} from "@/lib/storage";
import { submitScore } from "@/lib/leaderboard";
import { Header } from "@/components/Header";
import { ChainView } from "@/components/ChainView";
import { SongSearch } from "@/components/SongSearch";
import { Avatar } from "@/components/Avatar";
import { Toast, ToastMsg } from "@/components/Toast";
import { HowToModal } from "@/components/HowToModal";
import { StatsModal } from "@/components/StatsModal";
import { EndModal } from "@/components/EndModal";
import { CreateChallengeModal } from "@/components/CreateChallengeModal";
import { LeaderboardModal } from "@/components/LeaderboardModal";

// A brief haptic on genuinely meaningful moments only (a commit, a win) — never
// decorative. No-op on devices without the Vibration API.
function haptic(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [isDaily, setIsDaily] = useState(true);
  const [number, setNumber] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [chain, setChain] = useState<ArtistId[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState<Move | null>(null);
  const [stats, setStats] = useState<Stats>(getStats());
  const [playerName, setPlayerName] = useState("");

  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [howTo, setHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [create, setCreate] = useState(false);
  const [end, setEnd] = useState(false);
  const [msLeft, setMsLeft] = useState(0);
  const [giveUpArmed, setGiveUpArmed] = useState(false);

  const recorded = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string, tone: ToastMsg["tone"]) => {
    setToast({ id: Date.now(), text, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // ---- init (client-only; reads URL, localStorage, local date) ----
  useEffect(() => {
    const custom = decodeChallenge(window.location.search);
    if (custom) {
      setIsDaily(false);
      setPuzzle(custom);
      setNumber(0);
      setChain([custom.start]);
      setStatus("playing");
      setHintsUsed(0);
      recorded.current = false;
    } else {
      const daily = getDailyPuzzle();
      setIsDaily(true);
      setPuzzle({ start: daily.start, end: daily.end, par: daily.par });
      setNumber(daily.number);
      const saved = loadGame(daily.number);
      if (saved && saved.par === daily.par && saved.chain[0] === daily.start) {
        setChain(saved.chain);
        setStatus(saved.status);
        setHintsUsed(saved.hintsUsed);
        recorded.current = saved.status !== "playing";
      } else {
        setChain([daily.start]);
        setStatus("playing");
        setHintsUsed(0);
        recorded.current = false;
      }
      if (!hasSeenHowTo()) setHowTo(true);
    }
    setStats(getStats());
    setPlayerName(getPlayerName());
    setReady(true);
  }, []);

  // ---- persist daily progress ----
  useEffect(() => {
    if (!ready || !isDaily || !puzzle) return;
    saveGame({ number, chain, status, hintsUsed, par: puzzle.par });
  }, [ready, isDaily, number, chain, status, hintsUsed, puzzle]);

  const reached = status === "won";
  const tip = chain[chain.length - 1];
  const hopsUsed = reached ? chain.length : puzzle?.par ?? 0;

  const openEnd = useCallback(() => {
    setMsLeft(msUntilTomorrow());
    setEnd(true);
  }, []);

  const submitIfPossible = useCallback(
    (name: string, hops: number, hints: number) => {
      if (isDaily && name && puzzle) submitScore(number, name, hops, hints, puzzle.par);
    },
    [isDaily, number, puzzle],
  );

  const play = useCallback(
    (move: Move) => {
      if (status !== "playing" || !puzzle) return;
      const to = move.to;
      setHint(null);
      if (to === puzzle.end) {
        const hops = chain.length; // songs used, counting this winning link
        setStatus("won");
        haptic([14, 40, 22]); // success: a beat, then a settle

        if (isDaily && !recorded.current) {
          recorded.current = true;
          setStats(recordDaily(number, true, hops, puzzle.par));
          submitIfPossible(playerName, hops, hintsUsed);
        }
        setTimeout(openEnd, 700);
      } else {
        setChain((c) => [...c, to]);
      }
    },
    [status, puzzle, chain, isDaily, number, hintsUsed, playerName, openEnd, submitIfPossible],
  );

  const undo = useCallback(() => {
    if (status !== "playing" || chain.length <= 1) return;
    setHint(null);
    setChain((c) => c.slice(0, -1));
  }, [status, chain.length]);

  const requestHint = useCallback(() => {
    if (status !== "playing" || !puzzle) return;
    const step = hintStep(tip, puzzle.end);
    if (!step) return;
    setHint(step);
    setHintsUsed((h) => h + 1);
    haptic(16);
    showToast(`Hint: “${step.song}” → ${step.toName}  ·  −${HINT_PENALTY} pts`, "info");
  }, [status, puzzle, tip, showToast]);

  const giveUp = useCallback(() => {
    if (status !== "playing" || !puzzle) return;
    if (!giveUpArmed) {
      setGiveUpArmed(true);
      showToast("Tap again to reveal the shortest link", "info");
      if (armTimer.current) clearTimeout(armTimer.current);
      armTimer.current = setTimeout(() => setGiveUpArmed(false), 3000);
      return;
    }
    setGiveUpArmed(false);
    setHint(null);
    setStatus("gaveup");
    if (isDaily && !recorded.current) {
      recorded.current = true;
      setStats(recordDaily(number, false, 0, puzzle.par));
    }
    setTimeout(openEnd, 300);
  }, [status, puzzle, giveUpArmed, isDaily, number, showToast, openEnd]);

  const playCustom = useCallback((start: ArtistId, endId: ArtistId) => {
    const par = distance(start, endId);
    setIsDaily(false);
    setPuzzle({ start, end: endId, par });
    setNumber(0);
    setChain([start]);
    setStatus("playing");
    setHintsUsed(0);
    setHint(null);
    recorded.current = false;
    setCreate(false);
    setEnd(false);
    window.history.replaceState(null, "", `/${encodeChallenge(start, endId)}`);
  }, []);

  const saveName = useCallback(
    (name: string) => {
      persistPlayerName(name);
      setPlayerName(name);
      if (reached) submitIfPossible(name, chain.length, hintsUsed);
    },
    [reached, chain.length, hintsUsed, submitIfPossible],
  );

  const solution = useMemo(
    () => (puzzle ? shortestPath(puzzle.start, puzzle.end) : null),
    [puzzle],
  );

  const shareText = useMemo(() => {
    if (!puzzle) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const perfect = reached && hopsUsed === puzzle.par && hintsUsed === 0;
    const score = computeScore(hopsUsed, hintsUsed, puzzle.par);
    return [
      `Crossfade #${number}`,
      `🎵 ${getName(puzzle.start)} → ${getName(puzzle.end)}`,
      reached
        ? `${"🔗".repeat(Math.max(1, Math.min(hopsUsed, 10)))} ${hopsUsed} songs · ${score}/100${
            hintsUsed > 0 ? ` · ${hintsUsed} hint${hintsUsed === 1 ? "" : "s"}` : ""
          }${perfect ? " ⭐" : ""}`
        : `Gave up (par ${puzzle.par})`,
      origin,
    ].join("\n");
  }, [puzzle, number, reached, hopsUsed, hintsUsed]);

  const challengeUrl = useMemo(() => {
    if (!puzzle || typeof window === "undefined") return null;
    return `${window.location.origin}/${encodeChallenge(puzzle.start, puzzle.end)}`;
  }, [puzzle]);

  function closeHowTo() {
    setHowTo(false);
    markSeenHowTo();
  }

  if (!ready || !puzzle) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-pulse rounded-full bg-surface-2" />
      </div>
    );
  }

  const songsSoFar = chain.length - 1;
  const liveScore = computeScore(songsSoFar, hintsUsed, puzzle.par);
  const finalScore = computeScore(hopsUsed, hintsUsed, puzzle.par);

  return (
    <>
      <Header
        onHowTo={() => setHowTo(true)}
        onStats={() => setShowStats(true)}
        onCreate={() => setCreate(true)}
        onLeaderboard={() => setShowBoard(true)}
      />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-2">
        {/* Prompt */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-faint">
            {isDaily ? (
              <>
                <span className="tabular font-semibold text-muted">#{number}</span> · Daily puzzle
              </>
            ) : (
              "Custom challenge"
            )}
          </p>
          {status === "playing" && (
            <div className="flex items-baseline gap-3">
              <span className="tabular text-sm text-faint">
                <span className="font-semibold text-muted">{songsSoFar}</span>{" "}
                {songsSoFar === 1 ? "song" : "songs"}
              </span>
              <ScoreChip score={liveScore} />
            </div>
          )}
        </div>

        {/* Board */}
        {status === "gaveup" && solution ? (
          <>
            <p className="mb-3 text-sm font-semibold text-muted">One shortest link</p>
            <ChainView
              start={puzzle.start}
              end={puzzle.end}
              chain={solution.slice(0, -1)}
              reached
              editable={false}
            />
          </>
        ) : (
          <ChainView
            start={puzzle.start}
            end={puzzle.end}
            chain={chain}
            reached={reached}
            onRemoveLast={undo}
            editable={status === "playing"}
          />
        )}

        {/* Input + controls */}
        {status === "playing" && (
          <div className="mt-5 space-y-3">
            <AnimatePresence>
              {hint && (
                <motion.button
                  key={`${hint.song}-${hint.to}`}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                  onClick={() => play(hint)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-coral/40 bg-coral/10 px-3.5 py-3 text-left transition-transform active:scale-[0.98]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral/20 text-coral-soft">
                    <Lightbulb size={16} weight="fill" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-ink">
                      {hint.song}
                    </span>
                    <span className="text-xs text-coral-soft">Tap to add this song</span>
                  </span>
                  <Avatar id={hint.to} size={28} />
                  <ArrowRight size={16} weight="bold" className="shrink-0 text-faint" />
                </motion.button>
              )}
            </AnimatePresence>

            <SongSearch
              key={chain.length}
              from={tip}
              onPlay={play}
              exclude={new Set(chain)}
              placeholder={`A song ${getName(tip)} is on…`}
              highlight={hint}
              autoFocus
            />
            <div className="flex items-center justify-center gap-2">
              <Control onClick={requestHint} icon={<Lightbulb size={17} weight="bold" />} label="Hint" />
              <Control
                onClick={undo}
                icon={<ArrowUUpLeft size={17} weight="bold" />}
                label="Undo"
                disabled={chain.length <= 1}
              />
              <Control
                onClick={giveUp}
                icon={<Flag size={17} weight="bold" />}
                label={giveUpArmed ? "Reveal?" : "Give up"}
                tone={giveUpArmed ? "danger" : undefined}
              />
            </div>
          </div>
        )}

        {status !== "playing" && (
          <button
            onClick={openEnd}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-5 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-2 active:scale-[0.99]"
          >
            <MusicNote size={17} weight="fill" /> View result
          </button>
        )}
      </main>

      <Toast toast={toast} />

      <HowToModal open={howTo} onClose={closeHowTo} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <LeaderboardModal
        open={showBoard}
        onClose={() => setShowBoard(false)}
        number={number}
        playerName={playerName}
        onSaveName={saveName}
        myResult={reached ? { hops: chain.length, hints: hintsUsed, score: finalScore } : null}
      />
      <CreateChallengeModal
        open={create}
        onClose={() => setCreate(false)}
        onPlay={playCustom}
        onCopied={(label) => showToast(label, "info")}
      />
      <EndModal
        open={end}
        onClose={() => setEnd(false)}
        won={reached}
        hopsUsed={hopsUsed}
        score={finalScore}
        hintsUsed={hintsUsed}
        par={puzzle.par}
        number={number}
        startName={getName(puzzle.start)}
        endName={getName(puzzle.end)}
        isDaily={isDaily}
        shareText={shareText}
        challengeUrl={challengeUrl}
        msLeft={msLeft}
        onShowStats={() => {
          setEnd(false);
          setShowStats(true);
        }}
        onLeaderboard={() => {
          setEnd(false);
          setShowBoard(true);
        }}
        onCreate={() => {
          setEnd(false);
          setCreate(true);
        }}
        onCopied={(label) => showToast(label, "info")}
      />
    </>
  );
}

// Live score, higher is better. Tints from teal (flawless) toward coral as
// hints and detours chip away at it, and pops on each change. Sits as a plain
// tinted stat beside the song count — no badge, no border, no glow.
function ScoreChip({ score }: { score: number }) {
  const t = 1 - Math.min(1, score / 100); // 0 = perfect, 1 = badly dented
  // Teal (flawless) toward coral (dented), mixed from the theme's own accents so
  // it stays readable in both dark and light.
  const color = `color-mix(in srgb, var(--color-coral-soft) ${Math.round(
    t * 100,
  )}%, var(--color-teal-soft))`;
  return (
    <span className="tabular flex items-baseline gap-1 text-sm font-semibold" style={{ color }}>
      <motion.span
        key={score}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.35 }}
      >
        {score}
      </motion.span>
      <span className="text-xs font-normal opacity-60">pts</span>
    </span>
  );
}

function Control({
  onClick,
  icon,
  label,
  disabled,
  tone,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  tone?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-30 ${
        tone === "danger"
          ? "border-coral/50 bg-coral/10 text-coral-soft"
          : "border-line bg-surface text-muted enabled:hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
