"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/docs", label: "API Docs", icon: "◈" },
  { href: "/faq", label: "FAQ", icon: "?" },
];

const linkItems = [
  { href: "https://github.com", label: "GitHub", external: true },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 90,
          transition: "opacity 0.3s, visibility 0.3s",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
      />

      {/* Panel */}
      <aside style={{
        position: "fixed", top: 0, right: 0,
        height: "100%", width: 260,
        background: "var(--surface)",
        borderLeft: "var(--border)",
        boxShadow: "none",
        zIndex: 100,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        display: "flex", flexDirection: "column",
        fontFamily: "var(--font-mono)",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block" }} />
            ))}
            <span style={{ marginLeft: 6, fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.06em" }}>lune — nav</span>
          </div>
          <button onClick={onClose} className="theme-toggle" style={{ width: 32, height: 32 }} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <div style={{ padding: "20px 16px", flex: 1 }}>
          <p style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Navigation</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`sidebar-link${pathname === href ? " active" : ""}`}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          <p style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "20px 0 10px" }}>Links</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {linkItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--divider)" }}>
          <p style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.04em" }}>© 2026 Lune Api</p>
        </div>
      </aside>
    </>
  );
}
