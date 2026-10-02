"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PiGlossary } from "./glossary";

const FAQS = [
  {
    q: "What is a .pi domain?",
    a: "A .pi domain is a human-readable name that resolves on the Pi Network blockchain — similar to how .eth names work on Ethereum. Instead of sharing a long wallet address, you share a name like kinyanjui.pi. It can point to wallets, websites and apps inside the Pi ecosystem.",
  },
  {
    q: "Can I buy one of the domains in this portfolio?",
    a: "Some domains are marked 'For Sale' with an asking price in Pi. Others are 'Held' or 'In Development' but open to partnership, joint ventures or licensing. Use the contact form below with your offer or idea and we'll take it from there.",
  },
  {
    q: "How is the Pi price shown on this site calculated?",
    a: "The price ticker shows illustrative market data stored locally for demonstration. The real Pi value depends on Mainnet exchange listings, liquidity and adoption — always do your own research before transacting.",
  },
  {
    q: "Do I need to be a Pi pioneer to use these domains?",
    a: "You don't need to be a pioneer to inquire, but to actually resolve and use a .pi domain inside the Pi Network you'll need a Pi wallet and a verified Pi account. The onboarding is designed to be friendly for newcomers.",
  },
  {
    q: "Will you develop these domains yourself?",
    a: "Yes for several of them — kinyanjui.pi, soko.pi, pioneerhub.pi and piart.pi are in active development. For the rest, I'm open to co-founders, builders and investors who want to bring them to life.",
  },
  {
    q: "Is this site affiliated with the Pi Core Team?",
    a: "No. This is an independent pioneer-run portfolio. Pi Network and the Pi logo are properties of their respective owners; this site simply participates in and celebrates the ecosystem.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <PiGlossary />
        </div>
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 rounded-full border-pi-rose/30 bg-pi-rose/10 px-3 py-1 text-xs font-medium text-pi-rose"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Everything you might want to know about .pi domains and this
            portfolio. Need a term defined? Tap the glossary above.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-border/60"
              >
                <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
