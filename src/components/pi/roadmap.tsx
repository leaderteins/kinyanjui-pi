"use client";

import { motion } from "framer-motion";
import { Check, Circle, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./section-header";

const MILESTONES = [
  {
    quarter: "Q1 · 2021",
    title: "Pioneer journey begins",
    body: "Joined the Pi Network as an early pioneer, completing daily mining sessions and forming a security circle.",
    state: "done",
  },
  {
    quarter: "Q3 · 2023",
    title: "Acquired kinyanjui.pi",
    body: "Registered the flagship personal identity domain on the Pi network — the anchor for everything that followed.",
    state: "done",
  },
  {
    quarter: "Q2 · 2024",
    title: "Portfolio expansion",
    body: "Secured soko.pi, pioneerhub.pi, piart.pi and mali.pi — a focused bet on commerce, community and culture on Pi.",
    state: "done",
  },
  {
    quarter: "Q4 · 2024",
    title: "Open the marketplace",
    body: "Begin developing soko.pi into a peer-to-peer Pi marketplace MVP with listings, escrow and pioneer profiles.",
    state: "active",
  },
  {
    quarter: "Q2 · 2025",
    title: "Launch pioneerhub.pi",
    body: "Ship the community layer — security-circle visualizations, contribution leaderboards and project discovery.",
    state: "planned",
  },
  {
    quarter: "Q4 · 2025",
    title: "Pi-native DeFi suite",
    body: "Concept and prototype piwallet.pi + piswap.pi for low-friction onboarding into the Pi economy.",
    state: "planned",
  },
];

const STATE_STYLES = {
  done: { ring: "bg-pi-teal", text: "text-pi-teal", icon: Check, label: "Done" },
  active: {
    ring: "bg-pi-gold",
    text: "text-pi-gold",
    icon: Circle,
    label: "In progress",
  },
  planned: {
    ring: "bg-muted-foreground/40",
    text: "text-muted-foreground",
    icon: Compass,
    label: "Planned",
  },
} as const;

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-pi-purple/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          n="05"
          sectionId="roadmap"
          align="center"
          badge={{ icon: Compass, label: "Roadmap", color: "purple" }}
          title={
            <>
              From pioneer to <span className="text-gradient-purple">builder</span>
            </>
          }
          description={
            <>
              A transparent look at where the portfolio has been and where it&apos;s
              headed on the Pi Network.
            </>
          }
        />

        <div className="relative mt-12">
          {/* vertical line */}
          <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-pi-gold/60 via-pi-purple/40 to-transparent sm:left-1/2" />

          <div className="space-y-8">
            {MILESTONES.map((m, i) => {
              const s = STATE_STYLES[m.state as keyof typeof STATE_STYLES];
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45 }}
                  className={`relative flex gap-6 sm:gap-0 ${
                    left ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* node */}
                  <div className="absolute left-4 top-3 z-10 -translate-x-1/2 sm:left-1/2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${s.ring} ring-4 ring-background`}
                    >
                      <s.icon className="h-4 w-4 text-primary-foreground" />
                    </span>
                  </div>

                  {/* spacer for desktop alternating */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* card */}
                  <div className="ml-12 flex-1 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-5 backdrop-blur-sm transition-colors hover:border-border">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {m.quarter}
                        </span>
                        <Badge
                          variant="outline"
                          className={`rounded-full ${s.text} border-current/30`}
                        >
                          {s.label}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-semibold">{m.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {m.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
