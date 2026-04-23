import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
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
    const forwarded = req.headers.get("x-forwarded-for");
    const ipFromHeader = forwarded ? forwarded.split(/, /)[0] : (req as any).ip || "Unknown";

    const res = await axios.get(`https://ipapi.co/${ipFromHeader}/json/`).catch(() => null);
    const data = res?.data || {};

    return NextResponse.json({
      ip: ip,
      city: data.city || "Unknown",
      country: data.country_name || "Unknown",
      location: data.city && data.country_name ? `${data.city}, ${data.country_name}` : "Unknown"
    });
  } catch (err) {
    return NextResponse.json({ ip: "Unknown", location: "Unknown" }, { status: 500 });
  }
}
