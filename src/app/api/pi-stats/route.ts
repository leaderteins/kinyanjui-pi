import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const logs = await db.piPriceLog.findMany({
    orderBy: { createdAt: "asc" },
    take: 30,
  });

  const latest = logs[logs.length - 1];
  const prev = logs[logs.length - 2];

  const series = logs.map((l) => ({
    t: l.createdAt.toISOString(),
    price: l.priceUsd,
    volume: l.volumeUsd,
    marketCap: l.marketCap,
  }));

  const sparkline = logs.slice(-14).map((l) => l.priceUsd);

  const change24h =
    latest && prev
      ? Number(
          (((latest.priceUsd - prev.priceUsd) / prev.priceUsd) * 100).toFixed(2)
        )
      : 0;

  return NextResponse.json({
    priceUsd: latest?.priceUsd ?? 0,
    change24h: latest?.change24h ?? 0,
    changePct: change24h,
    volumeUsd: latest?.volumeUsd ?? 0,
    marketCap: latest?.marketCap ?? 0,
    updatedAt: latest?.createdAt.toISOString() ?? null,
    series,
    sparkline,
  });
}
