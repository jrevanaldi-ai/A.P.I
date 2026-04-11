import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  const memTotal = os.totalmem();
  const memFree = os.freemem();
  const memUsed = memTotal - memFree;

  return NextResponse.json({
    status: "ok",
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    memory: {
      total: `${Math.round(memTotal / 1024 / 1024)} MB`,
      used: `${Math.round(memUsed / 1024 / 1024)} MB`,
      free: `${Math.round(memFree / 1024 / 1024)} MB`,
      usagePercent: `${Math.round((memUsed / memTotal) * 100)}%`,
    },
    cpus: os.cpus().length,
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
  });
}
