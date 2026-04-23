import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { checkMemoryUsage } from "@/lib/memory-guard";
import { isRateLimited, isValidUrl } from "@/lib/security";

export const dynamic = "force-dynamic";

const spotifyEmbed = {
    fmtMs(ms: number) {
        const m = Math.floor(ms / 60000);
        const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return `${m}:${s}`;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBiggestImage(images: any[]) {
        if (!images || images.length === 0) return "";
        return images.reduce((best, img) => {
            const bestWidth = best.maxWidth || best.width || 0;
            const currentWidth = img.maxWidth || img.width || 0;
            return currentWidth > bestWidth ? img : best;
        }, images[0]).url;
    },

    async getMetaData(url: string) {
        try {
            const match = url.match(/(track|album|playlist)\/([a-zA-Z0-9]+)/);
            if (!match) return null;
            
            const type = match[1];
            const id = match[2];

            const embedRes = await axios.get(`https://open.spotify.com/embed/${type}/${id}`, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html' 
                }
            });

            const nextDataMatch = embedRes.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
            if (!nextDataMatch) return null;

            const nextData = JSON.parse(nextDataMatch[1]);
            const entity = nextData.props.pageProps.state.data.entity;

            const coverUrl = entity.visualIdentity && entity.visualIdentity.image
                ? this.getBiggestImage(entity.visualIdentity.image)
                : "";

            if (type === 'track') {
                return {
                    title: entity.name,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    artist: entity.artists ? entity.artists.map((a: any) => a.name).join(', ') : entity.subtitle || "-",
                    release_date: entity.releaseDate ? entity.releaseDate.isoString.split('T')[0] : "-",
                    duration: this.fmtMs(entity.duration),
                    thumbnail: coverUrl,
                };
            }
            return null;
        } catch {
            return null;
        }
    }
};

const sdown = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    },
    baseUrl: 'https://spotidown.app',

    async getAudioLink(trackUrl: string) {
        const client = axios.create({
            baseURL: this.baseUrl,
            headers: this.headers,
            timeout: 10000,
            withCredentials: true
        });

        const homeRes = await client.get('/');
        const $home = cheerio.load(homeRes.data);
        
        const tokenName = $home('input[type="hidden"]').not('[name="g-recaptcha-response"]').attr('name');
        const tokenValue = $home('input[type="hidden"]').not('[name="g-recaptcha-response"]').attr('value');
        const cookie = homeRes.headers['set-cookie']?.[0]?.split(';')[0] || '';

        if (!tokenName || !tokenValue) throw new Error("Token Spotidown gagal diekstrak");

        const actionFormData = new URLSearchParams();
        actionFormData.append('url', trackUrl);
        actionFormData.append(tokenName, tokenValue);
        actionFormData.append('g-recaptcha-response', '');

        const actionRes = await client.post('/action', actionFormData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie,
                'Referer': `${this.baseUrl}/`
            }
        });

        if (actionRes.data.error) throw new Error("Spotidown menolak request action");

        const $action = cheerio.load(actionRes.data.data);
        const dataVal = $action('input[name="data"]').attr('value');
        const baseVal = $action('input[name="base"]').attr('value');
        const actionToken = $action('input[name="token"]').attr('value');

        if (!dataVal || !baseVal || !actionToken) throw new Error("Parameter track gagal diekstrak");

        const trackFormData = new URLSearchParams();
        trackFormData.append('data', dataVal);
        trackFormData.append('base', baseVal);
        trackFormData.append('token', actionToken);

        const trackRes = await client.post('/action/track', trackFormData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie,
                'Referer': `${this.baseUrl}/`
            }
        });

        if (trackRes.data.error) throw new Error("Gagal mengambil link download");

        const $track = cheerio.load(trackRes.data.data);
        const downloadUrl = $track('a.is-success').attr('href') || $track('a').attr('href');
        
        const fallbackTitle = trackRes.data.data.match(/title="([^"]+)"/)?.[1] || 'Unknown Title';
        const fallbackArtist = trackRes.data.data.match(/<span>([^<]+)<\/span>/)?.[1] || 'Unknown Artist';
        const fallbackThumbnail = $track('img').attr('src') || '';

        if (!downloadUrl) throw new Error("Audio URL tidak ditemukan");

        return { 
            url: downloadUrl, 
            fallbackTitle, 
            fallbackArtist, 
            fallbackThumbnail 
        };
    }
};

export async function GET(req: NextRequest) {
    const memoryCheck = checkMemoryUsage();
    if (memoryCheck) return memoryCheck;

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) return NextResponse.json({ success: false, message: "Terlalu banyak permintaan (Rate limit exceeded)" }, { status: 429 });

    try {
        const url = req.nextUrl.searchParams.get("url");
        if (!url) throw new Error("URL is missing");

        if (!isValidUrl(url, ['spotify.com', 'open.spotify.com'])) {
            return NextResponse.json({ success: false, message: "URL tidak valid atau domain tidak didukung" }, { status: 400 });
        }

        const [embedData, audioData] = await Promise.all([
            spotifyEmbed.getMetaData(url),
            sdown.getAudioLink(url)
        ]);

        const result = {
            title: embedData?.title || audioData.fallbackTitle,
            artist: embedData?.artist || audioData.fallbackArtist,
            duration: embedData?.duration || "-",
            release_date: embedData?.release_date || "-",
            thumbnail: embedData?.thumbnail || audioData.fallbackThumbnail,
            url: audioData.url
        };

        return NextResponse.json({
            status: true,
            result
        });
        
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ status: false, error: (error as any).message }, { status: 500 });
    }
}