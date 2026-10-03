"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthBreakdown {
  label: string;
  value: number;
  max: number;
  color: string;
}

interface HealthData {
  name: string;
  score: number;
  grade: string;
  inquiryCount: number;
  views: number;
  featured: boolean;
  status: string;
  breakdown: HealthBreakdown[];
}

const COLOR_HEX: Record<string, string> = {
  gold: "var(--pi-gold)",
  purple: "var(--pi-purple)",
  teal: "var(--pi-teal)",
  rose: "var(--pi-rose)",
};

const GRADE_COLOR: Record<string, string> = {
  Excellent: "text-pi-teal",
  Strong: "text-pi-gold",
  Growing: "text-pi-purple",
  Emerging: "text-pi-rose",
  New: "text-muted-foreground",
};

export function DomainHealth({ domainName }: { domainName: string }) {
  const [data, setData] = React.useState<HealthData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/domain-health?name=${encodeURIComponent(domainName)}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d && !d.error) setData(d as HealthData);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [domainName]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 p-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-pi-gold" />
        Computing health score…
      </div>
    );
  }

  if (!data) return null;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (data.score / 100) * circumference;

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-pi-gold" />
        <h4 className="text-sm font-semibold">Domain health score</h4>
      </div>

      <div className="mt-3 flex items-center gap-4">
        {/* Radial gauge */}
        <div className="relative h-28 w-28 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="health-grad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="var(--pi-gold)" />
                <stop offset="100%" stopColor="var(--pi-purple)" />
              </linearGradient>
            </defs>
            {/* track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
              opacity="0.4"
            />
            {/* progress */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#health-grad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="font-mono text-2xl font-bold"
            >
              {data.score}
            </motion.span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              / 100
            </span>
          </div>
        </div>

        {/* Grade + breakdown */}
        <div className="min-w-0 flex-1">
          <Badge
            variant="outline"
            className={`mb-2 rounded-full text-[10px] font-bold ${GRADE_COLOR[data.grade] ?? ""}`}
          >
            {data.grade}
          </Badge>
          <div className="space-y-1">
            {data.breakdown.map((b) => {
              const pct = Math.round((b.value / b.max) * 100);
              return (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="w-32 shrink-0 text-[11px] text-muted-foreground">
                    {b.label}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: COLOR_HEX[b.color] ?? "var(--pi-gold)",
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono text-[11px] font-medium">
                    {b.value}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {data.inquiryCount} inquiries · {data.views} views
            {data.featured ? " · featured" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
