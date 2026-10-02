"use client";

import * as React from "react";
import { BookOpen, HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface GlossaryTerm {
  term: string;
  short: string;
  body: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Pi Network",
    short: "A mobile-mined cryptocurrency",
    body: "A digital currency project launched in 2019 by Stanford graduates, designed so anyone with a phone can mine Pi daily with a tap — no expensive hardware required.",
  },
  {
    term: ".pi domain",
    short: "On-chain identity on Pi",
    body: "A human-readable name (like kinyanjui.pi) that resolves on the Pi blockchain. It can point to a wallet address, a website, or an app — replacing long alphanumeric addresses.",
  },
  {
    term: "Pioneer",
    short: "A Pi Network user",
    body: "Anyone who mines or holds Pi. Pioneers form security circles, build on the network, and help secure transactions through their trusted connections.",
  },
  {
    term: "Security circle",
    short: "Pi's trust graph",
    body: "A group of 3–5 pioneers you trust. Together, your circles form a graph of trust that secures the network without centralized gatekeepers. The more trusted your circle, the more weight your contributions carry.",
  },
  {
    term: "Mainnet",
    short: "The live blockchain",
    body: "The production Pi blockchain where coins are fully transferable. 'Graduation' to open Mainnet is when Pi becomes exchangeable with other currencies and the broader economy.",
  },
  {
    term: "Node",
    short: "A network validator",
    body: "A computer running Pi's node software that validates transactions and helps maintain the blockchain. Nodes are run by pioneers who commit reliable hardware and uptime.",
  },
  {
    term: "Pi wallet",
    short: "Where you hold Pi",
    body: "A software wallet that stores your Pi and lets you send/receive. Wallet addresses are long strings — which is exactly the problem .pi domains solve.",
  },
  {
    term: "Escrow",
    short: "Held-in-the-middle funds",
    body: "A third-party-held state where Pi is locked until both buyer and seller confirm a transaction. soko.pi plans escrow so marketplace trades are safe for both sides.",
  },
];

export function PiGlossary() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const filtered = GLOSSARY.filter((g) =>
    g.term.toLowerCase().includes(query.toLowerCase().trim()) ||
    g.short.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Open Pi glossary"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-pi-gold/40 hover:text-pi-gold"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Glossary
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(92vw,360px)] p-0"
      >
        <div className="border-b border-border/60 p-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-pi-gold" />
            <span className="text-sm font-semibold">Pi glossary</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="mt-2 h-8 w-full rounded-md border border-border/60 bg-background/60 px-2.5 text-xs outline-none focus:border-pi-gold/40"
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-2 pi-scroll">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              No terms match &quot;{query}&quot;.
            </p>
          ) : (
            filtered.map((g) => (
              <div
                key={g.term}
                className="rounded-lg px-2.5 py-2 transition-colors hover:bg-accent/50"
              >
                <p className="font-mono text-xs font-semibold text-pi-gold">
                  {g.term}
                </p>
                <p className="text-[11px] font-medium text-foreground/80">
                  {g.short}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {g.body}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Inline glossary trigger — wrap any term in <GlossaryTrigger term="Node" /> */
export function GlossaryTrigger({
  term,
  children,
}: {
  term: string;
  children?: React.ReactNode;
}) {
  const entry = GLOSSARY.find(
    (g) => g.term.toLowerCase() === term.toLowerCase()
  );
  if (!entry) return <span>{children ?? term}</span>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="cursor-help border-b border-dashed border-pi-gold/40 font-medium text-pi-gold decoration-dotted underline-offset-2 hover:border-pi-gold hover:text-pi-gold"
          aria-label={`Define ${term}`}
        >
          {children ?? term}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={6}
        className="w-[min(85vw,300px)] p-0"
      >
        <div className="p-3">
          <p className="font-mono text-xs font-bold text-pi-gold">
            {entry.term}
          </p>
          <p className="text-[11px] font-medium text-foreground/80">
            {entry.short}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {entry.body}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
