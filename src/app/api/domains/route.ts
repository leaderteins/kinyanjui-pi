import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const where: {
    category?: string;
    featured?: boolean;
  } = {};
  if (category && category !== "all") where.category = category;
  if (featured === "true") where.featured = true;

  const domains = await db.domain.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ domains });
}
