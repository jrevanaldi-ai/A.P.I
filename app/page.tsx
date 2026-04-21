"use client";

import Link from "next/link";
import { endpoints, tags } from "@/config/endpoints";

export default function Home() {
  const totalEndpoints = endpoints.length;
  const totalCategories = tags.length;

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", position: "relative" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ 
        position: "relative", 
        marginBottom: 48, 
        overflow: "hidden", 
        borderRadius: "var(--radius)", 
        border: "var(--border)",
        background: "var(--surface)",
        boxShadow: "var(--shadow-lg)"
      }}>
        <div style={{ position: "relative", zIndex: 1, padding: "52px 40px" }}>
          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
             <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--text)", display: "block", border: "var(--border)" }} />
             <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>System Online — v2.0</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, fontStyle: "italic", letterSpacing: "-2px", lineHeight: 1, color: "var(--text)", marginBottom: 16 }}>
            Simple.<br />Powerful.<br /><span style={{ WebkitTextStroke: "1.5px var(--text)", color: "transparent" }}>Fast.</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 480, marginBottom: 32, fontWeight: 500 }}>
            A seamless, high-performance REST API built for developers. Zero authentication required — power up ваure applications instantly with Lune Api.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
            padding: "32px 24px", 
            position: "relative", 
            overflow: "hidden",
            background: "var(--surface)",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ position: "absolute", top: 16, right: 20, fontSize: 52, opacity: 0.05, fontWeight: 900 }}>{icon}</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "var(--text)", marginBottom: 4, letterSpacing: "-1px" }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Getting Started ──────────────────────────────────────────────── */}
      <div className="card" style={{ padding: "32px 28px", marginBottom: 48 }}>
        <h3 className="section-title" style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "var(--text)", color: "var(--surface)", padding: "2px 8px", borderRadius: 4 }}>$</span> Getting Started
        </h3>

        <div className="steps-list" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
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
            <div key={n} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 38, height: 38, flexShrink: 0, background: "var(--accent)", color: "var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, borderRadius: 10, border: "var(--border)", boxShadow: "var(--shadow-sm)" }}>{n}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--divider)", paddingTop: 20 }}>
        <p style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
          © 2026 Lune Api. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
