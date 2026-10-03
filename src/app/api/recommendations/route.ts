import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/recommendations?balance=1247.83&interests=marketplace,defi
// Suggests domains based on wallet balance (affordability) + category interests.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const balance = Number(searchParams.get("balance") ?? "0");
  const interests = (searchParams.get("interests") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const domains = await db.domain.findMany({
    orderBy: [{ featured: "desc" }, { views: "desc" }],
  });

  // Score each domain
  const scored = domains.map((d) => {
    let score = 0;
    const reasons: string[] = [];

    // Affordability: can the wallet cover the asking price?
    if (d.pricePi && balance > 0) {
      if (balance >= d.pricePi) {
        score += 40;
        reasons.push("within your budget");
      } else {
        // Partial credit if close (within 2x)
        const ratio = balance / d.pricePi;
        if (ratio > 0.5) {
          score += 15;
          reasons.push("close to your budget — consider an offer below asking");
        }
      }
    }

    // Category interest match
    if (interests.length && interests.includes(d.category)) {
      score += 25;
      reasons.push(`matches your interest in ${d.category}`);
    }

    // Featured bonus
    if (d.featured) {
      score += 15;
      reasons.push("a featured portfolio domain");
    }

    // Views (engagement)
    if (d.views > 0) {
      score += Math.min(15, d.views * 2);
      if (d.views >= 3) reasons.push(`${d.views} pioneers have viewed it`);
    }

    // For-sale bonus (actionable)
    if (d.status === "for-sale") {
      score += 10;
      reasons.push("currently for sale");
    }

    // Developed domains are ready to use
    if (d.status === "developed") {
      score += 8;
      reasons.push("in active development");
    }

    return {
      id: d.id,
      name: d.name,
      label: d.label,
      emoji: d.emoji,
      accent: d.accent,
      tagline: d.tagline,
      category: d.category,
      status: d.status,
      pricePi: d.pricePi,
      featured: d.featured,
      views: d.views,
      score,
      reasons: reasons.length ? reasons : ["a strong portfolio pick"],
    };
  });

  // Sort by score descending, take top 3
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((d) => d.score > 0);

  return NextResponse.json({ recommendations: top });
}
