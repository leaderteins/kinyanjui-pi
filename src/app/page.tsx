import { db } from "@/lib/db";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/pi/navbar";
import { Hero } from "@/components/pi/hero";
import { TickerTape } from "@/components/pi/ticker-tape";
import { Stats, PiPriceCard } from "@/components/pi/stats";
import { DomainPortfolio } from "@/components/pi/domain-portfolio";
import { AboutPi } from "@/components/pi/about-pi";
import { Services } from "@/components/pi/services";
import { Roadmap } from "@/components/pi/roadmap";
import { Faq } from "@/components/pi/faq";
import { Contact } from "@/components/pi/contact";
import { Newsletter } from "@/components/pi/newsletter";
import { Footer } from "@/components/pi/footer";
import { MarketChart } from "@/components/pi/market-chart";
import { PioneerSpotlight } from "@/components/pi/pioneer-spotlight";
import { EcosystemPulse } from "@/components/pi/ecosystem-pulse";
import { ScrollProgress } from "@/components/pi/scroll-progress";
import { Blog } from "@/components/pi/blog";
import { PiCalculator } from "@/components/pi/pi-calculator";
import { CommandPalette } from "@/components/pi/command-palette";
import { BackToTop } from "@/components/pi/back-to-top";
import { TipOfDay } from "@/components/pi/tip-of-day";
import { MiningSimulator } from "@/components/pi/mining-simulator";
import { RecommendationEngine } from "@/components/pi/recommendation-engine";
import { AcquisitionFunnel } from "@/components/pi/acquisition-funnel";
import { EcosystemMap } from "@/components/pi/ecosystem-map";

async function getInitialData() {
  try {
    const [domainsCount, priceLogs] = await Promise.all([
      db.domain.count(),
      db.piPriceLog.findMany({ orderBy: { createdAt: "asc" }, take: 30 }),
    ]);

    const latest = priceLogs[priceLogs.length - 1];
    const prev = priceLogs[priceLogs.length - 2];
    const sparkline = priceLogs.slice(-14).map((l) => l.priceUsd);
    const changePct =
      latest && prev
        ? Number(
            (((latest.priceUsd - prev.priceUsd) / prev.priceUsd) * 100).toFixed(2)
          )
        : 0;

    const series = priceLogs.map((l) => ({
      t: l.createdAt.toISOString(),
      price: l.priceUsd,
      volume: l.volumeUsd,
      marketCap: l.marketCap,
    }));

    return {
      domainsCount,
      piStats: {
        priceUsd: latest?.priceUsd ?? 0,
        changePct,
        sparkline,
        volumeUsd: latest?.volumeUsd ?? 0,
        marketCap: latest?.marketCap ?? 0,
        updatedAt: latest?.createdAt.toISOString() ?? null,
      },
      series,
    };
  } catch (err) {
    console.error("[page] initial data fetch failed", err);
    return {
      domainsCount: 8,
      piStats: {
        priceUsd: 47.2,
        changePct: 0,
        sparkline: [42, 44, 43, 46, 45, 47, 46, 48, 47, 49, 48, 50, 49, 47],
        volumeUsd: 2_800_000,
        marketCap: 47.2 * 65_000_000,
        updatedAt: new Date().toISOString(),
      },
      series: [],
    };
  }
}

export default async function Home() {
  const { domainsCount, piStats, series } = await getInitialData();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TickerTape />
        <Stats domainsCount={domainsCount} />
        <AcquisitionFunnel />
        <DomainPortfolio />
        <MarketChart series={series} latest={piStats} />

        {/* Pi mining simulator + converter + tip */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-5 lg:grid-cols-3">
            <MiningSimulator />
            <div id="calculator" className="scroll-mt-20">
              <PiCalculator
                priceUsd={piStats.priceUsd}
                changePct={piStats.changePct}
              />
            </div>
            <TipOfDay />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-pi-gold" />
            <span>
              <span className="font-semibold text-foreground">Try the math</span> —
              the converter shows USD equivalents at the current illustrative
              rate. Mine simulated Pi above, then convert it below.
            </span>
          </div>
        </section>

        <AboutPi />
        <Services />
        <EcosystemMap />
        <PioneerSpotlight />
        <Roadmap />
        <EcosystemPulse />

        {/* Domain recommendation engine */}
        <section id="recommend" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col justify-center">
              <Badge
                variant="outline"
                className="mb-3 w-fit gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold"
              >
                <Sparkles className="h-3.5 w-3.5" /> Smart picks
              </Badge>
              <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Domains picked <span className="text-gradient-gold">for you</span>
              </h2>
              <p className="mt-3 text-pretty text-sm text-muted-foreground">
                Our recommendation engine scores every domain in the portfolio
                against your connected wallet balance and category interests.
                Pick what you&apos;re curious about — the top 3 matches update
                live. Connect a wallet for budget-aware suggestions.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pi-gold" />
                  Affordability scoring (within budget / close to budget)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pi-purple" />
                  Category interest matching (pick what you&apos;re into)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pi-teal" />
                  Engagement + featured + for-sale bonuses
                </li>
              </ul>
            </div>
            <RecommendationEngine />
          </div>
        </section>

        <Blog />
        <Faq />

        {/* Live Pi price card before contact */}
        <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <PiPriceCard {...piStats} />
        </section>

        <Contact />
        <Newsletter />
      </main>
      <Footer />
      <CommandPalette />
      <BackToTop />
    </div>
  );
}
