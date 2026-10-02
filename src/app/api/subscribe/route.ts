import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const piHandle = body?.piHandle ? String(body.piHandle).trim() : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const existing = await db.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "You're already on the pioneer list — welcome back!",
      });
    }

    await db.subscriber.create({
      data: {
        email,
        piHandle: piHandle ? piHandle.slice(0, 80) : null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Welcome aboard, pioneer! Check your inbox for confirmation.",
    });
  } catch (err) {
    console.error("[subscribe] POST failed", err);
    return NextResponse.json(
      { error: "Could not subscribe. Please try again shortly." },
      { status: 500 }
    );
  }
}
