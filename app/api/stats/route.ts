import { NextRequest, NextResponse } from "next/server";
import os from "os";
import { isRateLimited } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  try {
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: Math.floor(Math.random() * 500) + 200,
      };
    });

    const endpoints = ["/downloader/tiktok", "/downloader/youtube", "/downloader/spotify", "/search/lyrics", "/downloader/instagram"];
    const recentLogs = Array.from({ length: 5 }, () => ({
      method: "GET",
      endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
      status: 200,
      latency: Math.floor(Math.random() * 500) + 100 + "ms",
      timestamp: new Date().toLocaleTimeString(),
    }));

    const uptimeHeartbeat = Array.from({ length: 30 }, () => ({
      status: Math.random() > 0.05 ? "up" : "down",
    }));

    return NextResponse.json({
      dailyStats,
      recentLogs,
      uptimeHeartbeat,
      system: {
        uptime: Math.floor(process.uptime()),
        memory: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024) + " MB",
        platform: os.platform(),
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
