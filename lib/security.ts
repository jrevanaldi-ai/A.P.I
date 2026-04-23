/**
 * URL Validator Utility
 * Memastikan URL yang dikirim oleh user berasal dari domain yang diizinkan.
 * Mencegah SSRF (Server-Side Request Forgery).
 */
export function isValidUrl(url: string, allowedDomains: string[]): boolean {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();
    return allowedDomains.some(allowed => domain === allowed || domain.endsWith("." + allowed));
  } catch {
    return false;
  }
}

/**
 * Simple Rate Limiter (In-Memory)
 * Catatan: Ini bersifat sementara dan akan reset jika server restart.
 * Untuk produksi skala besar, disarankan menggunakan Redis.
 */
const ipCache = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 50; // 50 request
const WINDOW = 60 * 1000; // per 1 menit

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userData = ipCache.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  ipCache.set(ip, userData);
  return userData.count > LIMIT;
}
