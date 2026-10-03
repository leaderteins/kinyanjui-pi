"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pickaxe, Zap, Clock, Check, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "kinyanjui-pi-mining";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24h
const MINE_DURATION = 3000; // 3s simulated mining animation
const BASE_RATE = 0.12; // π per hour base

interface MiningState {
  lastMined: number | null; // timestamp of last mine
  totalMined: number; // cumulative π mined in this browser
  sessions: number; // count of mining sessions
}

function read(): MiningState {
  if (typeof window === "undefined")
    return { lastMined: null, totalMined: 0, sessions: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastMined: null, totalMined: 0, sessions: 0 };
    return JSON.parse(raw) as MiningState;
  } catch {
    return { lastMined: null, totalMined: 0, sessions: 0 };
  }
}

function write(s: MiningState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ready";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function MiningSimulator() {
  const [state, setState] = React.useState<MiningState>({
    lastMined: null,
    totalMined: 0,
    sessions: 0,
  });
  const [mounted, setMounted] = React.useState(false);
  const [mining, setMining] = React.useState(false);
  const [now, setNow] = React.useState(Date.now());
  const [earnedThisSession, setEarnedThisSession] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    setMounted(true);
    setState(read());
  }, []);

  // Tick every second for countdown
  React.useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [mounted]);

  const cooldownLeft = state.lastMined
    ? Math.max(0, SESSION_DURATION - (now - state.lastMined))
    : 0;
  const canMine = !state.lastMined || cooldownLeft <= 0;

  async function mine() {
    if (!canMine || mining) return;
    setMining(true);
    setEarnedThisSession(null);
    // Simulate the mining animation
    await new Promise((r) => setTimeout(r, MINE_DURATION));
    // Earn: base rate * 24h + small bonus per session
    const earned = Number((BASE_RATE * 24 + Math.random() * 0.5).toFixed(4));
    const next: MiningState = {
      lastMined: Date.now(),
      totalMined: Number((state.totalMined + earned).toFixed(4)),
      sessions: state.sessions + 1,
    };
    write(next);
    setState(next);
    setEarnedThisSession(earned);
    setMining(false);
  }

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
        <div className="h-32" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pi-gold/10 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
            <Pickaxe className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Pi mining simulator</h3>
            <p className="text-[11px] text-muted-foreground">
              Tap to simulate a daily mining session
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="gap-1 rounded-full border-pi-gold/30 bg-pi-gold/10 text-[10px] text-pi-gold"
        >
          <Zap className="h-3 w-3" />
          {BASE_RATE} π/hr
        </Badge>
      </div>

      {/* Mining button / progress */}
      <div className="relative mt-5">
        <AnimatePresence mode="wait">
          {mining ? (
            <motion.div
              key="mining"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pi-gold/30 to-pi-purple/30 text-2xl"
              >
                ⛏️
              </motion.div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: MINE_DURATION / 1000, ease: "linear" }}
                  className="h-full rounded-full bg-gradient-to-r from-pi-gold to-pi-purple"
                />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Mining your daily Pi…
              </p>
            </motion.div>
          ) : earnedThisSession !== null ? (
            <motion.div
              key="earned"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-pi-teal/15 text-pi-teal"
              >
                <Check className="h-7 w-7" />
              </motion.div>
              <p className="text-sm font-medium">
                Mined{" "}
                <span className="font-mono font-bold text-pi-gold">
                  +{earnedThisSession.toFixed(4)} π
                </span>
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Next session in {formatCountdown(SESSION_DURATION)}
              </p>
            </motion.div>
          ) : canMine ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-2"
            >
              <Button
                onClick={mine}
                className="h-14 w-full gap-2 rounded-xl bg-gradient-to-r from-pi-gold to-pi-purple text-base font-bold text-primary-foreground shadow-lg shadow-pi-gold/20"
              >
                <Pickaxe className="h-5 w-5" />
                Tap to mine
              </Button>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-pi-gold" />
                Your daily session is ready — earn ~
                {(BASE_RATE * 24).toFixed(2)} π
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="cooldown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground">
                <Clock className="h-7 w-7" />
              </div>
              <p className="font-mono text-lg font-bold text-foreground">
                {formatCountdown(cooldownLeft)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                until your next mining session
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lifetime stats */}
      <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-center">
        <div>
          <p className="font-mono text-base font-bold text-pi-gold">
            {state.totalMined.toFixed(4)} π
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Total mined
          </p>
        </div>
        <div>
          <p className="font-mono text-base font-bold text-pi-purple">
            {state.sessions}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Sessions
          </p>
        </div>
      </div>
    </div>
  );
}
