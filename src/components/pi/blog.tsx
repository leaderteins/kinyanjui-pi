"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Clock,
  ArrowUpRight,
  Calendar,
  X,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  emoji: string;
  accent: string;
  readingMins: number;
  createdAt: string;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "update", label: "Updates" },
  { value: "guide", label: "Guides" },
  { value: "spotlight", label: "Spotlights" },
  { value: "market", label: "Market" },
];

const CATEGORY_LABELS: Record<string, string> = {
  update: "Update",
  guide: "Guide",
  spotlight: "Spotlight",
  market: "Market",
};

const ACCENT: Record<string, { text: string; bg: string; border: string; from: string }> = {
  gold: { text: "text-pi-gold", bg: "bg-pi-gold/10", border: "border-pi-gold/30", from: "from-pi-gold/20" },
  purple: { text: "text-pi-purple", bg: "bg-pi-purple/10", border: "border-pi-purple/30", from: "from-pi-purple/20" },
  teal: { text: "text-pi-teal", bg: "bg-pi-teal/10", border: "border-pi-teal/30", from: "from-pi-teal/20" },
  rose: { text: "text-pi-rose", bg: "bg-pi-rose/10", border: "border-pi-rose/30", from: "from-pi-rose/20" },
};

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 14) return "a week ago";
  if (d < 30) return `${Math.floor(d / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Blog() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState("all");
  const [selected, setSelected] = React.useState<Article | null>(null);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/articles?category=${active}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setArticles(d.articles ?? []);
      })
      .catch(() => toast.error("Could not load articles."))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [active]);

  return (
    <section id="blog" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-pi-purple/30 bg-pi-purple/10 px-3 py-1 text-xs font-medium text-pi-purple"
            >
              <Newspaper className="h-3.5 w-3.5" />
              Ecosystem dispatch
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              News from the{" "}
              <span className="text-gradient-purple">Pi frontier</span>
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Build updates, pioneer spotlights, market views and guides —
              straight from the portfolio. Tap any card to read the full dispatch.
            </p>
          </div>

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
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))
            : articles.map((a, i) => {
                const accent = ACCENT[a.accent] ?? ACCENT.gold;
                return (
                  <motion.button
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                    onClick={() => setSelected(a)}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${accent.border} bg-card/60 p-5 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div
                      className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent.from} to-transparent blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
                    />
                    <div className="relative flex items-start justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${accent.bg} ${accent.border} border`}
                      >
                        {a.emoji}
                      </span>
                      <Badge
                        variant="outline"
                        className={`rounded-full border ${accent.border} ${accent.bg} ${accent.text} text-[10px]`}
                      >
                        {CATEGORY_LABELS[a.category] ?? a.category}
                      </Badge>
                    </div>
                    <h3 className="relative mt-4 line-clamp-2 text-base font-semibold leading-snug">
                      {a.title}
                    </h3>
                    <p className="relative mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {a.excerpt}
                    </p>
                    <div className="relative mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {relativeDate(a.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {a.readingMins} min
                      </span>
                    </div>
                  </motion.button>
                );
              })}
        </div>

        {!loading && articles.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
            No dispatches in this category yet — check back soon.
          </div>
        )}
      </div>

      <ArticleDialog article={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function ArticleDialog({
  article,
  onClose,
}: {
  article: Article | null;
  onClose: () => void;
}) {
  const accent = article
    ? ACCENT[article.accent] ?? ACCENT.gold
    : ACCENT.gold;
  return (
    <Dialog open={!!article} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {article && (
          <>
            <div
              className={`relative border-b border-border/60 bg-gradient-to-br ${accent.from} to-transparent p-6`}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-4 pr-10">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} text-3xl`}
                >
                  {article.emoji}
                </span>
                <div className="min-w-0">
                  <DialogHeader className="space-y-0 p-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-full border ${accent.border} ${accent.bg} ${accent.text}`}
                      >
                        {CATEGORY_LABELS[article.category] ?? article.category}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readingMins} min read
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {relativeDate(article.createdAt)}
                      </span>
                    </div>
                    <DialogTitle className="text-balance text-xl font-bold leading-tight tracking-tight">
                      {article.title}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-foreground/70">
                      by <span className="font-mono font-semibold">{article.author}</span>
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-6 pi-scroll">
              <p className="mb-4 text-sm font-medium text-foreground">
                {article.excerpt}
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {article.body}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {article.slug}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-full"
                  onClick={() => {
                    navigator.clipboard?.writeText(article.title);
                    toast.success("Title copied");
                  }}
                >
                  Share <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
