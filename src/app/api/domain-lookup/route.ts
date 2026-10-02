import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simulate a .pi domain availability lookup.
// In the real Pi Network ecosystem, .pi domains resolve on-chain; here we
// keep a curated portfolio plus a deterministic "registry" check so the
// experience feels real without external network calls.
const RESERVED = new Set([
  "wallet.pi",
  "exchange.pi",
  "market.pi",
  "shop.pi",
  "news.pi",
  "node.pi",
  "pi.pi",
  "mining.pi",
  "coreteam.pi",
  "app.pi",
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = (searchParams.get("name") ?? "").trim().toLowerCase();

  if (!raw) {
    return NextResponse.json(
      { error: "Provide a name, e.g. ?name=yourname" },
      { status: 400 }
    );
  }

  // Allow "kinyanjui" or "kinyanjui.pi" input
  const label = raw.endsWith(".pi") ? raw.slice(0, -3) : raw;

  if (!/^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(label)) {
    return NextResponse.json({
      label,
      available: false,
      reason: "invalid",
      message:
        "A .pi name must be 3–32 chars, letters/numbers/hyphens, and cannot start or end with a hyphen.",
    });
  }

  const owned = await db.domain.findUnique({ where: { name: `${label}.pi` } });

  if (owned) {
    return NextResponse.json({
      label,
      name: owned.name,
      available: false,
      reason: "portfolio",
      owner: "kinyanjui.pi network",
      status: owned.status,
      category: owned.category,
      pricePi: owned.pricePi,
      emoji: owned.emoji,
      message: `"${owned.name}" is part of this curated portfolio. ${
        owned.status === "for-sale"
          ? "It is currently listed for sale — open an inquiry to make an offer."
          : "Reach out to discuss a partnership or licensing opportunity."
      }`,
    });
  }

  if (RESERVED.has(`${label}.pi`)) {
    return NextResponse.json({
      label,
      name: `${label}.pi`,
      available: false,
      reason: "reserved",
      message: `"${label}.pi" is reserved by the Pi Core Team registry.`,
    });
  }

  // Deterministic pseudo-availability so results are stable across refreshes
  const hash = [...label].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 7);
  const available = hash % 5 !== 0; // ~80% chance "available"
  const estPricePi = 50 + (hash % 18) * 25;

  return NextResponse.json({
    label,
    name: `${label}.pi`,
    available,
    reason: available ? "open" : "taken",
    estPricePi: available ? estPricePi : null,
    message: available
      ? `Great news — "${label}.pi" appears to be available in the .pi registry. Estimated registration: ${estPricePi} π.`
      : `"${label}.pi" is already registered in the .pi registry. Try a variation.`,
  });
}
