import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const proxy = "https://cors.yardansh.com/";

const ytAudio = {
    headers: {
        "origin": "https://ytmp4.blog",
        "referer": "https://ytmp4.blog",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
    async download(url: string) {
        const api = `${proxy}https://api.ytmp3.tube/mp3/1?url=${encodeURIComponent(url)}`;
        const response = await fetch(api, { headers: this.headers });
        if (!response.ok) throw new Error("Gagal inisialisasi MP3");
        
        const html = await response.text();
        const match = html.match(/\{[^}]*?\\?["']videoId\\?["'][^}]*\}/);
        if (!match) throw new Error("Gagal ekstrak token MP3");
        
        const json = JSON.parse(match[0].replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        
        // Menggunakan bitrate tertinggi 320kbps
        const body = JSON.stringify({
            "id": json.videoId,
            "audioBitrate": "320",
            "token": json.token,
            "timestamp": json.timestamp,
            "secretToken": json.encryptedVideoId
        });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let json2: any = {};
        do {
            const response2 = await fetch(`${proxy}https://api.ytmp3.tube/api/download/mp3`, {
                headers: { 
                    ...this.headers, 
                    "origin": "https://api.ytmp3.tube", 
                    "referer": "https://api.ytmp3.tube/", 
                    "content-type": "application/json" 
                },
                body,
                method: "POST",
            });
            if (!response2.ok) throw new Error("Gagal mengambil status MP3");
            json2 = await response2.json();

            if (json2.status === "processing") {
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else if (json2.status === "fail") {
                throw new Error(json2.msg || "Server gagal memproses audio");
            }
        } while (json2.status === "processing");
        
        let videoId = "";
        const vMatch = url.match(/(?:v=|youtu\.be\/|\/shorts\/)([\w-]{11})/);
        if (vMatch) videoId = vMatch[1];

        return {
            title: json2.title || "YouTube Audio",
            thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : "",
            duration: json2.duration || 0,
            url: json2.link,
            ext: "MP3",
            quality: "320kbps"
        };
    }
};

async function ytVideo(url: string, resolusi: string) {
    const match = url.match(/(?:v=|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (!match) throw new Error("Invalid YouTube URL");
    const id = match[1];

    const baseUrl = 'https://dubs.io/wp-json/tools/v1';
    const headers = {
        'Referer': 'https://dubs.io/youtube-to-mp4-4k',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    };

    // Jika resolusi tidak ditentukan, paksa ambil 4k (tertinggi)
    const apiFormat = resolusi === 'max' ? '4k' : resolusi;
    const oke = await axios.get(`${proxy}${baseUrl}/download-video?id=${id}&format=${apiFormat}`, { headers });
    
    if (!oke.data.success || !oke.data.progressId) {
        throw new Error('Failed to get progress ID');
    }

    const { title, additionalInfo, progressId } = oke.data;
    const duration = additionalInfo?.duration || 0;

    let attempts = 0;
    while (attempts < 15) {
        const response = await axios.get(`${proxy}${baseUrl}/status-video?id=${progressId}`, { headers });
        if (response.data.downloadUrl) {
            return {
                title: title || "YouTube Video",
                thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                duration: duration,
                url: response.data.downloadUrl,
                ext: 'MP4',
                quality: apiFormat.toUpperCase()
            };
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    throw new Error("Video conversion timeout");
}

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl.searchParams.get("url");
        // Default resolusi diubah ke 'max' untuk kualitas tertinggi
        const resolusi = req.nextUrl.searchParams.get("resolusi") || "max";
        
        if (!url) throw new Error("URL is missing");

        const [audioResult, videoResult] = await Promise.allSettled([
            ytAudio.download(url),
            ytVideo(url, resolusi)
        ]);

        const mediaItems = [];
        let metadata = {
            title: "YouTube Media",
            thumbnail: "",
            duration: 0
        };

        if (videoResult.status === "fulfilled") {
            mediaItems.push({
                mediaExtension: videoResult.value.ext,
                mediaUrl: videoResult.value.url,
                quality: videoResult.value.quality
            });
            metadata = {
                title: videoResult.value.title,
                thumbnail: videoResult.value.thumbnail,
                duration: videoResult.value.duration
            };
        }

        if (audioResult.status === "fulfilled") {
            mediaItems.push({
                mediaExtension: audioResult.value.ext,
                mediaUrl: audioResult.value.url,
                quality: audioResult.value.quality
            });
            if (videoResult.status !== "fulfilled") {
                metadata = {
                    title: audioResult.value.title,
                    thumbnail: audioResult.value.thumbnail,
                    duration: audioResult.value.duration
                };
            }
        }

        if (mediaItems.length === 0) {
            throw new Error("Gagal mengekstrak media MP3 maupun MP4 dari server");
        }

        return NextResponse.json({
            success: true,
            video: metadata,
            download: {
                mediaItems: mediaItems
            }
        });

    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ success: false, message: (err as any).message }, { status: 500 });
    }
}