"use client";

import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Search,
  Home,
  Newspaper,
  Tag,
  Calculator,
  Mail,
  HelpCircle,
  Sparkles,
  Moon,
  Sun,
  ArrowUp,
  DollarSign,
  ShoppingCart,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { useTheme } from "next-themes";

const SECTIONS = [
  { id: "top", label: "Top", icon: Home, hint: "Home" },
  { id: "claim", label: "Claim Tracker", icon: ShieldCheck, hint: "Secure your domains" },
  { id: "connect-guide", label: "Connection Guide", icon: Rocket, hint: "Point kinyanjui.pi here" },
  { id: "portfolio", label: "Domains", icon: Tag, hint: "Portfolio" },
  { id: "market", label: "Market", icon: DollarSign, hint: "Chart" },
  { id: "calculator", label: "Pi Converter", icon: Calculator, hint: "Calc" },
  { id: "about", label: "About Pi", icon: Sparkles, hint: "About" },
  { id: "services", label: "Use Cases", icon: ShoppingCart, hint: "Services" },
  { id: "ecosystem", label: "Ecosystem Map", icon: Sparkles, hint: "Map" },
  { id: "pioneers", label: "Pioneers", icon: Sparkles, hint: "Voices" },
  { id: "blog", label: "News", icon: Newspaper, hint: "Dispatch" },
  { id: "roadmap", label: "Roadmap", icon: Sparkles, hint: "Timeline" },
  { id: "pulse", label: "Pulse", icon: Search, hint: "Activity" },
  { id: "recommend", label: "Recommendations", icon: Sparkles, hint: "Picks" },
  { id: "faq", label: "FAQ", icon: HelpCircle, hint: "Help" },
  { id: "contact", label: "Contact", icon: Mail, hint: "Get in touch" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Cmd/Ctrl + K → open palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // Escape → close palette
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      // "/" → focus domain lookup (if not typing)
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          'input[aria-label="Check a .pi domain name"]'
        );
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          scrollTo("top");
        }
        return;
      }
      // "t" → back to top
      if (e.key.toLowerCase() === "t" && !typing && !open) {
        e.preventDefault();
        scrollTo("top");
      }
      // "c" → contact
      if (e.key.toLowerCase() === "c" && !typing && !open) {
        e.preventDefault();
        scrollTo("contact");
      }
      // "d" → domains
      if (e.key.toLowerCase() === "d" && !typing && !open) {
        e.preventDefault();
        scrollTo("portfolio");
      }
      // "n" → news
      if (e.key.toLowerCase() === "n" && !typing && !open) {
        e.preventDefault();
        scrollTo("blog");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function go(id: string) {
    setOpen(false);
    setTimeout(() => scrollTo(id), 80);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="kinyanjui.pi command palette"
      description="Jump to a section, flip the theme, or check a domain."
      className="max-w-xl"
    >
      <Command>
        <CommandInput placeholder="Search sections & actions…" />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {SECTIONS.map((s) => (
              <CommandItem
                key={s.id}
                value={`${s.label} ${s.hint} ${s.id}`}
                onSelect={() => go(s.id)}
                className="gap-2.5"
              >
                <s.icon className="h-4 w-4 text-pi-gold" />
                <span className="flex-1">{s.label}</span>
                <CommandShortcut className="font-mono text-[10px]">
                  #{s.id}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              value="toggle theme dark light"
              onSelect={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
              className="gap-2.5"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-pi-gold" />
              ) : (
                <Moon className="h-4 w-4 text-pi-purple" />
              )}
              <span className="flex-1">Toggle theme</span>
              <CommandShortcut className="font-mono text-[10px]">
                click
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              value="focus domain lookup search check"
              onSelect={() => {
                setOpen(false);
                setTimeout(() => {
                  const input =
                    document.querySelector<HTMLInputElement>(
                      'input[aria-label="Check a .pi domain name"]'
                    );
                  input?.focus();
                  input?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }, 80);
              }}
              className="gap-2.5"
            >
              <Search className="h-4 w-4 text-pi-teal" />
              <span className="flex-1">Check a .pi domain</span>
              <CommandShortcut className="font-mono text-[10px]">/</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="back to top scroll up"
              onSelect={() => go("top")}
              className="gap-2.5"
            >
              <ArrowUp className="h-4 w-4 text-pi-rose" />
              <span className="flex-1">Back to top</span>
              <CommandShortcut className="font-mono text-[10px]">t</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Shortcuts">
            <div className="grid grid-cols-2 gap-1.5 px-2 py-1.5 text-[11px] text-muted-foreground">
              <Shortcut keys="⌘K" label="Open palette" />
              <Shortcut keys="/" label="Domain lookup" />
              <Shortcut keys="t" label="Back to top" />
              <Shortcut keys="d" label="Domains" />
              <Shortcut keys="n" label="News" />
              <Shortcut keys="c" label="Contact" />
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1">
      <kbd className="rounded border border-border/60 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground">
        {keys}
      </kbd>
      <span>{label}</span>
    </div>
  );
}
