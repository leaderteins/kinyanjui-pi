import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function firstName(name: string): string {
  const part = name.trim().split(/\s+/)[0] ?? "";
  if (!part) return "A pioneer";
  return part.charAt(0).toUpperCase() + part.slice(1);
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

export async function GET() {
  try {
    const [recentInquiries, subscriberCount, domains] = await Promise.all([
      db.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          name: true,
          intent: true,
          domain: true,
          createdAt: true,
        },
      }),
      db.subscriber.count(),
      db.domain.findMany({
        orderBy: { views: "desc" },
        take: 4,
        select: { name: true, emoji: true, views: true, accent: true },
      }),
    ]);

    const totalViews = domains.reduce((s, d) => s + d.views, 0);

    const activity = recentInquiries
      .filter((i) => i.intent !== "general" || Math.random() > 0.5)
      .slice(0, 5)
      .map((i) => {
        const verb =
          i.intent === "purchase"
            ? "made an offer on"
            : i.intent === "partnership"
            ? "wants to partner on"
            : i.intent === "develop"
            ? "is interested in building"
            : "inquired about";
        return {
          id: i.createdAt.toISOString(),
          who: firstName(i.name),
          verb,
          target: i.domain || "the portfolio",
          when: relativeTime(i.createdAt.toISOString()),
        };
      });

    return NextResponse.json({
      activity,
      subscriberCount,
      totalViews,
      topDomains: domains.map((d) => ({
        name: d.name,
        emoji: d.emoji,
        views: d.views,
        accent: d.accent,
      })),
    });
  } catch (err) {
    console.error("[activity] GET failed", err);
    return NextResponse.json(
      {
        activity: [],
        subscriberCount: 0,
        totalViews: 0,
        topDomains: [],
      },
      { status: 200 }
    );
  }
}
