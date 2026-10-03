"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Rocket,
  Link2,
  Server,
  Check,
  ExternalLink,
  ArrowRight,
  Info,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// The user's existing Pi-hosted app on pinet.com
const CURRENT_PI_APP = "https://kinyanjuiservice7061.pinet.com";
const TARGET_DOMAIN = "kinyanjui.pi";

const STEPS = [
  {
    n: 1,
    icon: Server,
    title: "Deploy this website to a public host",
    color: "text-pi-gold",
    bg: "bg-pi-gold/10",
    desc: "This site currently runs locally. Deploy it to Vercel, Netlify, or any host that supports Next.js so it has a real public URL (e.g. kinyanjui.vercel.app).",
    cta: { label: "Deploy to Vercel", href: "https://vercel.com/new" },
    note: "Free tier is enough — connect your Git repo and deploy.",
  },
  {
    n: 2,
    icon: Globe,
    title: `Open ${TARGET_DOMAIN} in the Pi Browser`,
    color: "text-pi-purple",
    bg: "bg-pi-purple/10",
    desc: `In the Pi Browser app, go to Domains → find ${TARGET_DOMAIN} → open its settings. This is where you configure DNS / resolution records.`,
    cta: { label: "Open Pi Browser", href: "https://minepi.com/pi-browser" },
    note: "You must be signed in with the Pi account that owns the domain.",
  },
  {
    n: 3,
    icon: Link2,
    title: "Point the domain to your deployed URL",
    color: "text-pi-teal",
    bg: "bg-pi-teal/10",
    desc: "In the domain settings, set the target/resolution record to your new public URL (from step 1). This makes kinyanjui.pi resolve to your website instead of the old pinet.com app.",
    cta: null,
    note: "Look for a 'Website URL', 'Redirect', or 'DNS record' field in the Pi Browser domain settings.",
  },
  {
    n: 4,
    icon: Rocket,
    title: "Verify + update the old app",
    color: "text-pi-rose",
    bg: "bg-pi-rose/10",
    desc: `After saving, visit ${TARGET_DOMAIN} in the Pi Browser to confirm it loads your new site. Once confirmed, you can retire or redirect the old ${CURRENT_PI_APP} app.`,
    cta: null,
    note: "DNS changes can take a few minutes to propagate on the Pi network.",
  },
];

export function DomainConnectionGuide() {
  return (
    <section
      id="connect-guide"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-pi-purple/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-pi-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-bold text-pi-gold"
          >
            <Rocket className="h-3.5 w-3.5" />
            Domain connection guide
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Point <span className="font-mono text-gradient-gold">kinyanjui.pi</span>{" "}
            to this website
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
            You currently have an app at{" "}
            <a
              href={CURRENT_PI_APP}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-pi-purple underline underline-offset-2"
            >
              {CURRENT_PI_APP}
            </a>
            . Here&apos;s how to switch it so your <span className="font-mono font-semibold">kinyanjui.pi</span>{" "}
            domain loads this website instead.
          </p>
        </div>

        {/* Current vs target */}
        <div className="mt-8 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          {/* Current */}
          <div className="rounded-2xl border border-pi-rose/30 bg-pi-rose/5 p-4 text-center">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-pi-rose">
              Current
            </p>
            <p className="font-mono text-xs font-semibold break-all">
              kinyanjuiservice7061.pinet.com
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Pi-hosted app (pinet.com)
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </div>

          {/* Target */}
          <div className="rounded-2xl border border-pi-teal/30 bg-pi-teal/5 p-4 text-center">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-pi-teal">
              Target
            </p>
            <p className="font-mono text-base font-bold">kinyanjui.pi</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              This website (after deploy)
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 space-y-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm transition-colors hover:border-border"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.bg} ${step.color}`}
                >
                  <step.icon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-[10px] font-bold text-primary-foreground">
                    {step.n}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                  {step.note && (
                    <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-accent/30 px-2 py-1.5 text-[11px] text-muted-foreground">
                      <Info className="mt-0.5 h-3 w-3 shrink-0 text-pi-gold" />
                      {step.note}
                    </p>
                  )}
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 rounded-full border border-pi-gold/40 bg-pi-gold/10 px-3 py-1 text-[11px] font-medium text-pi-gold transition-colors hover:bg-pi-gold/20"
                    >
                      {step.cta.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* connector */}
              {i < STEPS.length - 1 && (
                <div className="ml-[22px] mt-2 h-4 w-px bg-gradient-to-b from-pi-gold/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Important disclaimer */}
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-dashed border-pi-rose/40 bg-pi-rose/5 p-4 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-pi-rose" />
          <p>
            <span className="font-semibold text-foreground">
              This guide does the explaining — not the configuring.
            </span>{" "}
            This website is a showcase and cannot deploy itself or edit your Pi
            domain records. You must complete steps 1–4 manually. The Pi Browser
            is the only place that can change what{" "}
            <span className="font-mono">kinyanjui.pi</span> resolves to.
          </p>
        </div>
      </div>
    </section>
  );
}
