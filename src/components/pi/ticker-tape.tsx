"use client";

const ITEMS = [
  "kinyanjui.pi",
  "soko.pi",
  "pioneerhub.pi",
  "piwallet.pi",
  "mali.pi",
  "piart.pi",
  "kilimo.pi",
  "piswap.pi",
  "★ Pi Mainnet",
  "π On-chain domains",
  "✦ East-Africa pioneer",
  "⛓ Pi blockchain",
];

export function TickerTape() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-gradient-to-r from-pi-purple/10 via-pi-gold/10 to-pi-purple/10 py-2.5">
      <div className="flex w-max animate-pi-marquee gap-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 font-mono text-xs font-medium text-muted-foreground"
          >
            <span className="text-pi-gold">◆</span>
            {item}
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
