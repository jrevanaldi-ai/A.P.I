import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get client IP from headers
    const forwarded = req.headers.get("x-forwarded-for");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ip = forwarded ? forwarded.split(/, /)[0] : (req as any).ip || "Unknown";

    // Fetch location info from server side (no CORS issue)
    const res = await axios.get(`https://ipapi.co/${ip}/json/`).catch(() => null);
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
