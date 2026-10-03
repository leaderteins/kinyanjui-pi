"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TIPS = [
  {
    title: "Send to a name, not an address",
    body: "When you send Pi to kinyanjui.pi, the .pi registry resolves it to the wallet behind the name. No more copy-pasting 36-character addresses — and no more sending to the wrong one.",
    accent: "text-pi-gold",
    bg: "bg-pi-gold/10",
  },
  {
    title: "Build your security circle slowly",
    body: "Three trusted pioneers beats thirty strangers. Quality of trust is what secures the network — add people you actually know in real life, not random handles.",
    accent: "text-pi-purple",
    bg: "bg-pi-purple/10",
  },
  {
    title: "Mine every 24 hours",
    body: "Pi mining sessions last 24 hours — set a daily reminder. Consistency compounds: a pioneer who never misses a session earns far more than one who mines occasionally for more hours.",
    accent: "text-pi-teal",
    bg: "bg-pi-teal/10",
  },
  {
    title: "Verify before you transact",
    body: "On the marketplace, check the seller's security circle and history. .pi names are memorable, but always confirm you're talking to the right pioneer before sending value.",
    accent: "text-pi-rose",
    bg: "bg-pi-rose/10",
  },
  {
    title: "Hold utility, not just tokens",
    body: "The richest pioneers won't just hold Pi — they'll own the domains, apps and identities the ecosystem runs on. .pi domains are utility, not speculation.",
    accent: "text-pi-gold",
    bg: "bg-pi-gold/10",
  },
  {
    title: "Back up your wallet passphrase",
    body: "Your Pi wallet passphrase is the only thing standing between you and lost funds. Write it down offline, store it in two safe places, and never type it into a random site.",
    accent: "text-pi-purple",
    bg: "bg-pi-purple/10",
  },
  {
    title: "Engage the community",
    body: "Pi grows through pioneers. Join the conversations, vouch for real people, and contribute builds — your reputation on the network compounds just like your balance.",
    accent: "text-pi-teal",
    bg: "bg-pi-teal/10",
  },
];

export function TipOfDay() {
  const [idx, setIdx] = React.useState(() => {
    // deterministic daily rotation: day-of-year mod tips.length
    if (typeof window === "undefined") return 0;
    const start = new Date(new Date().getFullYear(), 0, 0).getTime();
    const day = Math.floor((Date.now() - start) / 86400000);
    return day % TIPS.length;
  });

  const tip = TIPS[idx];

  function go(delta: number) {
    setIdx((i) => (i + delta + TIPS.length) % TIPS.length);
  }

  React.useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % TIPS.length), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${tip.bg} blur-3xl`}
      />
      <div className="relative flex items-center justify-between">
        <Badge
          variant="outline"
          className={`gap-1.5 rounded-full ${tip.bg} px-2.5 py-0.5 text-[10px] font-medium ${tip.accent}`}
        >
          <Lightbulb className="h-3 w-3" />
          Tip of the day
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground">
          {String(idx + 1).padStart(2, "0")} / {String(TIPS.length).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-4 min-h-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Quote className={`mb-2 h-5 w-5 ${tip.accent} opacity-50`} />
            <h3 className="text-base font-semibold leading-snug">
              {tip.title}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {tip.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Auto-advancing · 9s
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 rounded-full"
            onClick={() => go(-1)}
            aria-label="Previous tip"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 rounded-full"
            onClick={() => go(1)}
            aria-label="Next tip"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
