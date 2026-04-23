import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { checkMemoryUsage } from "@/lib/memory-guard";
import { isRateLimited, isValidUrl } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const memoryCheck = checkMemoryUsage();
    if (memoryCheck) return memoryCheck;

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) return NextResponse.json({ success: false, message: "Terlalu banyak permintaan (Rate limit exceeded)" }, { status: 429 });

    try {
        const url = req.nextUrl.searchParams.get("url");
        if (!url) throw new Error("URL is missing");

        if (!isValidUrl(url, ['tiktok.com', 'vt.tiktok.com'])) {
            return NextResponse.json({ success: false, message: "URL tidak valid atau domain tidak didukung" }, { status: 400 });
        }

        const { data } = await axios.post(
            'https://cors.yardansh.com/https://tikdownloader.io/api/ajaxSearch',
            new URLSearchParams({
                q: url,
                lang: 'en'
            }).toString(),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'referer': 'https://tikdownloader.io/en'
                }
            }
        );

        if (data.status !== 'ok') {
            throw new Error("Gagal mengambil data dari server");
        }

        if (typeof data.data !== 'string') {
            throw new Error(`Expected HTML string, got ${typeof data.data}: ${JSON.stringify(data.data).slice(0, 100)}`);
        }

        const $ = cheerio.load(data.data);
        const title = $('h3').text().trim() || "TikTok Video";
        const thumbnail = $('.thumbnail img').attr('src') || "";

        const downloads: { type: string, url: string }[] = [];
        const images: string[] = [];

        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && !src.includes('avatar') && src !== thumbnail && !src.includes('logo')) {
                images.push(src);
            }
        });

        $('.tik-button-dl').each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            const href = $(el).attr('href');

            if (href && href !== '#') {
                let type = "mp4";
                if (text.includes('hd')) type = "hd";
                else if (text.includes('audio') || text.includes('mp3') || text.includes('music')) type = "mp3";
                else if (text.includes('watermark')) type = "watermark";
                else if (text.includes('image') || text.includes('photo') || text.includes('slide')) type = "image";
                
                downloads.push({ type, url: href });
            }
        });

        const uniqueImages = [...new Set(images)];
        uniqueImages.forEach(img => {
            downloads.push({ type: "image", url: img });
        });

        if (downloads.length === 0) {
            throw new Error("Gagal menemukan link download media");
        }

        return NextResponse.json({
            success: true,
            result: {
                title,
                thumbnail,
                downloads
            }
        });

    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ success: false, message: (err as any).message }, { status: 500 });
    }
}