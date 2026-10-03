import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/domain-health?name=soko.pi
// Returns a computed "health score" (0-100) for a domain combining:
// - views (engagement)
// - inquiries (intent)
// - featured status (portfolio significance)
// - for-sale status (market readiness)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json(
      { error: "name query param is required" },
      { status: 400 }
    );
  }

  const domain = await db.domain.findUnique({
    where: { name },
    select: {
      name: true,
      views: true,
      featured: true,
      status: true,
      pricePi: true,
    },
  });

  if (!domain) {
    return NextResponse.json({ error: "domain not found" }, { status: 404 });
  }

  const inquiryCount = await db.inquiry.count({
    where: { domain: name },
  });

  // Score components (weighted, max 100)
  // Views: up to 40 points (1 view = 2 pts, cap at 20 views)
  const viewsScore = Math.min(40, domain.views * 2);
  // Inquiries: up to 30 points (1 inquiry = 10 pts, cap at 3)
  const inquiryScore = Math.min(30, inquiryCount * 10);
  // Featured: 15 points
  const featuredScore = domain.featured ? 15 : 0;
  // For-sale with price: 15 points (market readiness)
  const marketScore = domain.status === "for-sale" && domain.pricePi ? 15 : 0;
  // Developed domains get a small bonus
  const devScore = domain.status === "developed" ? 5 : 0;

  const score = Math.min(
    100,
    viewsScore + inquiryScore + featuredScore + marketScore + devScore
  );

  // Grade
  const grade =
    score >= 80
      ? "Excellent"
      : score >= 60
      ? "Strong"
      : score >= 40
      ? "Growing"
      : score >= 20
      ? "Emerging"
      : "New";

  const breakdown = [
    { label: "Engagement (views)", value: viewsScore, max: 40, color: "gold" },
    { label: "Inquiries", value: inquiryScore, max: 30, color: "purple" },
    { label: "Featured", value: featuredScore, max: 15, color: "teal" },
    { label: "Market readiness", value: marketScore, max: 15, color: "rose" },
    { label: "Development", value: devScore, max: 5, color: "gold" },
  ].filter((b) => b.value > 0);

  return NextResponse.json({
    name: domain.name,
    score,
    grade,
    inquiryCount,
    views: domain.views,
    featured: domain.featured,
    status: domain.status,
    breakdown,
  });
}
