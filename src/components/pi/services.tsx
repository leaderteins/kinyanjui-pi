"use client";

import { motion } from "framer-motion";
import {
  Store,
  Wallet,
  Palette,
  Sprout,
  RefreshCw,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SERVICES = [
  {
    icon: Store,
    title: "Marketplace builds",
    body: "Turn soko.pi or kilimo.pi into a live storefront where pioneers buy and sell with Pi — full catalog, cart and escrow flows.",
    tag: "soko.pi",
    accent: "text-pi-teal",
    bg: "bg-pi-teal/10",
    border: "border-pi-teal/30",
  },
  {
    icon: Wallet,
    title: "Wallet & payments",
    body: "Ship a wallet UX on piwallet.pi — multi-account views, QR payments, transaction history and merchant onboarding.",
    tag: "piwallet.pi",
    accent: "text-pi-gold",
    bg: "bg-pi-gold/10",
    border: "border-pi-gold/30",
  },
  {
    icon: Palette,
    title: "NFT galleries",
    body: "Curate a Pi-native art marketplace on piart.pi — minting, royalties, exhibition halls and creator profiles.",
    tag: "piart.pi",
    accent: "text-pi-rose",
    bg: "bg-pi-rose/10",
    border: "border-pi-rose/30",
  },
  {
    icon: Sprout,
    title: "Real-world utility",
    body: "Connect agriculture and supply chains on kilimo.pi — list produce, track provenance, settle in Pi.",
    tag: "kilimo.pi",
    accent: "text-pi-teal",
    bg: "bg-pi-teal/10",
    border: "border-pi-teal/30",
  },
  {
    icon: RefreshCw,
    title: "Swaps & DeFi",
    body: "Concept a low-friction swap interface on piswap.pi and a wealth dashboard on mali.pi for the Pi-native economy.",
    tag: "piswap.pi",
    accent: "text-pi-gold",
    bg: "bg-pi-gold/10",
    border: "border-pi-gold/30",
  },
  {
    icon: Megaphone,
    title: "Community & brand",
    body: "Anchor your pioneer identity on kinyanjui.pi or grow a hub on pioneerhub.pi — profiles, leaderboards, project discovery.",
    tag: "pioneerhub.pi",
    accent: "text-pi-purple",
    bg: "bg-pi-purple/10",
    border: "border-pi-purple/30",
  },
];

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold"
          >
            <Megaphone className="h-3.5 w-3.5" />
            Use cases
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            What these domains can{" "}
            <span className="text-gradient-gold">become</span>
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Each .pi name is a seed. Here&apos;s the forest it can grow into —
            ready to develop or partner on.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
              className={`group relative overflow-hidden rounded-2xl border ${s.border} bg-card/50 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} ${s.accent}`}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {s.tag}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              <span
                className={`mt-4 inline-flex items-center gap-1 text-xs font-medium ${s.accent} opacity-0 transition-opacity group-hover:opacity-100`}
              >
                Partner on this <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
