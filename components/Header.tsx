"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Sidebar } from "./Sidebar";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
      aria-label="Toggle theme"
    >
      <div className="toggle-icon-wrap">
        <svg className="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2"  x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="4.22" y1="4.22"  x2="6.34" y2="6.34"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
          <line x1="2"  y1="12" x2="5"  y2="12"/>
          <line x1="19" y1="12" x2="22" y2="12"/>
          <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66"/>
          <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"/>
        </svg>
        <svg className="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
        </svg>
      </div>
    </button>
  );
}

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="glass sticky top-0 z-50">
        <div className="header-inner">
          {/* ── Brand ── */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 18, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                LuneApi
              </span>
            </div>

            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", padding: "4px 10px", border: "var(--border)", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", flexShrink: 0 }}>
              v2.0
            </span>
          </Link>

          {/* ── Controls ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <button
              className="theme-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
