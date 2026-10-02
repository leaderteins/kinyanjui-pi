"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Users2,
  Lock,
  Network,
  Coins,
  Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PILLARS = [
  {
    icon: Smartphone,
    title: "Mine on any phone",
    body: "Pi is mined by everyday people with a tap — no expensive rigs, no energy waste. A truly accessible digital currency.",
    accent: "text-pi-gold",
    bg: "bg-pi-gold/10",
  },
  {
    icon: Users2,
    title: "60M+ pioneers",
    body: "One of the largest crypto communities on earth, organized into security circles that protect the network.",
    accent: "text-pi-purple",
    bg: "bg-pi-purple/10",
  },
  {
    icon: Lock,
    title: "Security circles",
    body: "Pioneers vouch for trusted peers, building a graph of trust that secures transactions without centralized gatekeepers.",
    accent: "text-pi-teal",
    bg: "bg-pi-teal/10",
  },
  {
    icon: Network,
    title: "On-chain domains",
    body: ".pi domains resolve on the Pi blockchain — a human-readable identity layer for wallets, apps and creators.",
    accent: "text-pi-rose",
    bg: "bg-pi-rose/10",
  },
];

export function AboutPi() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 pi-grid-bg opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-pi-teal/30 bg-pi-teal/10 px-3 py-1 text-xs font-medium text-pi-teal"
            >
              <Coins className="h-3.5 w-3.5" />
              About the Pi Network
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              A digital currency built for{" "}
              <span className="text-gradient-gold">everyday people</span>.
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Pi Network was launched in 2019 by a team of Stanford graduates
              with a radical idea: what if mining didn&apos;t require expensive
              hardware? Today, tens of millions of pioneers around the globe
              secure the network from their phones — and{" "}
              <span className="font-mono font-semibold text-foreground">.pi</span>{" "}
              domains are how they claim their slice of the ecosystem.
            </p>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
                  <Rocket className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Why .pi domains matter</p>
                  <p className="text-sm text-muted-foreground">
                    A memorable identity for wallets, storefronts & dApps.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Instead of pasting a long wallet address, you send Pi to{" "}
                <span className="font-mono font-semibold text-pi-gold">kinyanjui.pi</span>.
                Instead of a raw IP, you visit{" "}
                <span className="font-mono font-semibold text-pi-purple">soko.pi</span>.
                The domain layer turns the Pi blockchain into a place people can
                actually navigate.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm transition-colors hover:border-border"
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${p.bg} ${p.accent}`}
                >
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
