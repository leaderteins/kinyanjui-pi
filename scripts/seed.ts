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

  const count = await db.domain.count();
  console.log(`✅ Seeded ${count} domains and 14 price log entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
