import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const INTENTS = ["general", "purchase", "partnership", "develop"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, domain, intent, budget, message } = body ?? {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please tell us your name." },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required so we can reply." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please share a little more in your message (10+ characters)." },
        { status: 400 }
      );
    }
    const safeIntent = INTENTS.includes(intent) ? intent : "general";

    const inquiry = await db.inquiry.create({
      data: {
        name: name.trim().slice(0, 120),
        email: email.trim().slice(0, 200),
        domain: domain ? String(domain).slice(0, 120) : null,
        intent: safeIntent,
        budget: budget ? String(budget).slice(0, 120) : null,
        message: message.trim().slice(0, 4000),
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("[inquiries] POST failed", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ inquiries });
}
