export type EndpointConfig = {
  id: string;
  name: string;
  path: string;
  method: string;
  tag: string;
  description: string;
  example: string;
  param: string;
  extraParams?: { name: string; description: string; example: string; required: boolean }[];
};

export const getApiPath = (path: string) => `/api${path}`;

export const endpoints: EndpointConfig[] = [
  // ── Downloader ──────────────────────────────────────────────────────────
  {
    id: "tiktok",
    name: "TikTok Downloader",
    path: "/downloader/tiktok",
    method: "GET",
    tag: "Downloader",
    description: "Extract and download TikTok videos without watermark and convert to MP3 audio format.",
    example: "https://www.tiktok.com/@user/video/123456789",
    param: "url",
  },
  {
    id: "instagram",
    name: "Instagram Downloader",
    path: "/downloader/instagram",
    method: "GET",
    tag: "Downloader",
    description: "Retrieve and download Instagram content including photos, videos, reels, and carousels in HD quality.",
    example: "https://www.instagram.com/p/CXYZ1234/",
    param: "url",
  },
  {
    id: "youtube",
    name: "YouTube Downloader",
    path: "/downloader/youtube",
    method: "GET",
    tag: "Downloader",
    description: "Download YouTube videos in multiple resolutions (up to 4K) and extract audio in MP3 format.",
    example: "https://youtu.be/PPKHWvVAN9U",
    param: "url",
    extraParams: [
      { name: "resolusi", description: "Video resolution (e.g. 4k, 1080p, 720p). Default: max", example: "max", required: false },
    ],
  },
  {
    id: "spotify",
    name: "Spotify Downloader",
    path: "/downloader/spotify",
    method: "GET",
    tag: "Downloader",
    description: "Download high-quality audio tracks and retrieve HD cover art from any Spotify track URL.",
    example: "https://open.spotify.com/track/4C3TNDpxyXA2FxpEvp1pqt",
    param: "url",
  },
  // ── Search ───────────────────────────────────────────────────────────────
  {
    id: "lyrics",
    name: "Lyrics Search",
    path: "/search/lyrics",
    method: "GET",
    tag: "Search",
    description: "Fetch plain and synced (LRC) lyrics for any song via LRCLIB, including album art from iTunes.",
    example: "A Couple Minutes Olivia Dean",
    param: "q",
  },
  {
    id: "gsmarena",
    name: "GSM Arena Search",
    path: "/search/gsm",
    method: "GET",
    tag: "Search",
    description: "Search for mobile devices and retrieve detailed specifications from GSM Arena.",
    example: "iPhone 16 Pro",
    param: "q",
    extraParams: [
      { name: "url", description: "Direct URL to GSM Arena device page for detailed specs", example: "https://m.gsmarena.com/apple_iphone_16-13317.php", required: false },
    ],
  },
  // ── System ───────────────────────────────────────────────────────────────
  {
    id: "api-info",
    name: "API Status",
    path: "/info",
    method: "GET",
    tag: "System",
    description: "Check API status, uptime, and basic usage statistics.",
    example: "",
    param: "",
  },
  {
    id: "system-info",
    name: "System Info",
    path: "/system",
    method: "GET",
    tag: "System",
    description: "Retrieve server system information: OS, CPU, memory, and Node.js version.",
    example: "",
    param: "",
  },
];

export const tags = ["Downloader", "Search", "System"] as const;
export type Tag = typeof tags[number];
