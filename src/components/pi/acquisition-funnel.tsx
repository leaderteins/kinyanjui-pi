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
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/lib/pi-storage";
import { useWalletState } from "@/lib/wallet-state";

const STEPS = [
  {
    icon: Search,
    label: "Browse",
    desc: "Explore the .pi portfolio",
    color: "text-pi-gold",
    bg: "bg-pi-gold/10",
    href: "#portfolio",
  },
  {
    icon: Heart,
    label: "Favorite",
    desc: "Heart the domains you love",
    color: "text-pi-rose",
    bg: "bg-pi-rose/10",
    href: "#portfolio",
  },
  {
    icon: GitCompare,
    label: "Compare",
    desc: "Stack up to 3 side-by-side",
    color: "text-pi-purple",
    bg: "bg-pi-purple/10",
    href: "#portfolio",
  },
  {
    icon: HandCoins,
    label: "Offer",
    desc: "Make an offer with the Pi stepper",
    color: "text-pi-gold",
    bg: "bg-pi-gold/10",
    href: "#portfolio",
  },
  {
    icon: Wallet,
    label: "Connect",
    desc: "Link your Pi wallet to settle",
    color: "text-pi-teal",
    bg: "bg-pi-teal/10",
    href: "#portfolio",
  },
];

const COMPARISON_KEY = "kinyanjui-pi-compare-count";
const OFFER_KEY = "kinyanjui-pi-offer-made";

export function AcquisitionFunnel() {
  const { count: favCount, mounted: favMounted } = useFavorites();
  const { wallet, mounted: walletMounted } = useWalletState();
  const [compareCount, setCompareCount] = React.useState(0);
  const [offerMade, setOfferMade] = React.useState(false);

  // Read compare count + offer flag from localStorage (set by domain-portfolio + make-offer-modal)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const readState = () => {
      try {
        setCompareCount(Number(localStorage.getItem(COMPARISON_KEY) ?? "0"));
        setOfferMade(localStorage.getItem(OFFER_KEY) === "true");
      } catch {
        /* ignore */
      }
    };
    readState();
    window.addEventListener("storage", readState);
    window.addEventListener("kinyanjui-pi-storage", readState);
    return () => {
      window.removeEventListener("storage", readState);
      window.removeEventListener("kinyanjui-pi-storage", readState);
    };
  }, []);

  // Step 1 (Browse) is always "done" once you've seen the page
  // Step 2 (Favorite) done when favCount > 0
  // Step 3 (Compare) done when compareCount >= 2
  // Step 4 (Offer) done when offerMade
  // Step 5 (Connect) done when wallet connected
  const completed = [
    true, // Browse — always done
    favMounted && favCount > 0,
    compareCount >= 2,
    offerMade,
    walletMounted && !!wallet,
  ];
  const completedCount = completed.filter(Boolean).length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-pi-purple/5 via-card to-pi-gold/5 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
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
              From browsing to owning — your progress lights up as you go.
            </p>
          </div>
          {/* Progress indicator */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5">
            <span className="font-mono text-sm font-bold text-pi-gold">
              {completedCount}
            </span>
            <span className="text-xs text-muted-foreground">/ {STEPS.length}</span>
            <div className="h-4 w-px bg-border/60" />
            <span className="text-xs font-medium text-muted-foreground">
              {completedCount === STEPS.length
                ? "Complete!"
                : "in progress"}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step, i) => {
            const done = completed[i];
            return (
              <motion.a
                key={step.label}
                href={step.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative cursor-pointer"
              >
                {/* connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`absolute left-full top-7 hidden h-px w-full transition-colors lg:block ${
                      done
                        ? "bg-gradient-to-r from-pi-teal/50 to-pi-gold/20"
                        : "bg-gradient-to-r from-pi-gold/20 to-transparent"
                    }`}
                  />
                )}

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
                      done
                        ? "border-pi-teal/50 bg-pi-teal/10 shadow-lg shadow-pi-teal/10"
                        : `border-border/60 ${step.bg}`
                    } group-hover:scale-105`}
                  >
                    {done ? (
                      <Check className="h-6 w-6 text-pi-teal" />
                    ) : (
                      <step.icon className={`h-6 w-6 ${step.color}`} />
                    )}
                    {/* step number badge */}
                    <span
                      className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                        done
                          ? "bg-pi-teal text-primary-foreground"
                          : "bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {/* completion ring pulse */}
                    {done && (
                      <motion.span
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl border border-pi-teal"
                      />
                    )}
                  </div>
                  <h3
                    className={`mt-3 text-sm font-semibold ${
                      done ? "text-pi-teal" : ""
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                  {done && (
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-pi-teal">
                      ✓ Done
                    </span>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/40 p-3 text-center text-xs text-muted-foreground">
          {completedCount === STEPS.length ? (
            <>
              <Check className="h-3.5 w-3.5 text-pi-teal" />
              You&apos;ve completed every step — you&apos;re ready to acquire a .pi
              domain!
            </>
          ) : (
            <>
              <ArrowRight className="h-3.5 w-3.5 text-pi-gold" />
              {completedCount === 1
                ? "Scroll down to start browsing the portfolio — steps will light up as you progress."
                : `${STEPS.length - completedCount} step${STEPS.length - completedCount > 1 ? "s" : ""} to go — keep exploring to complete the funnel.`}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
