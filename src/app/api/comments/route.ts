import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/comments?slug=<articleSlug>
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "slug query param is required" },
      { status: 400 }
    );
  }
  const comments = await db.comment.findMany({
    where: { articleSlug: slug, approved: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      piHandle: true,
      body: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ comments });
}

// POST /api/comments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleSlug, name, piHandle, body: text } = body ?? {};

    if (!articleSlug || typeof articleSlug !== "string") {
      return NextResponse.json(
        { error: "articleSlug is required" },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please tell us your name." },
        { status: 400 }
      );
    }
    if (!text || typeof text !== "string" || text.trim().length < 3) {
      return NextResponse.json(
        { error: "Comment must be at least 3 characters." },
        { status: 400 }
      );
    }
    if (text.length > 1000) {
      return NextResponse.json(
        { error: "Comment is too long (max 1000 characters)." },
        { status: 400 }
      );
    }

    const created = await db.comment.create({
      data: {
        articleSlug: articleSlug.trim().slice(0, 120),
        name: name.trim().slice(0, 80),
        piHandle: piHandle
          ? String(piHandle).trim().slice(0, 80)
          : null,
        body: text.trim().slice(0, 1000),
      },
      select: {
        id: true,
        name: true,
        piHandle: true,
        body: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, comment: created });
  } catch (err) {
    console.error("[comments] POST failed", err);
    return NextResponse.json(
      { error: "Could not post comment. Try again shortly." },
      { status: 500 }
    );
  }
}
