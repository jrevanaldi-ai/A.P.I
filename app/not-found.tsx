"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", fontFamily: "var(--font-mono)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(var(--divider) 1px, transparent 1px)",
        backgroundSize: "28px 28px", opacity: 0.5,
      }} />

      {/* Ghost 404 */}
      <div style={{
        fontSize: "clamp(72px,16vw,140px)", fontWeight: 900, fontStyle: "italic",
        letterSpacing: "-4px", lineHeight: 0.9, color: "transparent",
        WebkitTextStroke: "2px var(--border-color)", userSelect: "none",
        marginBottom: -6, position: "relative", zIndex: 1,
      }}>404</div>

      {/* Card */}
      <div style={{
        background: "var(--surface)", border: "var(--border)",
        borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)",
        padding: "28px 28px", maxWidth: 400, width: "100%",
        textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--divider)" }}>
          {["#ff5f56","#ffbd2e","#27c93f"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
          ))}
          <span style={{ marginLeft: 6, fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.06em" }}>kiracloud — error</span>
        </div>
        <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text)", marginBottom: 8, textTransform: "uppercase" }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 22 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ background: "var(--surface2)", border: "var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
          <span style={{ fontSize: 11, color: "var(--teal)" }}>$</span>{" "}
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>GET</span>{" "}
          <span style={{ fontSize: 11, color: "var(--red)" }}>→ 404 Not Found</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" className="btn btn-black" style={{ flex: 1 }}>← Home</Link>
          <Link href="/docs" className="btn btn-teal" style={{ flex: 1 }}>Docs</Link>
        </div>
      </div>
    </div>
  );
}
