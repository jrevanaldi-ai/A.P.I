import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    const uptime = process.uptime();
    const totalMem = os.totalmem();
    const usedMem = totalMem - os.freemem();
    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    const requestHistory = Array.from({ length: 15 }, (_, i) => ({
      time: new Date(Date.now() - (15 - i) * 2000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      count: Math.floor(Math.random() * 500) + 100,
    }));

    const latencyHistory = Array.from({ length: 15 }, (_, i) => ({
      time: new Date(Date.now() - (15 - i) * 2000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      latency: Math.floor(Math.random() * 200) + 100,
    }));

    const data = {
      uptime: formatUptime(Math.floor(uptime)),
      database: {
        size: "2.119KB",
        status: "healthy" as const,
      },
      liveRequests: Math.floor(Math.random() * 50) + 400,
      avgLatency: Math.floor(Math.random() * 100) + 1000,
      totalKeys: 11,
      requestHistory,
      latencyHistory,
      hardware: {
        cpu: cpus[0].model,
        region: "SURABAYA, ID",
        memory: `${(usedMem / (1024 ** 3)).toFixed(2)} / ${(totalMem / (1024 ** 3)).toFixed(2)} GB`,
        systemLoad: Math.min((loadAvg[0] / cpus.length) * 100, 100),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
