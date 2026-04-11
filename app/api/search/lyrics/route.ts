import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Strip kata-kata umum yang bukan bagian dari judul lagu
function cleanQuery(raw: string): string {
  return raw
    .replace(/^(lirik|lyrics|lagu|song|download|unduh|cari|search|teks|text)\s+/gi, "")
    .replace(/\s+(lirik|lyrics|lagu|song|full|official|video|mv|audio|hd)$/gi, "")
    .trim();
}

async function getThumbnail(title: string, artist: string): Promise<string> {
  try {
    const query = encodeURIComponent(`${title} ${artist}`);
    const res = await axios.get(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`,
      { timeout: 5000 }
    );
    const results = res.data?.results;
    if (results && results.length > 0) {
      return results[0].artworkUrl100?.replace("100x100bb", "600x600bb") || "-";
    }
    return "-";
  } catch {
    return "-";
  }
}

async function searchLrcLib(query: string) {
  const cleaned = cleanQuery(query);
  const res = await axios.get(
    `https://lrclib.net/api/search?q=${encodeURIComponent(cleaned)}`,
    {
      headers: {
        "User-Agent": "SimpleAPI/1.0 (https://github.com/NexRay)",
      },
      timeout: 10000,
    }
  );

  const results = res.data;
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Lyrics not found for the given query");
  }

  return results[0];
}

export async function GET(req: NextRequest) {
  const start = Date.now();

  try {
    const sp = req.nextUrl.searchParams;
    const query =
      sp.get("q") ||
      sp.get("url") ||
      (sp.get("title")
        ? `${sp.get("title")} ${sp.get("artist") ?? ""}`.trim()
        : null);

    if (!query) {
      throw new Error("Query parameter is required (use ?q=title+artist)");
    }

    const lrcData = await searchLrcLib(query);
    const thumbnail = await getThumbnail(lrcData.trackName, lrcData.artistName);

    const elapsed = Date.now() - start;

    return NextResponse.json({
      result: {
        title: lrcData.trackName,
        artist: lrcData.artistName,
        thumbnail,
        url: "-",
        lyrics: {
          id: lrcData.id,
          name: lrcData.trackName,
          track_name: lrcData.trackName,
          artist_name: lrcData.artistName,
          album_name: lrcData.albumName,
          duration: lrcData.duration,
          instrumental: lrcData.instrumental ?? "-",
          plain_lyrics: lrcData.plainLyrics ?? null,
          synced_lyrics: lrcData.syncedLyrics ?? null,
        },
      },
      timestamp: new Date().toISOString(),
      response_time: `${elapsed}ms`,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    const elapsed = Date.now() - start;
    const isNotFound =
      err.message?.toLowerCase().includes("not found") ||
      err?.response?.status === 404;

    return NextResponse.json(
      {
        error: isNotFound
          ? "Lyrics not found for the given query"
          : err.message,
        timestamp: new Date().toISOString(),
        response_time: `${elapsed}ms`,
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}