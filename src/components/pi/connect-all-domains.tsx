"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Link2,
  Check,
  ExternalLink,
  ArrowRight,
  Info,
  AlertCircle,
  Server,
  Rocket,
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// The deployed website URL — all 5 domains will point here.
const DEPLOY_URL = "https://kinyanjui-pi.vercel.app";

// All 5 owned domains that need to be pointed to the deployed site.
const OWNED_DOMAINS = [
  { name: "kinyanjui.pi", emoji: "π", accent: "gold" },
  { name: "pimorgages.pi", emoji: "🏦", accent: "gold" },
  { name: "pimorgage.pi", emoji: "🏠", accent: "purple" },
  { name: "pidapps.pi", emoji: "⚡", accent: "teal" },
  { name: "kenyan.pi", emoji: "🇰🇪", accent: "rose" },
];

const STORAGE_KEY = "kinyanjui-pi-connect-status";

type StepKey = "open" | "set-url" | "save" | "verify";
type ConnectState = { [domain: string]: StepKey[] }; // completed steps per domain

function readState(): ConnectState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConnectState) : {};
  } catch {
    return {};
  }
}

function writeState(s: ConnectState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("kinyanjui-pi-connect-change"));
  } catch {
    /* ignore */
  }
}

const STEPS: { key: StepKey; label: string; icon: React.ElementType; desc: string }[] = [
  {
    key: "open",
    label: "Open domain in Pi Browser",
    icon: Globe,
    desc: "In the Pi Browser app, go to Domains → find this domain → open its settings. You must be signed in with the Pi account that owns the domain.",
  },
  {
    key: "set-url",
    label: "Set target URL",
    icon: Link2,
    desc: `In the domain settings, find the 'Website URL', 'Redirect', or 'DNS record' field and set it to: ${DEPLOY_URL}`,
  },
  {
    key: "save",
    label: "Save & confirm",
    icon: Server,
    desc: "Save the record and confirm any transaction. The Pi network will update the domain resolution.",
  },
  {
    key: "verify",
    label: "Verify it loads",
    icon: Rocket,
    desc: "Visit the domain in the Pi Browser to confirm it loads your website. DNS changes can take a few minutes to propagate.",
  },
];

const ACCENT_HEX: Record<string, string> = {
  gold: "var(--pi-gold)",
  purple: "var(--pi-purple)",
  teal: "var(--pi-teal)",
  rose: "var(--pi-rose)",
};

export function ConnectAllDomains() {
  const [state, setState] = React.useState<ConnectState>({});
  const [mounted, setMounted] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(OWNED_DOMAINS[0].name);

  React.useEffect(() => {
    setMounted(true);
    setState(readState());
    const handler = () => setState(readState());
    window.addEventListener("kinyanjui-pi-connect-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kinyanjui-pi-connect-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  function toggleStep(domain: string, step: StepKey) {
    const current = state[domain] ?? [];
    const next = current.includes(step)
      ? current.filter((s) => s !== step)
      : [...current, step];
    const updated = { ...state, [domain]: next };
    writeState(updated);
    setState(updated);
    const doneCount = next.length;
    if (doneCount === STEPS.length) {
      toast.success(`${domain} is connected! 🎉`, {
        description: "All steps complete — this domain now points to your site.",
      });
    } else if (doneCount > 0) {
      toast(`${domain}: ${doneCount}/${STEPS.length} steps done`);
    }
  }

  const totalDone = OWNED_DOMAINS.filter(
    (d) => (state[d.name]?.length ?? 0) === STEPS.length
  ).length;
  const progressPct = Math.round(
    (OWNED_DOMAINS.reduce(
      (acc, d) => acc + (state[d.name]?.length ?? 0),
      0
    ) /
      (OWNED_DOMAINS.length * STEPS.length)) *
      100
  );

  return (
    <section
      id="connect-all"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-gradient-to-br from-pi-gold/5 via-card to-pi-purple/5 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 pi-grid-bg opacity-30" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-bold text-pi-gold"
          >
            <Rocket className="h-3.5 w-3.5" />
            Connect all your domains
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Point all{" "}
            <span className="text-gradient-gold">5 .pi domains</span> to this
            website
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
            Your website is live at{" "}
            <a
              href={DEPLOY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-pi-gold underline underline-offset-2"
            >
              {DEPLOY_URL.replace("https://", "")}
            </a>
            . Follow the steps below for each of your {OWNED_DOMAINS.length}{" "}
            domains so they all resolve to this site.
          </p>
        </div>

        {/* Progress summary */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-pi-teal">
                  {totalDone}
                  <span className="text-lg text-muted-foreground">
                    /{OWNED_DOMAINS.length}
                  </span>
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Domains connected
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-pi-gold">
                  {progressPct}%
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Overall progress
                </p>
              </div>
            </div>
            <a
              href="https://minepi.com/pi-browser"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="gap-1.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
              >
                Open Pi Browser <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-border/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-pi-gold via-pi-purple to-pi-teal"
            />
          </div>
        </div>

        {/* Domain list */}
        <div className="mt-6 space-y-3">
          {OWNED_DOMAINS.map((domain, i) => {
            const doneSteps = state[domain.name] ?? [];
            const isFullyDone = doneSteps.length === STEPS.length;
            const isOpen = expanded === domain.name;
            const accentColor = ACCENT_HEX[domain.accent] ?? "var(--pi-gold)";
            return (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-sm transition-colors ${
                  isFullyDone
                    ? "border-pi-teal/40"
                    : doneSteps.length > 0
                    ? "border-pi-gold/40"
                    : "border-border/60"
                }`}
              >
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : domain.name)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent/30"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xl"
                    style={{
                      borderColor: `color-mix(in oklab, ${accentColor} 40%, transparent)`,
                      backgroundColor: `color-mix(in oklab, ${accentColor} 12%, transparent)`,
                    }}
                  >
                    {domain.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-base font-bold tracking-tight">
                      {domain.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isFullyDone
                        ? "✓ Fully connected — points to your site"
                        : doneSteps.length > 0
                        ? `${doneSteps.length}/${STEPS.length} steps done — ${STEPS.length - doneSteps.length} to go`
                        : "Not started — expand to see steps"}
                    </p>
                  </div>
                  {/* mini progress dots */}
                  <div className="flex items-center gap-1">
                    {STEPS.map((s, idx) => (
                      <span
                        key={s.key}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          doneSteps.includes(s.key)
                            ? "bg-pi-teal"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isFullyDone
                        ? "border-pi-teal/40 bg-pi-teal/10 text-pi-teal"
                        : doneSteps.length > 0
                        ? "border-pi-gold/40 bg-pi-gold/10 text-pi-gold"
                        : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    {isFullyDone
                      ? "Connected"
                      : doneSteps.length > 0
                      ? "In progress"
                      : "Pending"}
                  </Badge>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded steps */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-border/60"
                    >
                      <div className="space-y-2.5 p-4">
                        {STEPS.map((step, idx) => {
                          const stepDone = doneSteps.includes(step.key);
                          return (
                            <div
                              key={step.key}
                              className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                                stepDone
                                  ? "border-pi-teal/30 bg-pi-teal/5"
                                  : "border-border/60 bg-card/40"
                              }`}
                            >
                              <button
                                onClick={() => toggleStep(domain.name, step.key)}
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                  stepDone
                                    ? "border-pi-teal bg-pi-teal text-primary-foreground"
                                    : "border-border/60 text-muted-foreground hover:border-pi-gold/40 hover:text-pi-gold"
                                }`}
                                aria-label={
                                  stepDone ? "Mark as not done" : "Mark as done"
                                }
                              >
                                {stepDone ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <span className="text-xs font-bold">
                                    {idx + 1}
                                  </span>
                                )}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-1.5 text-sm font-semibold">
                                  <step.icon className="h-3.5 w-3.5 text-pi-gold" />
                                  {step.label}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {step.desc}
                                </p>
                                {step.key === "set-url" && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <code className="flex-1 rounded-lg border border-border/60 bg-background/60 px-2 py-1 font-mono text-[11px] text-pi-gold break-all">
                                      {DEPLOY_URL}
                                    </code>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard?.writeText(DEPLOY_URL);
                                        toast.success("URL copied!");
                                      }}
                                      className="shrink-0 rounded-lg border border-border/60 bg-card/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                )}
                                {step.key === "open" && (
                                  <a
                                    href="https://minepi.com/pi-browser"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 rounded-full border border-pi-gold/40 bg-pi-gold/10 px-2.5 py-1 text-[11px] font-medium text-pi-gold transition-colors hover:bg-pi-gold/20"
                                  >
                                    Open Pi Browser
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                {stepDone && (
                                  <p className="mt-1 text-[11px] font-medium text-pi-teal">
                                    ✓ Completed
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Reset */}
                        {doneSteps.length > 0 && (
                          <button
                            onClick={() => {
                              const updated = { ...state };
                              delete updated[domain.name];
                              writeState(updated);
                              setState(updated);
                              toast(`Reset ${domain.name}`);
                            }}
                            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                          >
                            Reset this domain&apos;s progress
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Important disclaimer */}
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-dashed border-pi-rose/40 bg-pi-rose/5 p-4 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-pi-rose" />
          <p>
            <span className="font-semibold text-foreground">
              This is a checklist — not the actual DNS configuration.
            </span>{" "}
            This website cannot edit your Pi domain records. You must complete
            the steps manually inside the Pi Browser app for each domain. The
            Pi Browser is the only place that can change what your .pi domains
            resolve to.
          </p>
        </div>

        {/* All done celebration */}
        <AnimatePresence>
          {totalDone === OWNED_DOMAINS.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-pi-teal/40 bg-pi-teal/10 p-6 text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-pi-teal" />
              <h3 className="text-lg font-bold text-pi-teal">
                All 5 domains connected! 🎉
              </h3>
              <p className="text-sm text-muted-foreground">
                Every .pi domain now points to your website. Pioneers can visit
                kinyanjui.pi, pimorgages.pi, pimorgage.pi, pidapps.pi, or
                kenyan.pi in the Pi Browser and they&apos;ll all load this site.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
