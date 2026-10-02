"use client";

import Link from "next/link";
import { Github, Twitter, Send, Heart } from "lucide-react";
import { PiLogo } from "./pi-logo";

const FOOTER_LINKS = [
  {
    title: "Portfolio",
    links: [
      { label: "kinyanjui.pi", href: "#portfolio" },
      { label: "soko.pi", href: "#portfolio" },
      { label: "pioneerhub.pi", href: "#portfolio" },
      { label: "piart.pi", href: "#portfolio" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "About Pi Network", href: "#about" },
      { label: "Use cases", href: "#services" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Newsletter", href: "#contact" },
      { label: "Make an offer", href: "#contact" },
      { label: "Partner with us", href: "#contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="#top" className="flex items-center gap-2.5">
              <PiLogo size={36} withOrbit />
              <div className="flex flex-col leading-none">
                <span className="font-mono text-sm font-bold tracking-tight">
                  kinyanjui<span className="text-pi-gold">.pi</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Pi Network Domains
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              An independent pioneer-run portfolio of .pi domains building the
              future of the Pi Network ecosystem.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialIcon icon={Twitter} label="Twitter / X" />
              <SocialIcon icon={Send} label="Telegram" />
              <SocialIcon icon={Github} label="GitHub" />
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-pi-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} kinyanjui.pi — built by a Pi pioneer.
            Not affiliated with the Pi Core Team.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Crafted with <Heart className="h-3.5 w-3.5 text-pi-rose" /> on the Pi
            blockchain
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <a
      href="#contact"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-pi-gold/40 hover:text-pi-gold"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
