import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Track a view for a domain
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    await db.domain.update({
      where: { name },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
