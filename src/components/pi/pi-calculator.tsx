"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowLeftRight, TrendingUp, Wallet, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PiCalculatorProps {
  priceUsd: number;
  changePct: number;
}

const PRESETS_PI = [100, 500, 1000, 5000];
const PRESETS_USD = [10, 50, 100, 500];

function formatPi(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
function formatUsd(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function PiCalculator({ priceUsd, changePct }: PiCalculatorProps) {
  const [direction, setDirection] = React.useState<"pi-to-usd" | "usd-to-pi">(
    "pi-to-usd"
  );
  const [piAmount, setPiAmount] = React.useState<number>(100);
  const [usdAmount, setUsdAmount] = React.useState<number>(
    Number((100 * priceUsd).toFixed(2))
  );

  // keep the "other" field in sync when one changes
  function setPi(v: number) {
    setPiAmount(v);
    setUsdAmount(Number((v * priceUsd).toFixed(2)));
  }
  function setUsd(v: number) {
    setUsdAmount(v);
    setPiAmount(priceUsd > 0 ? Number((v / priceUsd).toFixed(4)) : 0);
  }
  function flip() {
    setDirection((d) => (d === "pi-to-usd" ? "usd-to-pi" : "pi-to-usd"));
  }

  const up = changePct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pi-gold/10 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
            <Calculator className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              Pi converter
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Rate disclaimer"
                      className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-pi-gold"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px] text-xs">
                    The rate shown is illustrative for demo purposes only and is
                    not financial advice. Always verify with live market data
                    before transacting.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Illustrative rate · 1 π ≈ {formatUsd(priceUsd)}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`rounded-full text-[10px] ${
            up
              ? "border-pi-teal/40 bg-pi-teal/10 text-pi-teal"
              : "border-pi-rose/40 bg-pi-rose/10 text-pi-rose"
          }`}
        >
          <TrendingUp className="h-3 w-3" />
          {up ? "+" : ""}
          {changePct.toFixed(2)}%
        </Badge>
      </div>

      <div className="relative mt-5 space-y-3">
        {/* PI field */}
        <Field
          label="Pi"
          icon={<Wallet className="h-4 w-4 text-pi-gold" />}
          value={direction === "pi-to-usd" ? piAmount : piAmount}
          editable={direction === "pi-to-usd"}
          onChange={setPi}
          suffix="π"
        />

        {/* flip */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={flip}
            aria-label="Flip conversion direction"
            className="h-8 w-8 rounded-full border-border/60 bg-card/60"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-pi-purple" />
          </Button>
        </div>

        {/* USD field */}
        <Field
          label="USD"
          icon={<span className="text-xs font-bold text-pi-teal">$</span>}
          value={usdAmount}
          editable={direction === "usd-to-pi"}
          onChange={setUsd}
          suffix="$"
          isUsd
        />
      </div>

      {/* presets */}
      <div className="relative mt-4">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          {direction === "pi-to-usd" ? "Quick π amounts" : "Quick $ amounts"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(direction === "pi-to-usd" ? PRESETS_PI : PRESETS_USD).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() =>
                direction === "pi-to-usd" ? setPi(q) : setUsd(q)
              }
              className="rounded-full border border-border/60 bg-card/40 px-2.5 py-1 font-mono text-xs font-medium text-muted-foreground transition-colors hover:border-pi-gold/40 hover:text-pi-gold"
            >
              {direction === "pi-to-usd"
                ? `${formatPi(q)} π`
                : formatUsd(q)}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  icon,
  value,
  editable,
  onChange,
  suffix,
  isUsd,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  editable: boolean;
  onChange: (v: number) => void;
  suffix: string;
  isUsd?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-card/50 p-3 transition-colors ${
        editable ? "border-pi-gold/40" : "border-border/60 opacity-80"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-background/60">
            {icon}
          </span>
          {label}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {suffix}
        </span>
      </div>
      {editable ? (
        <Input
          type="number"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="mt-1.5 h-9 border-0 bg-transparent px-0 pb-0 font-mono text-2xl font-bold tracking-tight shadow-none focus-visible:ring-0"
        />
      ) : (
        <p className="mt-1.5 font-mono text-2xl font-bold tracking-tight">
          {isUsd ? formatUsd(value) : formatPi(value)}
        </p>
      )}
    </div>
  );
}
