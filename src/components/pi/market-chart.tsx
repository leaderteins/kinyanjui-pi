"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ComposedChart,
} from "recharts";
import { LineChart, CandlestickChart, Activity, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SeriesPoint {
  t: string;
  price: number;
  volume: number;
  marketCap: number;
}

interface MarketChartProps {
  series: SeriesPoint[];
  latest: {
    priceUsd: number;
    changePct: number;
    volumeUsd: number;
    marketCap: number;
    updatedAt: string | null;
  };
}

const PERIODS = [
  { value: 7, label: "7D" },
  { value: 14, label: "14D" },
  { value: 30, label: "30D" },
] as const;

type Metric = "price" | "volume" | "marketCap";
const METRICS: { value: Metric; label: string; icon: React.ElementType; fmt: (n: number) => string }[] = [
  { value: "price", label: "Price", icon: LineChart, fmt: (n) => `$${n.toFixed(2)}` },
  { value: "volume", label: "Volume", icon: BarChart3, fmt: (n) => `$${(n / 1e6).toFixed(2)}M` },
  { value: "marketCap", label: "Market Cap", icon: Activity, fmt: (n) => `$${(n / 1e6).toFixed(1)}M` },
];

function formatDate(t: string) {
  const d = new Date(t);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function MarketChart({ series, latest }: MarketChartProps) {
  const [period, setPeriod] = React.useState<number>(14);
  const [metric, setMetric] = React.useState<Metric>("price");

  const data = React.useMemo(() => {
    const slice = series.slice(-period);
    return slice.map((p) => ({
      ...p,
      date: formatDate(p.t),
    }));
  }, [series, period]);

  const isPrice = metric === "price";
  const stroke = "var(--pi-gold)";
  const fill = "var(--pi-gold)";
  const up = latest.changePct >= 0;

  const high = data.length ? Math.max(...data.map((d) => d[metric])) : 0;
  const low = data.length ? Math.min(...data.map((d) => d[metric])) : 0;

  return (
    <section
      id="market"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 pi-grid-bg opacity-40" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-pi-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold"
            >
              <CandlestickChart className="h-3.5 w-3.5" />
              Market data
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              The Pi market, <span className="text-gradient-gold">at a glance</span>
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Track illustrative Pi price action, volume and market cap across the
              ecosystem. Toggle the timeframe and metric to explore the trend.
            </p>
          </div>

          {/* metric switch */}
          <div className="flex flex-wrap items-center gap-2">
            {METRICS.map((m) => (
              <Button
                key={m.value}
                size="sm"
                variant={metric === m.value ? "default" : "outline"}
                onClick={() => setMetric(m.value)}
                className={`h-8 gap-1.5 rounded-full px-3 text-xs ${
                  metric === m.value
                    ? "bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
                    : ""
                }`}
              >
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </Button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm sm:p-6"
        >
          {/* Header row: price + period toggle */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pi-gold to-pi-purple text-lg font-bold text-primary-foreground">
                π
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold tracking-tight">
                    ${latest.priceUsd.toFixed(2)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      up
                        ? "border-pi-teal/40 bg-pi-teal/10 text-pi-teal"
                        : "border-pi-rose/40 bg-pi-rose/10 text-pi-rose"
                    }`}
                  >
                    {up ? "▲" : "▼"} {Math.abs(latest.changePct).toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pi / USD ·{" "}
                  {latest.updatedAt
                    ? new Date(latest.updatedAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    period === p.value
                      ? "bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="pi-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fill} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={fill} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pi-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--pi-purple)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--pi-purple)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tickFormatter={(v: number) => {
                    if (metric === "price") return `$${v.toFixed(0)}`;
                    if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
                    if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
                    return `$${v}`;
                  }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--pi-gold)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "var(--popover-foreground)",
                    boxShadow: "0 12px 30px -8px rgba(0,0,0,0.3)",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
                  formatter={(value: number) => {
                    const fmt = METRICS.find((m) => m.value === metric)?.fmt;
                    return [fmt ? fmt(value) : value, METRICS.find((m) => m.value === metric)?.label];
                  }}
                />
                {metric !== "price" && (
                  <Bar
                    dataKey={metric}
                    fill="url(#pi-bar)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey={isPrice ? "price" : metric}
                  stroke={stroke}
                  strokeWidth={2.5}
                  fill={isPrice ? "url(#pi-area)" : "transparent"}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: stroke,
                    stroke: "var(--background)",
                    strokeWidth: 2,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Stat row */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
            <ChartStat label={`${period}D high`} value={METRICS[0].fmt(high)} accent="text-pi-teal" />
            <ChartStat label={`${period}D low`} value={METRICS[0].fmt(low)} accent="text-pi-rose" />
            <ChartStat
              label="24h volume"
              value={`$${(latest.volumeUsd / 1e6).toFixed(2)}M`}
              accent="text-pi-gold"
            />
            <ChartStat
              label="Market cap"
              value={`$${(latest.marketCap / 1e6).toFixed(1)}M`}
              accent="text-pi-purple"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChartStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-0.5 font-mono text-sm font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
