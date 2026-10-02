import { db } from "../src/lib/db";

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
];

async function main() {
  console.log("🌱 Seeding Pi Network domain portfolio...");

  await db.inquiry.deleteMany();
  await db.subscriber.deleteMany();
  await db.article.deleteMany();
  await db.domain.deleteMany();

  for (const d of domains) {
    await db.domain.create({ data: d });
  }

  await db.piPriceLog.deleteMany();
  const now = Date.now();
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

  // Seed ecosystem articles
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

  const count = await db.domain.count();
  const articleCount = await db.article.count();
  console.log(
    `✅ Seeded ${count} domains, 14 price log entries, and ${articleCount} articles.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
