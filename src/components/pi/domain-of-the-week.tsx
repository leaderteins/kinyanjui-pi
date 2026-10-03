"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ACCENT_STYLES, type PiDomain } from "@/lib/pi";

interface DomainOfTheWeekProps {
  onOpenDomain?: (d: PiDomain) => void;
}

// Deterministic weekly pick — rotates through the portfolio by ISO week number.
function pickOfWeek(domains: PiDomain[]): PiDomain | null {
  if (!domains.length) return null;
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
  );
  return domains[week % domains.length];
}

export function DomainOfTheWeek({ onOpenDomain }: DomainOfTheWeekProps) {
  const [domains, setDomains] = React.useState<PiDomain[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/domains?featured=true")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setDomains(d.domains ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const pick = pickOfWeek(domains);

  if (loading) {
    return <Skeleton className="mb-8 h-40 rounded-2xl" />;
  }
  if (!pick) return null;

  const accent = ACCENT_STYLES[pick.accent] ?? ACCENT_STYLES.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative mb-8 overflow-hidden rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.from} ${accent.to} p-5 sm:p-6`}
    >
      {/* shimmer accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-pi-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 -bottom-12 h-32 w-32 rounded-full bg-pi-purple/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        {/* emoji badge */}
        <span
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} text-4xl shadow-lg`}
        >
          {pick.emoji}
        </span>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <Badge
            variant="outline"
            className={`mb-2 gap-1.5 rounded-full border ${accent.border} ${accent.bg} ${accent.text} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide`}
          >
            <Star className="h-3 w-3" />
            Domain of the week
          </Badge>
          <h3 className="font-mono text-xl font-bold tracking-tight sm:text-2xl">
            {pick.label}
            <span className={accent.text}>.pi</span>
          </h3>
          <p className="mt-1 line-clamp-2 text-pretty text-sm text-muted-foreground">
            {pick.tagline}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-start">
            {pick.pricePi && (
              <span className="font-mono font-semibold text-pi-gold">
                {pick.pricePi.toLocaleString()} π
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" /> {pick.views} views
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Button
            onClick={() => onOpenDomain?.(pick)}
            className="gap-1.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground shadow-lg shadow-pi-gold/20"
          >
            Explore <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
