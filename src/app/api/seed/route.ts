import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed — seeds the Postgres database with the initial portfolio data.
// This is a one-time setup endpoint. Once seeded, it can be disabled or removed.
export async function POST() {
  try {
    // Check if already seeded
    const existing = await db.domain.count();
    if (existing > 0) {
      return NextResponse.json({
        ok: true,
        message: `Database already seeded (${existing} domains found). Skipping.`,
      });
    }

    const now = Date.now();

    // 1. Domains
    const domains = [
      {
        name: "kinyanjui.pi",
        label: "kinyanjui",
        tagline: "The founder's flagship identity on the Pi Network",
        description:
          "A personal brand domain anchoring the Kinyanjui identity inside the Pi ecosystem. Planned as the hub for personal finance articles, Pi journey updates, and a community blog spotlighting pioneers across East Africa.",
        category: "personal",
        status: "developed",
        pricePi: null,
        featured: true,
        emoji: "π",
        accent: "gold",
      },
      {
        name: "soko.pi",
        label: "soko",
        tagline: "Swahili for 'market' — the Pi marketplace of tomorrow",
        description:
          "Soko.pi is designed to become a peer-to-peer marketplace where pioneers list goods and services priced in Pi. Think Gumtree meets Web3, built natively for the Pi community.",
        category: "marketplace",
        status: "developed",
        pricePi: 4200,
        featured: true,
        emoji: "🛍️",
        accent: "teal",
      },
      {
        name: "pioneerhub.pi",
        label: "pioneerhub",
        tagline: "Where Pi pioneers gather, build, and ship",
        description:
          "A social layer for the Pi community — pioneer profiles, security circle visualizations, contribution leaderboards, and project discovery for builders in the ecosystem.",
        category: "community",
        status: "held",
        pricePi: 1850,
        featured: true,
        emoji: "🚀",
        accent: "purple",
      },
      {
        name: "piwallet.pi",
        label: "piwallet",
        tagline: "Your gateway to managing Pi assets",
        description:
          "A lightweight wallet interface concept featuring multi-account views, transaction history, QR payments, and integration guides for Pi-compatible merchants.",
        category: "defi",
        status: "for-sale",
        pricePi: 9200,
        featured: false,
        emoji: "👛",
        accent: "gold",
      },
      {
        name: "mali.pi",
        label: "mali",
        tagline: "Swahili for 'wealth' — Pi wealth management",
        description:
          "Mali.pi is envisioned as a wealth-tracking dashboard: portfolio of Pi holdings, staking-style yield trackers, and educational content on preserving value on the network.",
        category: "defi",
        status: "held",
        pricePi: 3100,
        featured: false,
        emoji: "💎",
        accent: "purple",
      },
      {
        name: "piart.pi",
        label: "piart",
        tagline: "A gallery for Pi-native NFT artistry",
        description:
          "A curated NFT marketplace where artists mint and trade digital art priced in Pi. Includes creator profiles, royalty enforcement, and exhibition halls.",
        category: "nft",
        status: "developed",
        pricePi: 5400,
        featured: true,
        emoji: "🎨",
        accent: "rose",
      },
      {
        name: "kilimo.pi",
        label: "kilimo",
        tagline: "Swahili for 'farming' — agriculture on Pi",
        description:
          "Kilimo.pi connects smallholder farmers to Pi-enabled supply chains, letting produce be listed and purchased with Pi while tracking provenance on-chain.",
        category: "utility",
        status: "for-sale",
        pricePi: 2400,
        featured: false,
        emoji: "🌾",
        accent: "teal",
      },
      {
        name: "piswap.pi",
        label: "piswap",
        tagline: "Atomic swaps for the Pi era",
        description:
          "A concept domain for a decentralized exchange interface enabling Pi-to-fiat and Pi-to-token swaps with an emphasis on low-friction onboarding for non-crypto natives.",
        category: "defi",
        status: "held",
        pricePi: 7600,
        featured: false,
        emoji: "🔄",
        accent: "gold",
      },
      {
        name: "pimorgages.pi",
        label: "pimorgages",
        tagline: "Pi-backed mortgages — own your home, settle in Pi",
        description:
          "pimorgages.pi is envisioned as a Pi-native mortgage and real-estate financing platform. Pioneers could pledge Pi holdings toward home loans, track amortization on-chain, and settle monthly payments in Pi — bringing decentralized finance to the biggest purchase most people will ever make.",
        category: "defi",
        status: "held",
        pricePi: 12000,
        featured: true,
        emoji: "🏦",
        accent: "gold",
      },
      {
        name: "pimorgage.pi",
        label: "pimorgage",
        tagline: "The singular Pi mortgage hub",
        description:
          "pimorgage.pi is the flagship singular form of the mortgages concept — a focused landing for a single Pi-backed mortgage product. Ideal as the consumer-facing brand while pimorgages.pi handles the platform infrastructure. A paired domain strategy protects the brand on both singular and plural forms.",
        category: "defi",
        status: "held",
        pricePi: 8800,
        featured: false,
        emoji: "🏠",
        accent: "purple",
      },
      {
        name: "pidapps.pi",
        label: "pidapps",
        tagline: "Decentralized apps, built natively on Pi",
        description:
          "pidapps.pi is positioned as a discovery layer and registry for decentralized applications (dApps) running on the Pi blockchain. Developers list their dApps; pioneers browse by category, install with one tap, and connect their Pi wallet to start using on-chain services instantly.",
        category: "utility",
        status: "held",
        pricePi: 6400,
        featured: true,
        emoji: "⚡",
        accent: "teal",
      },
      {
        name: "kenyan.pi",
        label: "kenyan",
        tagline: "The Pi identity for Kenya's pioneer community",
        description:
          "kenyan.pi is a regional identity domain anchoring the Kenyan Pi pioneer community. Planned as a hub for local meetups, Kiswahili content, M-Pesa↔Pi on/off ramps, and a directory of Kenyan merchants accepting Pi. Kenya is one of Pi's most active markets — this name gives it a home.",
        category: "community",
        status: "held",
        pricePi: 5200,
        featured: true,
        emoji: "🇰🇪",
        accent: "rose",
      },
    ];

    for (const d of domains) {
      await db.domain.create({ data: d });
    }

    // 2. Pi price logs (14 days of simulated data)
    const base = 47.2;
    for (let i = 13; i >= 0; i--) {
      const t = new Date(now - i * 24 * 60 * 60 * 1000);
      const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 3.4;
      const price = Math.max(30, base + noise + (13 - i) * 0.4);
      await db.piPriceLog.create({
        data: {
          priceUsd: Number(price.toFixed(3)),
          change24h: Number((noise * 0.6).toFixed(2)),
          volumeUsd: Number((2_400_000 + Math.random() * 900_000).toFixed(0)),
          marketCap: Number((price * 65_000_000).toFixed(0)),
          createdAt: t,
        },
      });
    }

    // 3. Articles
    const articles = [
      {
        slug: "soko-pi-marketplace-mvp",
        title: "Soko.pi marketplace MVP enters private beta",
        excerpt:
          "The first peer-to-peer marketplace on the portfolio is now in private beta. Here's what pioneers can do today and what's coming next.",
        body: "After months of planning, soko.pi has a working MVP in private beta. Pioneers can list goods and services priced in Pi, browse categories, and message sellers directly. Escrow is the next milestone — once live, funds will be held until both parties confirm delivery. If you'd like early access, mention soko.pi in the contact form.",
        category: "update",
        author: "kinyanjui.pi",
        emoji: "🛍️",
        accent: "teal",
        readingMins: 3,
      },
      {
        slug: "why-pi-domains-matter",
        title: "Why .pi domains are the identity layer Pi was missing",
        excerpt:
          "Wallet addresses are hard to remember. Domains are not. Here's why on-chain naming changes how pioneers transact.",
        body: "Every Pi wallet is a long string of characters. That's fine for machines but terrible for humans. On-chain .pi domains solve this: send Pi to kinyanjui.pi instead of a 36-character address. They also double as a website identity — visit soko.pi in a Pi-aware browser and you land on the marketplace. Naming is the bridge between the blockchain and everyday people.",
        category: "guide",
        author: "kinyanjui.pi",
        emoji: "🧭",
        accent: "gold",
        readingMins: 4,
      },
      {
        slug: "piart-spotlight-amara",
        title: "Spotlight: Amara's first Pi-native NFT drop on piart.pi",
        excerpt:
          "Meet Amara, a Nairobi-based artist who sold her first digital collection entirely in Pi — and what she learned along the way.",
        body: "Amara N. listed three pieces on piart.pi last month. Within a week, all three sold to pioneers across Kenya, Uganda and Tanzania. 'The thing that surprised me most was how personal it felt,' she says. 'These weren't random buyers — they were people in my security circle.' Her royalty split is automatic: 90% to the artist, 10% to the platform's community fund.",
        category: "spotlight",
        author: "kinyanjui.pi",
        emoji: "🎨",
        accent: "rose",
        readingMins: 5,
      },
      {
        slug: "market-pi-mainnet-graduation",
        title: "Pi Mainnet graduation: what it means for domain holders",
        excerpt:
          "As Pi moves toward open Mainnet, .pi domain holders gain real utility. Here's the market view from this portfolio's perspective.",
        body: "Mainnet graduation is the moment Pi becomes fully transferable on-chain. For domain holders, that's when names stop being claims and start being infrastructure. We expect wallet resolution, dApp routing and merchant payments to all flow through .pi names. The portfolio is positioned so that commerce (soko.pi), identity (kinyanjui.pi) and community (pioneerhub.pi) are ready to plug in on day one.",
        category: "market",
        author: "kinyanjui.pi",
        emoji: "📈",
        accent: "purple",
        readingMins: 4,
      },
      {
        slug: "kilimo-pi-supply-chain-pilot",
        title: "Kilimo.pi agriculture pilot: tracking produce in Pi",
        excerpt:
          "A smallholder cooperative in Arusha is piloting kilimo.pi to list produce and settle in Pi. Early lessons from the field.",
        body: "The Kilimo.pi pilot connects a cooperative of 40 smallholder farmers outside Arusha to Pi-enabled buyers. Each lot of produce is listed with provenance metadata — farm, harvest date, grade. Buyers pay in Pi; the cooperative distributes proceeds. The biggest lesson so far: trust goes up when the supply chain is readable by everyone involved.",
        category: "update",
        author: "kinyanjui.pi",
        emoji: "🌾",
        accent: "teal",
        readingMins: 6,
      },
      {
        slug: "beginners-guide-to-pi-security-circles",
        title: "A beginner's guide to Pi security circles",
        excerpt:
          "Security circles are how Pi protects itself without centralized gatekeepers. Here's how they work and why yours matters.",
        body: "A security circle is a group of 3–5 pioneers you trust. Together, your circles form a graph of trust that secures transactions. When you vouch for someone, you're saying 'I believe this person is a real, unique human.' The more trusted your circle, the more weight your votes carry. Build your circle slowly with people you actually know — quality beats quantity.",
        category: "guide",
        author: "kinyanjui.pi",
        emoji: "🛡️",
        accent: "purple",
        readingMins: 5,
      },
    ];
    const articleTimes = [2, 5, 9, 14, 18, 25];
    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      const createdAt = new Date(now - articleTimes[i] * 24 * 60 * 60 * 1000);
      await db.article.create({ data: { ...a, createdAt } });
    }

    // 4. Comments
    const comments = [
      {
        articleSlug: "soko-pi-marketplace-mvp",
        name: "Amara N.",
        piHandle: "@amara.pi",
        body: "This is exactly what the Pi community needs. Excited to list my crafts here!",
      },
      {
        articleSlug: "soko-pi-marketplace-mvp",
        name: "David K.",
        piHandle: "@davidk.pi",
        body: "Escrow will be a game-changer. When is the target launch?",
      },
      {
        articleSlug: "why-pi-domains-matter",
        name: "Lilian W.",
        piHandle: "@lilianw.pi",
        body: "Sending Pi to a name instead of an address just feels right. Great read.",
      },
      {
        articleSlug: "piart-spotlight-amara",
        name: "Tendai M.",
        piHandle: "@tendai.pi",
        body: "Congrats Amara! The royalty split model is inspiring.",
      },
      {
        articleSlug: "market-pi-mainnet-graduation",
        name: "Fatima A.",
        piHandle: "@fatima.pi",
        body: "Hoping .pi domains become the standard for wallet resolution post-Mainnet.",
      },
    ];
    const commentTimes = [1, 0.3, 3, 2, 1.5];
    for (let i = 0; i < comments.length; i++) {
      const c = comments[i];
      const createdAt = new Date(now - commentTimes[i] * 24 * 60 * 60 * 1000);
      await db.comment.create({ data: { ...c, createdAt } });
    }

    const domainCount = await db.domain.count();
    const articleCount = await db.article.count();
    const commentCount = await db.comment.count();
    const priceCount = await db.piPriceLog.count();

    return NextResponse.json({
      ok: true,
      message: "Database seeded successfully!",
      counts: {
        domains: domainCount,
        articles: articleCount,
        comments: commentCount,
        priceLogs: priceCount,
      },
    });
  } catch (err) {
    console.error("[seed] POST failed", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

// GET — check seed status without seeding
export async function GET() {
  try {
    const domains = await db.domain.count();
    const articles = await db.article.count();
    const comments = await db.comment.count();
    return NextResponse.json({
      seeded: domains > 0,
      counts: { domains, articles, comments },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { seeded: false, error: message },
      { status: 500 }
    );
  }
}
