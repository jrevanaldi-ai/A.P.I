import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: "ok",
    name: "Kiracloud API",
    version: "v2.0",
    author: "Kiracloud",
    description: "Simple and powerful tools API, easy to use.",
    uptime: `${uptime}s`,
    timestamp: new Date().toISOString(),
  });
}
