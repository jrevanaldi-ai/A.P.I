export function isValidUrl(url: string, allowedDomains: string[]): boolean {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();
    return allowedDomains.some(allowed => domain === allowed || domain.endsWith("." + allowed));
  } catch {
    return false;
  }
}

const ipCache = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 50; 
const WINDOW = 60 * 1000; 

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
