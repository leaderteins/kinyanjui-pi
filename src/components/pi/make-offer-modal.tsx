"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ACCENT_STYLES, STATUS_LABELS, type PiDomain } from "@/lib/pi";
import { useWalletState } from "@/lib/wallet-state";

interface MakeOfferModalProps {
  domain: PiDomain | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];
const STEP = 250;

function formatPi(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " π";
}

export function MakeOfferModal({ domain, open, onOpenChange }: MakeOfferModalProps) {
  const accent = domain
    ? ACCENT_STYLES[domain.accent] ?? ACCENT_STYLES.gold
    : ACCENT_STYLES.gold;

  const { wallet } = useWalletState();

  const asking = domain?.pricePi ?? 1000;
  const [amount, setAmount] = React.useState<number>(asking);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (open && domain) {
      setAmount(domain.pricePi ?? 1000);
      setDone(false);
    }
  }, [open, domain, asking]);

  const diff = amount - asking;
  const insufficientFunds = wallet ? amount > wallet.piBalance : false;
  const diffPct = asking ? (diff / asking) * 100 : 0;

  function adjust(delta: number) {
    setAmount((a) => Math.max(0, Math.round((a + delta) / STEP) * STEP));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain) return;
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Please tell us your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("A valid email is required so we can reply.");
      return;
    }
    if (amount < 50) {
      toast.error("Minimum offer is 50 π.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          domain: domain.name,
          intent: "purchase",
          budget: `${formatPi(amount)}`,
          message:
            message.trim() ||
            `Offering ${formatPi(amount)} for ${domain.name}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not submit your offer.");
        return;
      }
      setDone(true);
      toast.success("Offer submitted! I'll reply from kinyanjui.pi.");
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {domain && !done && (
          <>
            <div
              className={`relative border-b border-border/60 bg-gradient-to-br ${accent.from} ${accent.to} p-5`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} text-2xl`}
                >
                  {domain.emoji}
                </span>
                <DialogHeader className="space-y-0 p-0">
                  <DialogTitle className="font-mono text-lg font-bold tracking-tight">
                    Make an offer
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 text-foreground/70">
                    for <span className="font-mono font-semibold">{domain.label}<span className={accent.text}>.pi</span></span>
                  </DialogDescription>
                </DialogHeader>
              </div>
              {domain.pricePi && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <Badge
                    variant="outline"
                    className={`rounded-full border ${accent.border} ${accent.bg} ${accent.text}`}
                  >
                    Asking {formatPi(domain.pricePi)}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {STATUS_LABELS[domain.status] ?? domain.status}
                  </Badge>
                </div>
              )}
            </div>

            <form onSubmit={submit} className="space-y-4 p-5">
              {/* Pi amount stepper */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Your offer (in π)
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl"
                    onClick={() => adjust(-STEP)}
                    aria-label="Decrease offer"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      value={amount}
                      min={0}
                      onChange={(e) =>
                        setAmount(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="h-11 rounded-xl text-center font-mono text-lg font-bold"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-pi-gold">
                      π
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl"
                    onClick={() => adjust(STEP)}
                    aria-label="Increase offer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* quick amounts */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`rounded-full border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                        amount === q
                          ? "border-pi-gold/50 bg-pi-gold/15 text-pi-gold"
                          : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {formatPi(q)}
                    </button>
                  ))}
                </div>

                {/* vs asking comparison */}
                {domain.pricePi && (
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs">
                    <span className="text-muted-foreground">vs asking</span>
                    <span
                      className={`font-mono font-semibold ${
                        diff >= 0 ? "text-pi-teal" : "text-pi-rose"
                      }`}
                    >
                      {diff >= 0 ? "+" : ""}
                      {formatPi(diff).replace(" π", "")} π ({diff >= 0 ? "+" : ""}
                      {diffPct.toFixed(1)}%)
                    </span>
                  </div>
                )}

                {/* wallet balance check */}
                {wallet && (
                  <div
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${
                      insufficientFunds
                        ? "border-pi-rose/40 bg-pi-rose/10"
                        : "border-pi-teal/40 bg-pi-teal/10"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Wallet className="h-3.5 w-3.5" />
                      {wallet.handle}
                    </span>
                    <span
                      className={`font-mono font-semibold ${
                        insufficientFunds ? "text-pi-rose" : "text-pi-teal"
                      }`}
                    >
                      {wallet.piBalance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      π
                    </span>
                  </div>
                )}
                {wallet && insufficientFunds && (
                  <p className="flex items-center gap-1.5 rounded-lg border border-pi-rose/40 bg-pi-rose/10 px-3 py-2 text-[11px] text-pi-rose">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Your offer exceeds your connected balance by{" "}
                    {(amount - wallet.piBalance).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    π. You can still submit — settlement can be arranged.
                  </p>
                )}
                {wallet && !insufficientFunds && (
                  <p className="text-[11px] text-muted-foreground">
                    ✓ You have enough balance to cover this offer.
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Your name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Pioneer"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Message (optional)
                  </Label>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A short note about your plans…"
                    className="h-10"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 gap-2 rounded-xl bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground shadow-lg shadow-pi-gold/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Submit offer of {formatPi(amount)}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {domain && done && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-pi-teal/15 text-pi-teal"
            >
              <CheckCircle2 className="h-9 w-9" />
            </motion.div>
            <DialogTitle className="mt-4 text-xl font-bold">
              Offer submitted!
            </DialogTitle>
            <DialogDescription className="mt-1 text-center">
              Your offer of <span className="font-mono font-semibold">{formatPi(amount)}</span>{" "}
              for <span className="font-mono font-semibold">{domain.name}</span> is in.
              I&apos;ll reply from kinyanjui.pi within 48 hours.
            </DialogDescription>
            <Button
              className="mt-5 gap-2 bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
              onClick={() => onOpenChange(false)}
            >
              <Wallet className="h-4 w-4" />
              Done
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
