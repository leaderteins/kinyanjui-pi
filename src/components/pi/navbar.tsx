"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PiLogo } from "./pi-logo";
import { NAV_LINKS } from "@/lib/pi";

const SECTION_IDS = ["top", "portfolio", "about", "services", "roadmap", "faq", "contact"];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("top");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy: highlight the nav link of the section in view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function triggerPalette() {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="#top" className="group flex items-center gap-2.5">
          <PiLogo size={34} withOrbit />
          <div className="flex flex-col leading-none">
            <span className="font-mono text-sm font-bold tracking-tight">
              kinyanjui<span className="text-pi-gold">.pi</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Pi Network Domains
            </span>
          </div>
        </Link>

        {/* Desktop nav with scroll-spy active state */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((l) => {
            const id = l.href.replace("#", "");
            const isActive = active === id;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerPalette}
            aria-label="Open command palette"
            className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-pi-gold/40 hover:text-foreground lg:inline-flex"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="font-mono">⌘K</span>
          </button>
          <Link href="#portfolio" className="hidden sm:inline-flex">
            <Button
              size="sm"
              className="gap-1.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground shadow-lg shadow-pi-gold/20 hover:opacity-90"
            >
              Explore Domains
            </Button>
          </Link>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  triggerPalette();
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Command className="h-4 w-4" /> Command palette
                <span className="ml-auto font-mono text-[10px]">⌘K</span>
              </button>
              <Link
                href="#portfolio"
                onClick={() => setOpen(false)}
                className="mt-2"
              >
                <Button className="w-full gap-1.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground">
                  Explore Domains
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
