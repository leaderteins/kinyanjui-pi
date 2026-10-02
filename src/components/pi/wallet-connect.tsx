"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Loader2,
  Check,
  Copy,
  LogOut,
  ChevronDown,
  Zap,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface WalletState {
  address: string;
  piBalance: number;
  handle: string;
  connectedAt: number;
}

const STORAGE_KEY = "kinyanjui-pi-wallet";

// A few mock Pi wallets to "connect" with
const MOCK_WALLETS: WalletState[] = [
  {
    address: "GBCF7K2Q3N9X4R1Y8M5T6V7W8Z9A0B1C2D3E4F5G6H7",
    piBalance: 1247.83,
    handle: "kinyanjui.pi",
    connectedAt: 0,
  },
  {
    address: "PDTX4M8N2K7R1Q9Y5B3C6D0E2F4G7H9J1K3L5M8N0P2",
    piBalance: 384.5,
    handle: "pioneer.pi",
    connectedAt: 0,
  },
  {
    address: "LKM9R2T5W8Y1Q4N7Z0C3B6D9E2F5G8H4J7K1M3N6P9",
    piBalance: 89.12,
    handle: "newcomer.pi",
    connectedAt: 0,
  },
];

function shortAddr(a: string): string {
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

export function WalletConnect() {
  const [wallet, setWallet] = React.useState<WalletState | null>(null);
  const [open, setOpen] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWallet(JSON.parse(raw) as WalletState);
    } catch {
      /* ignore */
    }
  }, []);

  function persist(w: WalletState | null) {
    setWallet(w);
    try {
      if (w) localStorage.setItem(STORAGE_KEY, JSON.stringify(w));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function connect(choice: number) {
    setConnecting(true);
    // Simulate a connection handshake
    await new Promise((r) => setTimeout(r, 1100));
    const w = { ...MOCK_WALLETS[choice], connectedAt: Date.now() };
    persist(w);
    setConnecting(false);
    setOpen(false);
    toast.success(`Connected as ${w.handle}`, {
      description: `Balance: ${w.piBalance.toLocaleString()} π`,
    });
  }

  function disconnect() {
    persist(null);
    setMenuOpen(false);
    toast("Wallet disconnected");
  }

  // Avoid hydration mismatch — render a stable placeholder until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="hidden h-9 gap-1.5 rounded-full border border-border/60 px-3 text-xs lg:inline-flex"
      >
        <Wallet className="h-3.5 w-3.5" />
        Connect
      </Button>
    );
  }

  if (!wallet) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="hidden h-9 gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 text-xs transition-colors hover:border-pi-gold/40 hover:text-pi-gold lg:inline-flex"
        >
          <Wallet className="h-3.5 w-3.5" />
          Connect wallet
        </Button>
        <WalletDialog
          open={open}
          onOpenChange={setOpen}
          connecting={connecting}
          onConnect={connect}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative hidden lg:block">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 items-center gap-2 rounded-full border border-pi-gold/30 bg-pi-gold/10 px-3 text-xs font-medium text-pi-gold transition-colors hover:border-pi-gold/50"
          aria-label="Wallet menu"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pi-teal/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pi-teal" />
          </span>
          <span className="font-mono">{shortAddr(wallet.address)}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-2xl backdrop-blur-xl"
              >
                <div className="border-b border-border/60 bg-gradient-to-br from-pi-gold/10 to-pi-purple/10 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
                      <Wallet className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-semibold">
                        {wallet.handle}
                      </p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        {wallet.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Pi balance
                    </p>
                    <p className="mt-0.5 font-mono text-xl font-bold text-pi-gold">
                      {wallet.piBalance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      π
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      ≈ $
                      {(wallet.piBalance * 47.2).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(wallet.address);
                        toast.success("Address copied");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy address
                    </button>
                    <a
                      href="#portfolio"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Browse domains
                    </a>
                    <button
                      onClick={disconnect}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-pi-rose transition-colors hover:bg-pi-rose/10"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Disconnect
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function WalletDialog({
  open,
  onOpenChange,
  connecting,
  onConnect,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  connecting: boolean;
  onConnect: (i: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative border-b border-border/60 bg-gradient-to-br from-pi-gold/15 via-card to-pi-purple/15 p-6">
          <DialogHeader className="space-y-0 p-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
                <Wallet className="h-5 w-5" />
              </span>
              <Badge
                variant="outline"
                className="gap-1 rounded-full border-pi-teal/40 bg-pi-teal/10 text-[10px] text-pi-teal"
              >
                <ShieldCheck className="h-3 w-3" /> Demo mode
              </Badge>
            </div>
            <DialogTitle className="text-lg font-bold">
              Connect a Pi wallet
            </DialogTitle>
            <DialogDescription className="mt-1">
              Pick a mock wallet to explore the connected experience. No real
              credentials are used — this is a demonstration only.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-2 p-5">
          {MOCK_WALLETS.map((w, i) => (
            <button
              key={w.address}
              disabled={connecting}
              onClick={() => onConnect(i)}
              className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 text-left transition-all hover:border-pi-gold/40 hover:bg-pi-gold/5 disabled:opacity-60"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold/30 to-pi-purple/30 text-lg">
                {connecting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pi-gold" />
                ) : (
                  <Wallet className="h-5 w-5 text-pi-gold" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold">{w.handle}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {shortAddr(w.address)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-pi-gold">
                  {w.piBalance.toLocaleString()} π
                </p>
                <p className="flex items-center justify-end gap-0.5 text-[10px] text-muted-foreground">
                  <Zap className="h-2.5 w-2.5 text-pi-gold" />
                  pioneer
                </p>
              </div>
              <Check className="h-4 w-4 text-pi-gold opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <div className="border-t border-border/60 bg-card/30 px-5 py-3">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-pi-teal" />
            Mock connection — no real wallet or funds are involved.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
