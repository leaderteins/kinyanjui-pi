"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";

const STORAGE_KEY = "kinyanjui-pi-lights-off";

export function LightsOffToggle() {
  const [lightsOff, setLightsOff] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "true") setLightsOff(true);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle() {
    const next = !lightsOff;
    setLightsOff(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
    // Toggle the cinematic dim on both the hero and the full page body
    const hero = document.getElementById("top");
    if (hero) {
      hero.classList.toggle("lights-off", next);
    }
    document.body.classList.toggle("lights-off-page", next);
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-pressed={lightsOff}
      aria-label={lightsOff ? "Turn lights on" : "Turn lights off"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
        lightsOff
          ? "border-pi-gold/50 bg-pi-gold/15 text-pi-gold"
          : "border-border/60 bg-card/40 text-muted-foreground hover:border-pi-gold/40 hover:text-pi-gold"
      }`}
      title="Dim the hero for a cinematic focus mode"
    >
      {lightsOff ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
      {lightsOff ? "Lights on" : "Lights off"}
    </button>
  );
}
