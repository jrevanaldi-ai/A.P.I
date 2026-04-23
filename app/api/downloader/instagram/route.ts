import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { checkMemoryUsage } from "@/lib/memory-guard";
import { isRateLimited, isValidUrl } from "@/lib/security";

export const dynamic = "force-dynamic";

function extractShortcode(url: string) {
    const match = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return match ? match[2] : null;
}

export async function GET(req: NextRequest) {
  const memoryCheck = checkMemoryUsage();
  if (memoryCheck) return memoryCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) return NextResponse.json({ success: false, message: "Terlalu banyak permintaan (Rate limit exceeded)" }, { status: 429 });

  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) throw new Error("URL is missing");

    if (!isValidUrl(url, ['instagram.com'])) {
      return NextResponse.json({ success: false, message: "URL tidak valid atau domain tidak didukung" }, { status: 400 });
    }

    const shortcode = extractShortcode(url);
    if (!shortcode) throw new Error("Invalid Instagram URL");

    const cleanUrl = `https://www.instagram.com/p/${shortcode}/`;

    const metadata = {
        title: "Instagram Post",
        author: "Unknown",
        thumbnail: ""
    };

    try {
        const embedRes = await axios.get(`${cleanUrl}embed/captioned/`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            timeout: 8000
        });
        
        const $ = cheerio.load(embedRes.data);
        
        const authorStr = $('.UsernameText').text() || $('.HoverCardUserName').text() || '';
        if (authorStr) metadata.author = authorStr.trim();

        let captionStr = $('.Caption').text() || $('.CaptionText').text() || '';
        if (captionStr) {
            captionStr = captionStr.trim();
            if (metadata.author && captionStr.startsWith(metadata.author)) {
                captionStr = captionStr.replace(metadata.author, '').trim();
            }
            metadata.title = captionStr || "Instagram Post";
        }

        const ogImage = $('meta[property="og:image"]').attr('content');
        const embedThumb = $('.EmbeddedMediaImage').attr('src');
        metadata.thumbnail = ogImage || embedThumb || "";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {}

    const body = new URLSearchParams();
    body.append("url", cleanUrl);

    const dgRes = await axios.post("https://api.downloadgram.org/media", body.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://downloadgram.org",
        "Referer": "https://downloadgram.org/",
      },
      timeout: 15000,
      validateStatus: () => true
    });

    if (dgRes.status !== 200) throw new Error(`Scraper failed with HTTP ${dgRes.status}`);

    let raw = String(dgRes.data);
    const match = raw.match(/innerHTML='([\s\S]+)'[,;]?\s*$/);
    if (match) raw = match[1];
    
    const html = JSON.parse('"' + raw.replace(/"/g, '\\"').replace(/\\x/g, '\\u00') + '"');
    const $dg = cheerio.load(html);
    
    const extractedImages: string[] = [];
    $dg("img").each((_, el) => {
        const src = $dg(el).attr("src");
        if (src && !src.includes("logo") && !extractedImages.includes(src)) {
            extractedImages.push(src);
        }
    });

    if (!metadata.thumbnail && extractedImages.length > 0) {
        metadata.thumbnail = extractedImages[0];
    }

    const extractedLinks: string[] = [];
    $dg('a[href*="cdn.downloadgram.org"]').each((_, el) => {
      const href = $dg(el).attr("href");
      if (href && !extractedLinks.includes(href)) extractedLinks.push(href);
    });

    const medias: { type: string, url: string, thumbnail: string }[] = [];

    extractedLinks.forEach((link, index) => {
      let type = "image";
      let itemThumb = extractedImages[index] || metadata.thumbnail;

      try {
        const tokenMatch = link.match(/token=([^&]+)/);
        if (tokenMatch) {
          const payload = JSON.parse(Buffer.from(tokenMatch[1].split(".")[1], "base64").toString());
          const filename = payload.filename || "";
          
          if (filename.match(/\.(mp4|mov|avi)/i)) {
              type = "video";
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {}

      if (type === "image") {
          itemThumb = link;
      }

      medias.push({ type, url: link, thumbnail: itemThumb });
    });

    if (medias.length === 0) throw new Error("Tidak ada media yang ditemukan. Pastikan link valid dan akun tidak di-private.");

    return NextResponse.json({ 
        success: true, 
        result: {
            title: metadata.title,
            author: metadata.author,
            thumbnail: metadata.thumbnail,
            medias: medias
        }
    });
    
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ success: false, message: (err as any).message }, { status: 500 });
  }
}