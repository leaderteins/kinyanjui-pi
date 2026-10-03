import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = Number(searchParams.get("limit") ?? "12");

  const where: { published?: boolean; category?: string } = { published: true };
  if (category && category !== "all") where.category = category;

  const articles = await db.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 50),
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      category: true,
      author: true,
      emoji: true,
      accent: true,
      readingMins: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ articles });
}
