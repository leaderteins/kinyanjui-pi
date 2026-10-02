"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Eye,
  Mail,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  id: string;
  who: string;
  verb: string;
  target: string;
  when: string;
}

interface ActivityData {
  activity: ActivityItem[];
  subscriberCount: number;
  totalViews: number;
  topDomains: { name: string; emoji: string; views: number; accent: string }[];
}

const ACCENT_DOT: Record<string, string> = {
  gold: "bg-pi-gold",
  purple: "bg-pi-purple",
  teal: "bg-pi-teal",
  rose: "bg-pi-rose",
};

export function EcosystemPulse() {
  const [data, setData] = React.useState<ActivityData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/activity");
        const d = (await res.json()) as ActivityData;
        if (alive) setData(d);
      } catch {
        if (alive) setData({ activity: [], subscriberCount: 0, totalViews: 0, topDomains: [] });
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section
      id="pulse"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-pi-teal/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-teal/30 bg-pi-teal/10 px-3 py-1 text-xs font-medium text-pi-teal"
          >
            <Activity className="h-3.5 w-3.5" />
            Ecosystem pulse
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            The portfolio, <span className="text-gradient-gold">live</span>
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            A real-time look at inquiries, subscribers and the most-viewed
            domains in the portfolio. Refreshes every 30 seconds.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Activity feed */}
          <div className="rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pi-teal/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-pi-teal" />
                </span>
                Recent activity
              </h3>
              <span className="text-xs text-muted-foreground">last 6 inquiries</span>
            </div>

            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pi-scroll pr-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))
              ) : data && data.activity.length > 0 ? (
                data.activity.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10 text-pi-gold">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        <span className="font-semibold">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.verb}</span>{" "}
                        <span className="font-mono font-medium text-pi-gold">
                          {a.target}
                        </span>
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {a.when}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
                  No activity yet — be the first to inquire below.
                </div>
              )}
            </div>
          </div>

          {/* Side stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <MiniStat
                icon={Mail}
                label="Subscribers"
                value={loading ? "—" : String(data?.subscriberCount ?? 0)}
                accent="text-pi-purple"
                bg="bg-pi-purple/10"
              />
              <MiniStat
                icon={Eye}
                label="Total views"
                value={
                  loading
                    ? "—"
                    : (data?.totalViews ?? 0).toLocaleString()
                }
                accent="text-pi-gold"
                bg="bg-pi-gold/10"
              />
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-pi-teal" />
                Most viewed
              </h3>
              <div className="mt-3 space-y-2">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 rounded-lg" />
                  ))
                ) : (
                  data?.topDomains.slice(0, 4).map((d, i) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-3 py-2"
                    >
                      <span className="w-4 font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="text-lg">{d.emoji}</span>
                      <span className="flex-1 font-mono text-sm font-medium">
                        {d.name}
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[d.accent] ?? "bg-pi-gold"}`}
                      />
                      <span className="font-mono text-xs text-muted-foreground">
                        {d.views} views
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  accent,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${accent}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-mono text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
