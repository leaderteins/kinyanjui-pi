"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, ShieldCheck, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PiLogo } from "./pi-logo";

interface LookupResult {
  label: string;
  name: string;
  available: boolean;
  reason: string;
  message?: string;
  estPricePi?: number | null;
  status?: string;
  pricePi?: number | null;
  emoji?: string;
}

export function Hero() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<LookupResult | null>(null);

  async function runLookup(e?: React.FormEvent) {
    e?.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) {
      toast.error("Type a name to check the .pi registry");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `/api/domain-lookup?name=${encodeURIComponent(q)}`
      );
      const data = (await res.json()) as LookupResult;
      setResult(data);
    } catch {
      toast.error("Could not reach the .pi registry. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 pi-grid-bg" />
      <div className="pointer-events-none absolute inset-0 pi-radial" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-pi-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-pi-gold/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: copy + lookup */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="mb-5 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Curated .pi domain portfolio
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Own your corner of the
              <br className="hidden sm:block" />{" "}
              <span className="text-gradient-gold">Pi Network</span> ecosystem.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
            >
              I&apos;m Kinyanjui — a Pi pioneer curating a portfolio of premium{" "}
              <span className="font-mono font-semibold text-foreground">.pi</span>{" "}
              domains. From <span className="font-semibold text-foreground">kinyanjui.pi</span>{" "}
              to marketplaces, wallets and NFT galleries, this is the launchpad
              for the next era of the Pi web.
            </motion.p>

            {/* Domain lookup */}
            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              onSubmit={runLookup}
              className="mt-7"
            >
              <div className="group relative flex flex-col gap-2 rounded-2xl border border-border/70 bg-card/70 p-2 backdrop-blur-md sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 px-2">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try: kinyanjui, soko, yourname"
                    className="h-10 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                    aria-label="Check a .pi domain name"
                  />
                  <span className="hidden font-mono text-sm font-semibold text-pi-gold sm:inline">
                    .pi
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 shrink-0 gap-1.5 rounded-xl bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground shadow-lg shadow-pi-gold/20"
                >
                  {loading ? "Checking…" : "Check"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 flex items-start gap-3 rounded-xl border p-3 text-sm ${
                    result.available
                      ? "border-pi-teal/40 bg-pi-teal/10 text-foreground"
                      : "border-pi-purple/40 bg-pi-purple/10 text-foreground"
                  }`}
                >
                  <span className="text-lg">
                    {result.available ? "✅" : result.emoji ?? "🔒"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {result.name}{" "}
                      {result.available ? (
                        <span className="text-pi-teal">— available</span>
                      ) : (
                        <span className="text-pi-rose">— {result.reason === "portfolio" ? "in portfolio" : result.reason === "reserved" ? "reserved" : "taken"}</span>
                      )}
                    </p>
                    <p className="text-muted-foreground">{result.message}</p>
                    {result.available && result.estPricePi && (
                      <p className="mt-1 font-mono text-xs text-pi-gold">
                        Est. registration ≈ {result.estPricePi} π
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.form>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-pi-gold" />
                On-chain Pi registry
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-pi-purple" />
                8 curated domains
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-pi-teal" />
                Pioneer since 2021
              </span>
            </motion.div>
          </div>

          {/* Right: animated Pi mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto hidden h-[360px] w-[360px] items-center justify-center lg:flex"
          >
            {/* pulsing rings */}
            <span className="absolute inset-0 rounded-full border border-pi-gold/30 animate-pi-ring" />
            <span
              className="absolute inset-0 rounded-full border border-pi-purple/30 animate-pi-ring"
              style={{ animationDelay: "1s" }}
            />
            <span
              className="absolute inset-0 rounded-full border border-pi-teal/20 animate-pi-ring"
              style={{ animationDelay: "2s" }}
            />

            {/* glow core */}
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-pi-gold/25 via-pi-purple/15 to-transparent gold-glow">
              <PiLogo size={180} withOrbit className="animate-pi-float" />
            </div>

            {/* floating chips */}
            <FloatingChip
              className="left-0 top-6"
              emoji="🛍️"
              label="soko.pi"
              delay={0.4}
            />
            <FloatingChip
              className="right-0 top-16"
              emoji="🚀"
              label="pioneerhub.pi"
              delay={0.7}
            />
            <FloatingChip
              className="bottom-8 left-4"
              emoji="🎨"
              label="piart.pi"
              delay={1}
            />
            <FloatingChip
              className="bottom-0 right-6"
              emoji="💎"
              label="mali.pi"
              delay={1.3}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingChip({
  className,
  emoji,
  label,
  delay,
}: {
  className?: string;
  emoji: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`absolute flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      <span className="text-base">{emoji}</span>
      <span className="font-mono">{label}</span>
    </motion.div>
  );
}
