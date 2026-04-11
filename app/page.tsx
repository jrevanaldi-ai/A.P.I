"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OpenApiData {
  tags?: { name: string }[];
  paths?: Record<string, Record<string, unknown>>;
}

export default function Home() {
  const [totalEndpoints, setTotalEndpoints] = useState<string | number>("—");
  const [totalCategories, setTotalCategories] = useState<string | number>("—");

  useEffect(() => {
    fetch("/assets/openapi.json")
      .then((r) => r.json())
      .then((data: OpenApiData) => {
        const cats = data.tags?.length ?? 0;
        let eps = 0;
        Object.values(data.paths ?? {}).forEach((p) => { eps += Object.keys(p).length; });
        setTotalEndpoints(eps);
        setTotalCategories(cats);
      })
      .catch(() => { setTotalEndpoints("N/A"); setTotalCategories("N/A"); });
  }, []);

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", position: "relative" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", marginBottom: 48, overflow: "hidden", borderRadius: "var(--radius)" }}>
        <div className="dot-grid" style={{ opacity: 0.15 }} />
        <div style={{ position: "relative", zIndex: 1, padding: "48px 40px" }}>
          {/* Terminal bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block", border: "1px solid rgba(0,0,0,0.12)" }} />
            ))}
            <span style={{ marginLeft: 6, fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.06em" }}>kiracloud-api — v2.0</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, fontStyle: "italic", letterSpacing: "-1px", lineHeight: 1.1, color: "var(--text)", marginBottom: 16 }}>
            Simple.<br />Powerful.<br /><span style={{ color: "var(--teal)" }}>Fast.</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 480, marginBottom: 28 }}>
            A seamless, high-performance REST API built for developers. Zero authentication required — just send a request and power up your applications instantly.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/docs" className="btn btn-black">Explore Docs →</Link>
            <Link href="/faq" className="btn btn-ghost">FAQ ↗</Link>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 48 }}>
        {[
          { label: "Total Endpoints", value: totalEndpoints, icon: "◈" },
          { label: "Categories", value: totalCategories, icon: "⊞" },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ 
            border: "var(--border)", 
            borderRadius: "var(--radius)", 
            padding: "28px 24px", 
            position: "relative", 
            overflow: "hidden",
            background: "var(--surface)",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ position: "absolute", top: 16, right: 20, fontSize: 48, opacity: 0.08, fontWeight: 900 }}>{icon}</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Getting Started ──────────────────────────────────────────────── */}
      <div className="getting-started" style={{ marginBottom: 48 }}>
        <h3 className="section-title" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "var(--teal)" }}>$</span> Getting Started
        </h3>

        <div className="steps-list" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            {
              n: "1",
              title: "Choose Your Category",
              desc: "Browse through available API categories on the docs page and select what you need.",
            },
            {
              n: "2",
              title: "Read the Docs",
              desc: "Check endpoint parameters, response format, and example usage.",
            },
            {
              n: "3",
              title: "Make Your Request",
              desc: "Send HTTP requests and integrate the JSON response into your app.",
            },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, background: "var(--text)", color: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, borderRadius: 8, border: "var(--border)" }}>{n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--divider)", paddingTop: 20 }}>
        <p style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
          © 2026 Kiracloud API. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
