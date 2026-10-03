"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Pi Network .pi domain claim/connect deadline — December 31, 2026 (end of year).
// Pioneers must have each .pi domain claimed or connected by this date.
const DEADLINE = new Date("2026-12-31T23:59:59Z").getTime();
const STORAGE_KEY = "kinyanjui-pi-deadline-dismissed";

function getParts(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export function DeadlineBanner() {
  const [now, setNow] = React.useState<number>(0);
  const [dismissed, setDismissed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      /* ignore */
    }
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
  }

  if (!mounted || dismissed) return null;

  const remaining = DEADLINE - now;
  const { days, hours, minutes, seconds, expired } = getParts(remaining);
  const urgent = days <= 30 && !expired;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden border-b ${
          expired
            ? "border-pi-teal/30 bg-pi-teal/10"
            : urgent
            ? "border-pi-rose/30 bg-pi-rose/10"
            : "border-pi-gold/30 bg-pi-gold/10"
        } backdrop-blur-sm`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-5" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                expired
                  ? "bg-pi-teal/20 text-pi-teal"
                  : urgent
                  ? "bg-pi-rose/20 text-pi-rose"
                  : "bg-pi-gold/20 text-pi-gold"
              }`}
            >
              {expired ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {expired
                  ? "Pi domain deadline has passed"
                  : urgent
                  ? "Pi domain deadline approaching"
                  : "Pi domain claim/connect deadline"}
              </p>
              <p className="text-xs text-muted-foreground">
                {expired ? (
                  <>All .pi domains should now be claimed or connected on the Pi Network.</>
                ) : (
                  <>
                    Have each .pi domain{" "}
                    <span className="font-semibold text-foreground">claimed or connected by December 31, 2026</span>{" "}
                    — the Pi Network cutoff.
                  </>
                )}
              </p>
            </div>
          </div>

          {!expired && (
            <div className="flex items-center gap-3">
              {/* Countdown */}
              <div className="flex items-center gap-2">
                <CountdownUnit value={days} label="days" />
                <span className="font-mono text-lg font-bold text-muted-foreground/40">:</span>
                <CountdownUnit value={hours} label="hrs" />
                <span className="font-mono text-lg font-bold text-muted-foreground/40">:</span>
                <CountdownUnit value={minutes} label="min" />
                <span className="font-mono text-lg font-bold text-muted-foreground/40">:</span>
                <CountdownUnit value={seconds} label="sec" />
              </div>
              <a href="#portfolio" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-full border-pi-gold/40 bg-background/60 text-xs hover:bg-pi-gold/10"
                >
                  View domains <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          )}

          <button
            onClick={dismiss}
            aria-label="Dismiss deadline banner"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`min-w-[2.5ch] text-center font-mono text-lg font-bold tabular-nums ${
          label === "days" ? "text-pi-rose" : "text-foreground"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
