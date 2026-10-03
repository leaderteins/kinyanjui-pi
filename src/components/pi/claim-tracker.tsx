"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Link2,
  Circle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Clock,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// The 5 domains the user actually owns on the Pi Network.
const OWNED_DOMAINS = [
  "kinyanjui.pi",
  "pimorgages.pi",
  "pimorgage.pi",
  "pidapps.pi",
  "kenyan.pi",
];

const STORAGE_KEY = "kinyanjui-pi-claim-status";

type ClaimStatus = "pending" | "claimed" | "connected";

interface ClaimState {
  [domain: string]: ClaimStatus;
}

function readState(): ClaimState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClaimState) : {};
  } catch {
    return {};
  }
}

function writeState(s: ClaimState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("kinyanjui-pi-claim-change"));
  } catch {
    /* ignore */
  }
}

// The 3 steps a pioneer completes for each domain on the Pi Network.
const STEPS: { key: ClaimStatus; label: string; icon: React.ElementType; desc: string }[] = [
  {
    key: "claimed",
    label: "Claim",
    icon: ShieldCheck,
    desc: "Open the Pi Browser → Domains → find your domain → tap Claim to register it to your Pi account.",
  },
  {
    key: "connected",
    label: "Connect wallet",
    icon: Link2,
    desc: "In the domain settings, link your Pi wallet address so the domain resolves on-chain. Confirm the transaction.",
  },
];

const DEADLINE = new Date("2026-12-31T23:59:59Z").getTime();

export function ClaimTracker() {
  const [status, setStatus] = React.useState<ClaimState>({});
  const [mounted, setMounted] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setStatus(readState());
    const handler = () => setStatus(readState());
    window.addEventListener("kinyanjui-pi-claim-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kinyanjui-pi-claim-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  function setStatusFor(domain: string, next: ClaimStatus) {
    const updated = { ...status, [domain]: next };
    writeState(updated);
    setStatus(updated);
    if (next === "connected") {
      toast.success(`${domain} is connected!`, {
        description: "One more domain secured before the deadline.",
      });
    } else if (next === "claimed") {
      toast.success(`${domain} claimed`, {
        description: "Now connect your Pi wallet to finish.",
      });
    }
  }

  const counts = OWNED_DOMAINS.reduce(
    (acc, name) => {
      const s = status[name] ?? "pending";
      acc[s]++;
      return acc;
    },
    { pending: 0, claimed: 0, connected: 0 } as Record<ClaimStatus, number>
  );
  const connectedCount = counts.connected;
  const claimedCount = counts.claimed;
  const progressPct = Math.round(
    ((connectedCount * 1 + claimedCount * 0.5) / OWNED_DOMAINS.length) * 100
  );

  const daysLeft = Math.max(
    0,
    Math.ceil((DEADLINE - Date.now()) / 86400000)
  );

  return (
    <section
      id="claim"
      className="relative scroll-mt-20 overflow-hidden border-y border-pi-gold/30 bg-gradient-to-br from-pi-gold/5 via-card to-pi-purple/5 py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 pi-grid-bg opacity-30" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-rose/40 bg-pi-rose/10 px-3 py-1 text-xs font-bold text-pi-rose"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Don&apos;t lose your domains
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Claim &amp; connect your{" "}
            <span className="text-gradient-gold">5 .pi domains</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
            You own {OWNED_DOMAINS.length} domains on the Pi Network. Each must
            be claimed and connected to a Pi wallet by{" "}
            <span className="font-semibold text-foreground">
              December 31, 2026
            </span>{" "}
            — or you risk losing them. Track your progress below.
          </p>
        </div>

        {/* Progress summary */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-pi-teal">
                  {connectedCount}
                  <span className="text-lg text-muted-foreground">
                    /{OWNED_DOMAINS.length}
                  </span>
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Connected
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-pi-gold">
                  {claimedCount}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Claimed (pending connect)
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-pi-rose">
                  {counts.pending}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Not started
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-pi-rose/30 bg-pi-rose/10 px-3 py-1.5">
              <Clock className="h-4 w-4 text-pi-rose" />
              <span className="font-mono text-sm font-bold text-pi-rose">
                {daysLeft}d
              </span>
              <span className="text-xs text-muted-foreground">left</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Portfolio claim progress</span>
              <span className="font-mono font-semibold">{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-pi-gold via-pi-purple to-pi-teal"
              />
            </div>
          </div>
        </div>

        {/* Domain list */}
        <div className="mt-6 space-y-3">
          {OWNED_DOMAINS.map((domain, i) => {
            const s: ClaimStatus = status[domain] ?? "pending";
            const isDone = s === "connected";
            const isOpen = expanded === domain;
            return (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-sm transition-colors ${
                  isDone
                    ? "border-pi-teal/40"
                    : s === "claimed"
                    ? "border-pi-gold/40"
                    : "border-border/60"
                }`}
              >
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : domain)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent/30"
                >
                  <StatusIcon status={s} />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-base font-bold tracking-tight">
                      {domain}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isDone
                        ? "Fully secured — claimed & connected"
                        : s === "claimed"
                        ? "Claimed — connect your wallet next"
                        : "Not started — claim this domain first"}
                    </p>
                  </div>
                  <StatusBadge status={s} />
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
                      <div className="space-y-3 p-4">
                        {STEPS.map((step, idx) => {
                          const stepDone =
                            (step.key === "claimed" &&
                              (s === "claimed" || s === "connected")) ||
                            (step.key === "connected" && s === "connected");
                          return (
                            <div
                              key={step.key}
                              className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                                stepDone
                                  ? "border-pi-teal/30 bg-pi-teal/5"
                                  : "border-border/60 bg-card/40"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  stepDone
                                    ? "bg-pi-teal text-primary-foreground"
                                    : "bg-border/60 text-muted-foreground"
                                }`}
                              >
                                {stepDone ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  idx + 1
                                )}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-1.5 text-sm font-semibold">
                                  <step.icon className="h-3.5 w-3.5 text-pi-gold" />
                                  {step.label}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {step.desc}
                                </p>
                                {!stepDone && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <a
                                      href="https://minepi.com/pi-browser"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 rounded-full border border-pi-gold/40 bg-pi-gold/10 px-2.5 py-1 text-[11px] font-medium text-pi-gold transition-colors hover:bg-pi-gold/20"
                                    >
                                      Open Pi Browser
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                    <button
                                      onClick={() =>
                                        setStatusFor(domain, step.key)
                                      }
                                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-pi-teal/40 hover:text-pi-teal"
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                      Mark as done
                                    </button>
                                  </div>
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
                        {s !== "pending" && (
                          <button
                            onClick={() => {
                              setStatusFor(domain, "pending");
                              toast(`Reset ${domain}`);
                            }}
                            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                          >
                            Reset this domain&apos;s status
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

        {/* Footer note */}
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-pi-gold/30 bg-pi-gold/5 p-4 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-pi-gold" />
          <p>
            <span className="font-semibold text-foreground">Important:</span>{" "}
            This tracker is a progress checklist stored in your browser — it does
            NOT claim or connect anything on the Pi blockchain. You must complete
            the actual claim + wallet connection inside the{" "}
            <a
              href="https://minepi.com/pi-browser"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-pi-gold underline underline-offset-2 hover:text-pi-purple"
            >
              Pi Browser
            </a>
            . Tap a domain above to see the exact steps.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatusIcon({ status }: { status: ClaimStatus }) {
  if (status === "connected") {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pi-teal/15 text-pi-teal">
        <CheckCircle2 className="h-5 w-5" />
      </span>
    );
  }
  if (status === "claimed") {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pi-gold/15 text-pi-gold">
        <ShieldCheck className="h-5 w-5" />
      </span>
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pi-rose/10 text-pi-rose">
      <Circle className="h-5 w-5" />
    </span>
  );
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  const map = {
    connected: { label: "Secured", cls: "border-pi-teal/40 bg-pi-teal/10 text-pi-teal" },
    claimed: { label: "Claimed", cls: "border-pi-gold/40 bg-pi-gold/10 text-pi-gold" },
    pending: { label: "Pending", cls: "border-pi-rose/40 bg-pi-rose/10 text-pi-rose" },
  } as const;
  const m = map[status];
  return (
    <Badge
      variant="outline"
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${m.cls}`}
    >
      {m.label}
    </Badge>
  );
}
