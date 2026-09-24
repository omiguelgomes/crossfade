"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Info, Warning } from "@phosphor-icons/react";

export interface ToastMsg {
  id: number;
  text: string;
  tone: "error" | "info";
}

export function Toast({ toast }: { toast: ToastMsg | null }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full border border-line bg-surface/95 px-4 py-2.5 text-sm font-medium shadow-[0_12px_32px_-12px_rgba(20,20,30,0.3)] backdrop-blur-md"
          >
            <span className={toast.tone === "error" ? "text-coral" : "text-teal"}>
              {toast.tone === "error" ? (
                <Warning size={17} weight="fill" />
              ) : (
                <Info size={17} weight="fill" />
              )}
            </span>
            <span className="text-ink">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
