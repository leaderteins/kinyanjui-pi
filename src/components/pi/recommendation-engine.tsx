"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Wallet,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletState } from "@/lib/wallet-state";
import { ACCENT_STYLES, CATEGORY_LABELS } from "@/lib/pi";
import { toast } from "sonner";

interface Recommendation {
  id: string;
  name: string;
  label: string;
  emoji: string;
  accent: string;
  tagline: string;
  category: string;
  status: string;
  pricePi: number | null;
  featured: boolean;
  views: number;
  score: number;
  reasons: string[];
}

const INTEREST_OPTIONS = [
  { value: "marketplace", label: "Marketplace", emoji: "🛍️" },
  { value: "community", label: "Community", emoji: "🚀" },
  { value: "defi", label: "DeFi", emoji: "👛" },
  { value: "nft", label: "NFT", emoji: "🎨" },
  { value: "utility", label: "Utility", emoji: "🌾" },
  { value: "personal", label: "Personal", emoji: "π" },
];

export function RecommendationEngine({
  onPickDomain,
}: {
  onPickDomain?: (name: string) => void;
}) {
  const { wallet } = useWalletState();
  const [interests, setInterests] = React.useState<string[]>([
    "marketplace",
    "defi",
  ]);
  const [recs, setRecs] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);

  const balance = wallet?.piBalance ?? 0;

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/recommendations?balance=${balance}&interests=${interests.join(",")}`
      );
      const data = (await res.json()) as { recommendations: Recommendation[] };
      setRecs(data.recommendations ?? []);
    } catch {
      toast.error("Could not load recommendations.");
    } finally {
      setLoading(false);
    }
  }, [balance, interests]);

  React.useEffect(() => {
    load();
  }, [load]);

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
            <Lightbulb className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Domain recommendations</h3>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Wallet className="h-3 w-3" />
              {wallet
                ? `Balance: ${balance.toLocaleString()} π`
                : "Connect a wallet for personalized picks"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={load}
          className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Refresh recommendations"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Interest chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {INTEREST_OPTIONS.map((opt) => {
          const active = interests.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleInterest(opt.value)}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "border-pi-gold/50 bg-pi-gold/15 text-pi-gold"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-4 space-y-2.5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : recs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
            <Sparkles className="mx-auto mb-2 h-6 w-6 text-pi-gold/50" />
            Pick some interests categories above to get personalized picks.
          </div>
        ) : (
          recs.map((r, i) => {
            const accent = ACCENT_STYLES[r.accent] ?? ACCENT_STYLES.gold;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-xl border ${accent.border} bg-background/60 p-3`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accent.border} ${accent.bg} text-xl`}
                  >
                    {r.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-sm font-bold tracking-tight">
                        {r.label}
                        <span className={accent.text}>.pi</span>
                      </p>
                      {r.pricePi && (
                        <span className="font-mono text-xs font-semibold text-pi-gold">
                          {r.pricePi.toLocaleString()} π
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {r.tagline}
                    </p>
                    {/* Match reasons */}
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {r.reasons.slice(0, 2).map((reason, idx) => (
                        <span
                          key={idx}
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${accent.bg} ${accent.text}`}
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  {onPickDomain && (
                    <button
                      onClick={() => onPickDomain(r.name)}
                      aria-label={`View ${r.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-pi-gold/40 hover:text-pi-gold"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
