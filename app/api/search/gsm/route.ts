import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { load } from "cheerio";
import CryptoJS from "crypto-js";

class GsmScraper {
  private base_url = "https://m.gsmarena.com";
  private headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
    "Referer": "https://m.gsmarena.com/"
  };

  private decrypt(data: string, key: any, iv: any) {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(data) } as any,
        key,
        { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      return decrypted.toString(CryptoJS.enc.Utf8) || null;
    } catch {
      return null;
    }
  }

  private clean(text: string) {
    return typeof text === "string" ? text.replace(/\s+/g, " ").trim() : "";
  }

  async search(query: string) {
    const res = await axios.get(
      `${this.base_url}/resl.php3?sSearch=${encodeURIComponent(query)}`,
      { headers: this.headers }
    );
    const $ = load(res.data);
    let key, iv, data;

    $("script").each((_, el) => {
      const s = $(el).html() || "";
      if (s.includes("DATA") && s.includes("KEY") && s.includes("IV")) {
        key = s.match(/const KEY\s*=\s*"([^"]+)"/)?.[1];
        iv = s.match(/const IV\s*=\s*"([^"]+)"/)?.[1];
        data = s.match(/const DATA\s*=\s*"([^"]+)"/)?.[1];
        return false;
      }
    });

    if (!key || !iv || !data) return [];

    const html = this.decrypt(
      data,
      CryptoJS.enc.Base64.parse(key),
      CryptoJS.enc.Base64.parse(iv)
    );
    if (!html) return [];

    const $d = load(html);
    const results: any[] = [];
    $d(".swiper-half-slide").each((_, el) => {
      const title = this.clean($d(el).find("strong").text());
      let url = $d(el).find("a").attr("href") || "";
      if (url && !url.startsWith("http")) {
        url = this.base_url + (url.startsWith("/") ? url : "/" + url);
      }
      if (title) results.push({ title, url });
    });
    return results;
  }

  async detail(url: string) {
    const res = await axios.get(url, { headers: this.headers });
    const $ = load(res.data);

    const title = this.clean($("h1.section.nobor").text()) || "Unknown Device";
    const img = $(".specs-photo-main img").attr("src") || "";
    const specs: any[] = [];

    $("#specs-list table").each((_, table) => {
      const category = this.clean($(table).find("th").text()).toUpperCase();
      if (!category) return;
      const data: any[] = [];
      $(table).find("tr").each((_, tr) => {
        const label = this.clean($(tr).find(".ttl").text());
        const value = this.clean($(tr).find(".nfo").text());
        if (value) data.push({ label: label || "Info", value });
      });
      if (data.length) specs.push({ category, data });
    });

    return { title, img, specs };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const url = searchParams.get("url");

  const scraper = new GsmScraper();

  try {
    if (url) {
      const data = await scraper.detail(url);
      return NextResponse.json({ status: true, data });
    }

    if (query) {
      const results = await scraper.search(query);
      return NextResponse.json({ status: true, data: results });
    }

    return NextResponse.json(
      { status: false, message: "Provide 'q' for search or 'url' for details" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
