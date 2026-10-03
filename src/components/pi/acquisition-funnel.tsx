"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  GitCompare,
  HandCoins,
  Wallet,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    icon: Search,
    label: "Browse",
    desc: "Explore the .pi portfolio",
    color: "text-pi-gold",
    bg: "bg-pi-gold/10",
  },
  {
    icon: Heart,
    label: "Favorite",
    desc: "Heart the domains you love",
    color: "text-pi-rose",
    bg: "bg-pi-rose/10",
  },
  {
    icon: GitCompare,
    label: "Compare",
    desc: "Stack up to 3 side-by-side",
    color: "text-pi-purple",
    bg: "bg-pi-purple/10",
  },
  {
    icon: HandCoins,
    label: "Offer",
    desc: "Make an offer with the Pi stepper",
    color: "text-pi-gold",
    bg: "bg-pi-gold/10",
  },
  {
    icon: Wallet,
    label: "Connect",
    desc: "Link your Pi wallet to settle",
    color: "text-pi-teal",
    bg: "bg-pi-teal/10",
  },
];

export function AcquisitionFunnel() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-pi-purple/5 via-card to-pi-gold/5 p-6 backdrop-blur-sm sm:p-8">
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold"
          >
            <Search className="h-3.5 w-3.5" />
            How it works
          </Badge>
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            The <span className="text-gradient-gold">acquisition funnel</span>
          </h2>
          <p className="mt-2 text-pretty text-sm text-muted-foreground">
            From browsing to owning — here&apos;s the journey to acquiring a .pi
            domain from this portfolio.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              {/* connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-full top-7 hidden h-px w-full bg-gradient-to-r from-pi-gold/30 to-transparent lg:block" />
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 ${step.bg}`}
                >
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                  {/* step number badge */}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{step.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom hint */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/40 p-3 text-center text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-pi-teal" />
          Every step is available on this page — scroll up to start browsing, or
          use the command palette (⌘K) to jump to any section.
        </div>
      </div>
    </section>
  );
}
