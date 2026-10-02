"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites, type FavDomain } from "@/lib/pi-storage";
import { ACCENT_STYLES, CATEGORY_LABELS, STATUS_LABELS } from "@/lib/pi";
import { toast } from "sonner";

interface FavoritesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDomain?: (d: FavDomain) => void;
}

export function FavoritesDrawer({
  open,
  onOpenChange,
  onSelectDomain,
}: FavoritesDrawerProps) {
  const { favorites, clear } = useFavorites();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[min(100vw,440px)] max-w-full p-0 sm:max-w-[440px]">
        <SheetHeader className="border-b border-border/60 bg-gradient-to-br from-pi-rose/10 via-card to-pi-gold/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-rose to-pi-gold text-primary-foreground">
                <Heart className="h-4.5 w-4.5" />
              </span>
              <div>
                <SheetTitle className="text-base font-bold">
                  Favorite domains
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {favorites.length
                    ? `${favorites.length} saved domain${favorites.length > 1 ? "s" : ""}`
                    : "No favorites yet"}
                </SheetDescription>
              </div>
            </div>
            {favorites.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  clear();
                  toast("Favorites cleared");
                }}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4 pi-scroll">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-muted-foreground">
                <Heart className="h-7 w-7" />
              </span>
              <p className="font-medium">No favorites yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Tap the heart on any domain card to save it here for quick
                access. Your favorites persist across visits.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {favorites.map((d) => {
                const accent = ACCENT_STYLES[d.accent] ?? ACCENT_STYLES.gold;
                return (
                  <motion.div
                    key={d.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center gap-3 rounded-xl border ${accent.border} bg-card/40 p-3`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${accent.bg} ${accent.border} border`}
                    >
                      {d.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-bold tracking-tight">
                        {d.label}
                        <span className={accent.text}>.pi</span>
                      </p>
                      {d.pricePi && (
                        <p className="font-mono text-xs text-pi-gold">
                          {d.pricePi.toLocaleString()} π
                        </p>
                      )}
                    </div>
                    {onSelectDomain && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 px-2 text-xs"
                        onClick={() => {
                          onSelectDomain(d);
                          onOpenChange(false);
                        }}
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </motion.div>
                );
              })}

              <div className="mt-3 rounded-xl border border-dashed border-border/60 p-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShoppingBag className="h-3.5 w-3.5 text-pi-gold" />
                  Saved locally in your browser — no account needed.
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
