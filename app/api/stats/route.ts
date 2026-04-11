import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    const uptime = process.uptime();
    const totalMem = os.totalmem();
    const usedMem = totalMem - os.freemem();
    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    // Mock data - replace with actual data from your database/service
    const stats = {
      snippets: 1234,
      users: 56,
      views: 12450,
      likes: 890,
      comments: 125,
      dbLatency: Math.random() * 300,
      requestDelta: Math.floor(Math.random() * 50),
      uptime: Math.floor(uptime),
      hardware: {
        cpu: cpus[0].model,
        cpuCores: cpus.length,
        totalMem: totalMem,
        usedMem: usedMem,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        rss: process.memoryUsage().rss,
        loadAvg1: loadAvg[0],
        loadAvg5: loadAvg[1],
        region: "US-East",
        nodeVersion: process.version.slice(1),
        platform: os.platform(),
      },
      recentSnippets: [
        { id: "1", title: "Quick Sort Algorithm", category: "Scrape", createdAt: new Date().toISOString(), views: 234, filename: "quicksort" },
        { id: "2", title: "API Response Handler", category: "Tools", createdAt: new Date(Date.now() - 86400000).toISOString(), views: 156, filename: "api-handler" },
        { id: "3", title: "Anime Data Parser", category: "Anime", createdAt: new Date(Date.now() - 172800000).toISOString(), views: 892, filename: "anime-parser" },
        { id: "4", title: "Image Downloader", category: "Downloader", createdAt: new Date(Date.now() - 259200000).toISOString(), views: 1203, filename: "img-download" },
        { id: "5", title: "JSON Formatter", category: "Tools", createdAt: new Date(Date.now() - 345600000).toISOString(), views: 456, filename: "json-fmt" },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
