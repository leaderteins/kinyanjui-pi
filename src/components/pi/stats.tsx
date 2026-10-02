"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Globe2, Wallet, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatsProps {
  domainsCount: number;
}

const STATS = [
  { label: "Curated .pi domains", value: 8, suffix: "", icon: Globe2, accent: "text-pi-gold" },
  { label: "Pioneers worldwide", value: 60, suffix: "M+", icon: Users, accent: "text-pi-purple" },
  { label: "Pi in circulation", value: 65, suffix: "M π", icon: Wallet, accent: "text-pi-teal" },
  { label: "Ecosystem uptime", value: 99.9, suffix: "%", icon: Activity, accent: "text-pi-rose", decimals: 1 },
];

export function Stats({ domainsCount }: StatsProps) {
  const stats = STATS.map((s, i) =>
    i === 0 ? { ...s, value: domainsCount || 8 } : s
  );

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  accent,
  decimals = 0,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  accent: string;
  decimals?: number;
  delay: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) =>
        setDisplay(
          v.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        ),
    });
    return () => controls.stop();
  }, [inView, value, mv, decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-border"
    >
      <div className="flex items-center justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent ${accent}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-pi-gold/60" />
      </div>
      <div className="mt-4 font-mono text-3xl font-bold tracking-tight">
        {display}
        <span className="text-pi-gold">{suffix}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pi-gold/5 blur-2xl transition-opacity group-hover:bg-pi-gold/10" />
    </motion.div>
  );
}

export function PiPriceCard({
  priceUsd,
  changePct,
  sparkline,
  volumeUsd,
  marketCap,
  updatedAt,
}: {
  priceUsd: number;
  changePct: number;
  sparkline: number[];
  volumeUsd: number;
  marketCap: number;
  updatedAt: string | null;
}) {
  const up = changePct >= 0;
  const min = Math.min(...sparkline);
  const max = Math.max(...sparkline);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const pts = sparkline
    .map((p, i) => {
      const x = (i / (sparkline.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-lg font-bold text-primary-foreground">
          π
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold">
              ${priceUsd.toFixed(2)}
            </span>
            <Badge
              variant="outline"
              className={`gap-1 rounded-full px-2 py-0.5 text-xs ${
                up
                  ? "border-pi-teal/40 bg-pi-teal/10 text-pi-teal"
                  : "border-pi-rose/40 bg-pi-rose/10 text-pi-rose"
              }`}
            >
              {up ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {up ? "+" : ""}
              {changePct.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Pi / USD · {updatedAt ? new Date(updatedAt).toLocaleDateString() : "—"}
          </p>
        </div>
      </div>

      <svg width={w} height={h} className="overflow-visible">
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? "var(--pi-teal)" : "var(--pi-rose)"} stopOpacity="0.5" />
            <stop offset="100%" stopColor={up ? "var(--pi-teal)" : "var(--pi-rose)"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={pts} fill="none" stroke={up ? "var(--pi-teal)" : "var(--pi-rose)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#spark)" />
      </svg>

      <div className="hidden text-right sm:block">
        <p className="font-mono text-sm font-semibold">
          ${(volumeUsd / 1_000_000).toFixed(2)}M
        </p>
        <p className="text-xs text-muted-foreground">24h volume</p>
      </div>
      <div className="hidden text-right md:block">
        <p className="font-mono text-sm font-semibold">
          ${(marketCap / 1_000_000).toFixed(1)}M
        </p>
        <p className="text-xs text-muted-foreground">Market cap</p>
      </div>
    </div>
  );
}
