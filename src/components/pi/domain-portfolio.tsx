"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Eye,
  Tag,
  ArrowUpRight,
  Sparkles,
  Filter,
  ChevronRight,
  HandCoins,
  GitCompare,
  Check,
  X,
  Heart,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ACCENT_STYLES,
  CATEGORY_LABELS,
  STATUS_LABELS,
  type PiDomain,
} from "@/lib/pi";
import {
  useFavorites,
  useRecentlyViewed,
  type FavDomain,
} from "@/lib/pi-storage";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { MakeOfferModal } from "./make-offer-modal";
import { CompareSheet } from "./compare-sheet";
import { FavoritesDrawer } from "./favorites-drawer";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "personal", label: "Personal" },
  { value: "marketplace", label: "Marketplace" },
  { value: "community", label: "Community" },
  { value: "defi", label: "DeFi" },
  { value: "nft", label: "NFT" },
  { value: "utility", label: "Utility" },
];

const COMPARE_LIMIT = 3;

export function DomainPortfolio() {
  const [domains, setDomains] = React.useState<PiDomain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<PiDomain | null>(null);
  const [compareIds, setCompareIds] = React.useState<string[]>([]);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [favOpen, setFavOpen] = React.useState(false);
  const { favorites, isFav, toggle: toggleFav, count: favCount } = useFavorites();
  const { recent, track: trackRecent } = useRecentlyViewed();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/domains?category=${active === "all" ? "all" : active}`
      );
      const data = (await res.json()) as { domains: PiDomain[] };
      setDomains(data.domains ?? []);
    } catch {
      toast.error("Could not load the domain portfolio.");
    } finally {
      setLoading(false);
    }
  }, [active]);

  React.useEffect(() => {
    load();
  }, [load]);

  function toFav(d: PiDomain): FavDomain {
    return {
      id: d.id,
      name: d.name,
      label: d.label,
      emoji: d.emoji,
      accent: d.accent,
      pricePi: d.pricePi,
    };
  }

  async function openDomain(d: PiDomain) {
    setSelected(d);
    trackRecent(toFav(d));
    try {
      await fetch("/api/domains/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: d.name }),
      });
    } catch {
      /* no-op */
    }
  }

  function openFav(d: FavDomain) {
    // find the full domain from the loaded list, or open a minimal card
    const full = domains.find((x) => x.id === d.id) ?? null;
    if (full) {
      openDomain(full);
    } else {
      // domain not in the current filter — just track + scroll to portfolio
      trackRecent(d);
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
      toast(`Looking for ${d.name}`, {
        description: "Switch the category filter to find it.",
      });
    }
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_LIMIT) {
        toast.error(`You can compare up to ${COMPARE_LIMIT} domains at once.`);
        return prev;
      }
      return [...prev, id];
    });
  }

  const compareDomains = domains.filter((d) => compareIds.includes(d.id));

  function inquireFromCompare(d: PiDomain) {
    setCompareOpen(false);
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      toast(`Inquiring about ${d.name}`, {
        description: "Scroll the contact form into view.",
      });
    }, 150);
  }

  return (
    <section id="portfolio" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionNumber n="01" />
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-pi-purple/30 bg-pi-purple/10 px-3 py-1 text-xs font-medium text-pi-purple"
            >
              <Tag className="h-3.5 w-3.5" />
              The Portfolio
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Premium <span className="text-gradient-purple">.pi domains</span>{" "}
              building the ecosystem
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Each name is hand-picked for a purpose — a marketplace, a wallet,
              a community hub. Some are being developed, others are open to
              partnership or acquisition.
            </p>
          </div>

          {/* Filters + favorites */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pi-scroll">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActive(c.value)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active === c.value
                      ? "border-pi-gold/50 bg-pi-gold/15 text-pi-gold"
                      : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {favCount > 0 && (
              <button
                onClick={() => setFavOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-pi-rose/40 bg-pi-rose/10 px-3 py-1.5 text-xs font-medium text-pi-rose transition-colors hover:bg-pi-rose/20"
              >
                <Heart className="h-3.5 w-3.5" />
                {favCount}
              </button>
            )}
          </div>
        </div>

        {/* Recently viewed strip */}
        {recent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 overflow-x-auto rounded-2xl border border-border/60 bg-card/30 p-3 pi-scroll"
          >
            <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-pi-gold" />
              Recently viewed
            </span>
            <div className="flex gap-2">
              {recent.map((d) => {
                const accent = ACCENT_STYLES[d.accent] ?? ACCENT_STYLES.gold;
                return (
                  <button
                    key={d.id}
                    onClick={() => openFav(d)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs transition-colors hover:border-pi-gold/40 hover:text-pi-gold"
                  >
                    <span className="text-sm">{d.emoji}</span>
                    <span className="font-mono font-medium">{d.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))
            : domains.map((d, i) => (
                <DomainCard
                  key={d.id}
                  domain={d}
                  index={i}
                  checked={compareIds.includes(d.id)}
                  onToggleCompare={() => toggleCompare(d.id)}
                  fav={isFav(d.id)}
                  onToggleFav={() => toggleFav(toFav(d))}
                  onOpen={() => openDomain(d)}
                />
              ))}
        </div>

        {!loading && domains.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-12 text-center">
            <p className="text-muted-foreground">
              No domains in this category yet — check back soon.
            </p>
          </div>
        )}
      </div>

      <DomainDialog
        domain={selected}
        onClose={() => setSelected(null)}
      />

      {/* Compare bar + sheet */}
      <CompareBar
        count={compareDomains.length}
        onOpen={() => setCompareOpen(true)}
        onClear={() => setCompareIds([])}
      />
      <CompareSheet
        open={compareOpen}
        onOpenChange={setCompareOpen}
        domains={compareDomains}
        onRemove={(id) =>
          setCompareIds((prev) => prev.filter((x) => x !== id))
        }
        onClear={() => setCompareIds([])}
        onInquire={inquireFromCompare}
      />

      <FavoritesDrawer
        open={favOpen}
        onOpenChange={setFavOpen}
        onSelectDomain={openFav}
      />
    </section>
  );
}

function CompareBar({
  count,
  onOpen,
  onClear,
}: {
  count: number;
  onOpen: () => void;
  onClear: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:pb-0 sm:px-0"
        >
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pi-gold to-pi-purple text-primary-foreground">
                <GitCompare className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {count} domain{count > 1 ? "s" : ""} ready to compare
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {count < COMPARE_LIMIT
                    ? `Add ${COMPARE_LIMIT - count} more (max ${COMPARE_LIMIT})`
                    : "That's the max — open the comparison"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onClear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={onOpen}
                className="gap-1.5 rounded-full bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
              >
                <GitCompare className="h-3.5 w-3.5" />
                Compare
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
      <span className="text-gradient-gold">{n}</span>
      <span className="h-px w-8 bg-gradient-to-r from-pi-gold/60 to-transparent" />
      Section
    </span>
  );
}

function DomainCard({
  domain,
  index,
  checked,
  onToggleCompare,
  fav,
  onToggleFav,
  onOpen,
}: {
  domain: PiDomain;
  index: number;
  checked: boolean;
  onToggleCompare: () => void;
  fav: boolean;
  onToggleFav: () => void;
  onOpen: () => void;
}) {
  const accent = ACCENT_STYLES[domain.accent] ?? ACCENT_STYLES.gold;
  const statusLabel = STATUS_LABELS[domain.status] ?? domain.status;
  const catLabel = CATEGORY_LABELS[domain.category] ?? domain.category;

  // 3D tilt + cursor-follow glow
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), {
    stiffness: 150,
    damping: 18,
  });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${accent.border} ${checked ? "ring-2 ring-pi-gold/50" : ""} bg-card/60 p-5 text-left backdrop-blur-sm transition-shadow hover:shadow-xl`}
    >
      {/* cursor-follow glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(180px circle at ${gx} ${gy}, color-mix(in oklab, var(--pi-gold) 22%, transparent), transparent 60%)`
          ),
        }}
      />
      {/* accent wash */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${accent.bg} ${accent.border} border`}
        >
          {domain.emoji}
        </span>
        <div className="relative z-20 flex items-center gap-1.5">
          {/* Favorite toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
            aria-pressed={fav}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
              fav
                ? "border-pi-rose/50 bg-pi-rose/15 text-pi-rose"
                : "border-border/60 bg-card/40 text-muted-foreground hover:border-pi-rose/40 hover:text-pi-rose"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${fav ? "fill-pi-rose" : ""}`} />
          </button>
          {/* Compare toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            aria-pressed={checked}
            aria-label={checked ? "Remove from compare" : "Add to compare"}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
              checked
                ? "border-pi-gold/50 bg-pi-gold/15 text-pi-gold"
                : "border-border/60 bg-card/40 text-muted-foreground hover:border-pi-gold/40 hover:text-pi-gold"
            }`}
          >
            {checked ? (
              <Check className="h-2.5 w-2.5" />
            ) : (
              <GitCompare className="h-2.5 w-2.5" />
            )}
            {checked ? "Added" : "Compare"}
          </button>
        </div>
      </div>

      {/* Status + featured badges row */}
      <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
        <Badge
          variant="outline"
          className={`rounded-full border ${accent.border} ${accent.bg} ${accent.text} text-[10px] font-medium`}
        >
          {statusLabel}
        </Badge>
        {domain.featured && (
          <Badge
            variant="outline"
            className="gap-1 rounded-full border-pi-gold/40 bg-pi-gold/10 text-[10px] text-pi-gold"
          >
            <Sparkles className="h-2.5 w-2.5" /> Featured
          </Badge>
        )}
        {fav && (
          <Badge
            variant="outline"
            className="gap-1 rounded-full border-pi-rose/40 bg-pi-rose/10 text-[10px] text-pi-rose"
          >
            <Heart className="h-2.5 w-2.5 fill-pi-rose" /> Saved
          </Badge>
        )}
      </div>

      {/* Clickable overlay opens details */}
      <button
        onClick={onOpen}
        aria-label={`View details for ${domain.name}`}
        className="absolute inset-0 z-10 cursor-pointer"
        tabIndex={-1}
      />

      <div className="relative mt-4">
        <h3 className="font-mono text-lg font-bold tracking-tight">
          {domain.label}
          <span className={accent.text}>.pi</span>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {domain.tagline}
        </p>
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${accent.text.replace("text-", "bg-")}`} />
          {catLabel}
        </span>
        {domain.pricePi ? (
          <span className="font-mono font-semibold text-foreground">
            {domain.pricePi.toLocaleString()} π
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" /> {domain.views} views
          </span>
        )}
      </div>

      <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors group-hover:text-foreground">
        View details <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </motion.div>
  );
}

function DomainDialog({
  domain,
  onClose,
}: {
  domain: PiDomain | null;
  onClose: () => void;
}) {
  const { toast: legacyToast } = useToast();
  const [offerOpen, setOfferOpen] = React.useState(false);
  const accent = domain
    ? ACCENT_STYLES[domain.accent] ?? ACCENT_STYLES.gold
    : ACCENT_STYLES.gold;

  // The domain reference held for the offer modal — keep it even after the
  // detail dialog closes so the offer success screen can finish animating.
  const [offerDomain, setOfferDomain] = React.useState<PiDomain | null>(null);

  React.useEffect(() => {
    if (domain) setOfferDomain(domain);
  }, [domain]);

  return (
    <>
    <Dialog open={!!domain} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        {domain && (
          <>
            <div
              className={`relative border-b border-border/60 bg-gradient-to-br ${accent.from} ${accent.to} p-6`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} text-3xl`}
                >
                  {domain.emoji}
                </span>
                <div className="min-w-0">
                  <DialogHeader className="space-y-0 p-0">
                    <DialogTitle className="font-mono text-xl font-bold tracking-tight">
                      {domain.label}
                      <span className={accent.text}>.pi</span>
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-foreground/70">
                      {domain.tagline}
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`rounded-full border ${accent.border} ${accent.bg} ${accent.text}`}
                >
                  {STATUS_LABELS[domain.status] ?? domain.status}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {CATEGORY_LABELS[domain.category] ?? domain.category}
                </Badge>
                {domain.pricePi && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-pi-gold/40 bg-pi-gold/10 text-pi-gold"
                  >
                    {domain.pricePi.toLocaleString()} π asking
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4 p-6">
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {domain.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {STATUS_LABELS[domain.status] ?? domain.status}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="font-mono font-medium">{domain.views}</p>
                </div>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
                <Button
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => {
                    navigator.clipboard?.writeText(domain.name);
                    toast.success(`Copied ${domain.name}`);
                  }}
                >
                  Copy name
                </Button>
                <Button
                  variant="outline"
                  className="sm:flex-1 gap-1.5"
                  onClick={() => {
                    legacyToast({
                      title: "Inquiry started",
                      description: `Scroll to the contact form to send your message about ${domain.name}.`,
                    });
                    onClose();
                    setTimeout(() => {
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 200);
                  }}
                >
                  Inquire
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  className="sm:flex-1 gap-1.5 bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground shadow-lg shadow-pi-gold/20"
                  onClick={() => setOfferOpen(true)}
                >
                  <HandCoins className="h-4 w-4" />
                  Make an offer
                </Button>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

    <MakeOfferModal
      domain={offerDomain}
      open={offerOpen}
      onOpenChange={(o) => {
        setOfferOpen(o);
        if (!o) {
          // close the detail dialog too after a successful offer
          setTimeout(() => {
            if (offerDomain) onClose();
          }, 250);
        }
      }}
    />
    </>
  );
}
