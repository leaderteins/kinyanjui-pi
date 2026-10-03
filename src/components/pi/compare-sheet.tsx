"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GitCompare,
  Check,
  Minus,
  Eye,
  Tag,
  Trash2,
  Trophy,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ACCENT_STYLES,
  CATEGORY_LABELS,
  STATUS_LABELS,
  type PiDomain,
} from "@/lib/pi";

interface CompareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domains: PiDomain[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onInquire: (domain: PiDomain) => void;
}

type RowKey =
  | "category"
  | "status"
  | "price"
  | "views"
  | "tagline"
  | "description";

interface Row {
  key: RowKey;
  label: string;
  icon: React.ElementType;
}

const ROWS: Row[] = [
  { key: "category", label: "Category", icon: Tag },
  { key: "status", label: "Status", icon: Tag },
  { key: "price", label: "Asking price", icon: Tag },
  { key: "views", label: "Views", icon: Eye },
  { key: "tagline", label: "Tagline", icon: Tag },
  { key: "description", label: "Description", icon: Tag },
];

function cell(d: PiDomain, key: RowKey): React.ReactNode {
  switch (key) {
    case "category":
      return CATEGORY_LABELS[d.category] ?? d.category;
    case "status":
      return STATUS_LABELS[d.status] ?? d.status;
    case "price":
      return d.pricePi ? `${d.pricePi.toLocaleString()} π` : "Not listed";
    case "views":
      return d.views;
    case "tagline":
      return d.tagline;
    case "description":
      return d.description;
  }
}

export function CompareSheet({
  open,
  onOpenChange,
  domains,
  onRemove,
  onClear,
  onInquire,
}: CompareSheetProps) {
  // Find the lowest-priced for-sale domain as a "best value" highlight
  const onSale = domains.filter((d) => d.pricePi && d.status === "for-sale");
  const bestValue = onSale.length
    ? onSale.reduce((min, d) =>
        (d.pricePi ?? Infinity) < (min.pricePi ?? Infinity) ? d : min
      )
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[min(100vw,1000px)] max-w-full overflow-x-hidden p-0 sm:max-w-[1000px]">
        <SheetHeader className="border-b border-border/60 bg-gradient-to-br from-pi-purple/10 via-card to-pi-gold/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
                <GitCompare className="h-4.5 w-4.5" />
              </span>
              <div>
                <SheetTitle className="text-base font-bold">
                  Domain comparison
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {domains.length
                    ? `Comparing ${domains.length} domain${domains.length > 1 ? "s" : ""} side-by-side`
                    : "Select domains to compare them side-by-side"}
                </SheetDescription>
              </div>
            </div>
            {domains.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClear}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="max-h-[70vh] overflow-auto pi-scroll p-5">
          {domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-muted-foreground">
                <GitCompare className="h-7 w-7" />
              </span>
              <p className="font-medium">No domains selected yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Use the compare checkbox on any domain card to add it here. You
                can compare up to 3 at once.
              </p>
            </div>
          ) : (
            <div>
              {/* Recommendation banner — only meaningful with 2+ for-sale domains */}
              {onSale.length >= 2 && bestValue && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-pi-gold/30 bg-gradient-to-r from-pi-gold/10 via-card to-pi-purple/10 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-pi-gold">
                      <Sparkles className="h-3 w-3" /> Our recommendation
                    </p>
                    <p className="mt-0.5 text-sm">
                      <span className="font-mono font-bold">
                        {bestValue.label}.pi
                      </span>{" "}
                      offers the best value at{" "}
                      <span className="font-mono font-semibold text-pi-gold">
                        {bestValue.pricePi?.toLocaleString()} π
                      </span>{" "}
                      — the lowest asking price among the for-sale domains
                      you&apos;re comparing.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onInquire(bestValue)}
                    className="gap-1.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
                  >
                    <TrendingDown className="h-3.5 w-3.5" />
                    Grab it
                  </Button>
                </motion.div>
              )}
              <div className="overflow-x-auto pi-scroll">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-32 shrink-0 border-b border-border/60 p-2 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Attribute
                    </th>
                    {domains.map((d) => {
                      const accent =
                        ACCENT_STYLES[d.accent] ?? ACCENT_STYLES.gold;
                      const isBest = bestValue?.id === d.id;
                      return (
                        <th
                          key={d.id}
                          className={`relative border border-border/60 p-3 text-left align-top ${accent.bg}`}
                        >
                          {isBest && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
                              Best value
                            </span>
                          )}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accent.border} ${accent.bg} text-xl`}
                              >
                                {d.emoji}
                              </span>
                              <div>
                                <p className="font-mono text-sm font-bold tracking-tight">
                                  {d.label}
                                  <span className={accent.text}>.pi</span>
                                </p>
                                {d.featured && (
                                  <Badge
                                    variant="outline"
                                    className="mt-0.5 border-pi-gold/40 bg-pi-gold/10 px-1.5 py-0 text-[9px] text-pi-gold"
                                  >
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => onRemove(d.id)}
                              aria-label={`Remove ${d.name}`}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background/60 text-muted-foreground transition-colors hover:bg-background hover:text-pi-rose"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-border/60 p-2 align-top text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </td>
                      {domains.map((d) => (
                        <td
                          key={d.id}
                          className="border border-border/60 p-3 align-top text-sm"
                        >
                          {row.key === "tagline" || row.key === "description" ? (
                            <p className="text-pretty text-muted-foreground">
                              {cell(d, row.key)}
                            </p>
                          ) : row.key === "price" ? (
                            <span className="font-mono font-semibold text-pi-gold">
                              {cell(d, row.key)}
                            </span>
                          ) : (
                            <span>{cell(d, row.key)}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-t border-border/60 p-2"></td>
                    {domains.map((d) => (
                      <td
                        key={d.id}
                        className="border border-border/60 p-3"
                      >
                        <Button
                          size="sm"
                          className="w-full gap-1.5 bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
                          onClick={() => onInquire(d)}
                        >
                          Inquire about {d.label}.pi
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
