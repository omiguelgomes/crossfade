"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Theme = "dark" | "light";

const KEY = "crossfade:theme";
const CHROME = { dark: "#0a0a0c", light: "#f6f5f2" } as const;

// Dark is the default: the light theme is opt-in via a data attribute, so an
// absent attribute means dark. Keeps the no-flash head script trivial.
function apply(theme: Theme) {
  const el = document.documentElement;
  if (theme === "light") el.dataset.theme = "light";
  else delete el.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", CHROME[theme]);
}

export function ThemeToggle() {
  const reduce = useReducedMotion();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const next: Theme = stored === "light" ? "light" : "dark";
    setTheme(next);
    apply(next); // sync meta colour with what the head script already set
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Ease the whole-page colour change for the switch itself only.
    const el = document.documentElement;
    el.classList.add("theme-transition");
    apply(next);
    localStorage.setItem(KEY, next);
    setTheme(next);
    window.setTimeout(() => el.classList.remove("theme-transition"), 420);
  }

  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink active:scale-90"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -50, scale: 0.6 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 50, scale: 0.6 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
          className="grid place-items-center"
        >
          {dark ? <Sun size={21} weight="bold" /> : <Moon size={20} weight="bold" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
