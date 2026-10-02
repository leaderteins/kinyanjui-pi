import { db } from "@/lib/db";
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
    };
  }
}

export default async function Home() {
  const { domainsCount, piStats } = await getInitialData();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TickerTape />
        <Stats domainsCount={domainsCount} />
        <DomainPortfolio />
        <AboutPi />
        <Services />
        <Roadmap />
        <Faq />

        {/* Live Pi price card before contact */}
        <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <PiPriceCard {...piStats} />
        </section>

        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
