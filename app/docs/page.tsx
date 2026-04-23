"use client";

import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { endpoints, tags, type Tag, type EndpointConfig, getApiPath } from "@/config/endpoints";

/* ─── Tag color map ────────────────────────────────────────────────────── */
const tagColors: Record<string, string> = {
  Downloader: "var(--text)",
  Search:     "var(--text-muted)",
  System:     "var(--text-faint)",
};

/* ─── Copy button ──────────────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handle}
      className="btn btn-ghost"
      style={{ padding: "5px 12px", fontSize: 10, letterSpacing: "0.06em" }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

/* ─── JSON result panel ────────────────────────────────────────────────── */
function ResponsePanel({ data, ms }: { data: unknown; ms: number }) {
  const json = JSON.stringify(data, null, 2);
  const success = !!(data && typeof data === "object" && ("success" in (data as object) ? (data as { success: boolean }).success : "result" in (data as object) ? true : "status" in (data as object) ? (data as { status: boolean }).status : true));

  const handleSnap = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lune-api-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      title: "Snapped!",
      text: "JSON result has been downloaded.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: "var(--surface)",
      color: "var(--text)",
      customClass: { popup: "neobrutalism-popup" }
    });
  };
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: success ? "var(--green)" : "var(--red)", display: "block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: success ? "var(--green)" : "var(--red)", letterSpacing: "0.04em" }}>
            {success ? "200 OK" : "Error"}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{ms}ms</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSnap} className="btn btn-ghost" style={{ padding: "5px 12px", fontSize: 10 }}>📸 Snap</button>
          <CopyBtn text={json} />
        </div>
      </div>
      <div className="terminal">
        <div className="terminal-bar">
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c, i) => (
            <span key={i} className="terminal-dot" style={{ background: c, border: "none" }} />
          ))}
          <span style={{ marginLeft: 6, fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.06em", fontWeight: 700 }}>response — JSON</span>
        </div>
        <pre className="terminal-body" style={{ fontSize: 12, background: "#000" }}>
          <code style={{ color: "#fff" }}>{json}</code>
        </pre>
      </div>
    </div>
  );
}

/* ─── Request URL row ──────────────────────────────────────────────────── */
function RequestUrlRow({ url }: { url: string }) {
  return (
    <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface2)", border: "var(--border)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 11, color: "var(--teal)", flexShrink: 0, fontWeight: 700 }}>GET</span>
        <code style={{ fontSize: 11, color: "var(--text-muted)", wordBreak: "break-all", fontFamily: "var(--font-mono)" }}>{url}</code>
      </div>
      <CopyBtn text={url} />
    </div>
  );
}

/* ─── Single endpoint card ─────────────────────────────────────────────── */
function EndpointCard({ ep }: { ep: EndpointConfig }) {
  const [open, setOpen] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [reqUrl, setReqUrl] = useState("");
  const [ms, setMs] = useState(0);
  const [activeTab, setActiveTab] = useState<"js" | "python" | "php" | "go">("js");
  const mainRef = useRef<HTMLInputElement>(null);

  const allParams = [
    ...(ep.param ? [{ name: ep.param, description: `Main parameter for ${ep.name}`, example: ep.example, required: true }] : []),
    ...(ep.extraParams ?? []),
  ];

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://api.astralune.cv";
  const currentQs = allParams
    .map((p) => {
      const v = paramValues[p.name] || p.example || "";
      return v ? `${p.name}=${encodeURIComponent(v)}` : null;
    })
    .filter(Boolean)
    .join("&");
  
  const sampleUrl = `${baseUrl}${getApiPath(ep.path)}${currentQs ? "?" + currentQs : ""}`;

  const snippets = {
    js: `fetch("${sampleUrl}")\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    python: `import requests\n\nurl = "${sampleUrl}"\nresponse = requests.get(url)\nprint(response.json())`,
    php: `<?php\n\n$url = "${sampleUrl}";\n$response = file_get_contents($url);\n$data = json_decode($response, true);\nprint_r($data);`,
    go: `package main\n\nimport (\n  "fmt"\n  "io/ioutil"\n  "net/http"\n)\n\nfunc main() {\n  resp, _ := http.Get("${sampleUrl}")\n  body, _ := ioutil.ReadAll(resp.Body)\n  fmt.Println(string(body))\n}`,
  };

  const handleExecute = async () => {
    const mainVal = paramValues[ep.param] ?? "";
    
    if (ep.param && !mainVal.trim()) {
      Swal.fire({
        title: "Missing Parameter",
        text: `Please enter the ${ep.param} to continue.`,
        icon: "warning",
        background: "var(--surface)",
        color: "var(--text)",
        confirmButtonColor: "var(--accent)",
        confirmButtonText: "Got it!",
        customClass: {
          popup: "neobrutalism-popup",
        }
      });
      mainRef.current?.focus();
      return;
    }

    setLoading(true);
    setResponse(null);

    const qs = allParams
      .map((p) => {
        const v = paramValues[p.name] ?? "";
        return v.trim() ? `${p.name}=${encodeURIComponent(v.trim())}` : null;
      })
      .filter(Boolean)
      .join("&");

    const full = `${window.location.origin}${getApiPath(ep.path)}${qs ? "?" + qs : ""}`;
    setReqUrl(full);
    const t0 = Date.now();
    try {
      const r = await fetch(`${getApiPath(ep.path)}${qs ? "?" + qs : ""}`);
      const d = await r.json();
      setResponse(d);
    } catch (e: unknown) {
      setResponse({ success: false, message: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setMs(Date.now() - t0);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParamValues({});
    setResponse(null);
    setReqUrl("");
    setMs(0);
    mainRef.current?.focus();
  };

  return (
    <div className="endpoint-card" style={{ marginBottom: 12 }}>
      {/* Accordion header */}
      <div
        className="endpoint-header"
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <span className="method-badge">{ep.method}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{ep.name}</span>
          <code style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "none" }} className="path-code">{ep.path}</code>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <code style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{ep.path}</code>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-faint)" strokeWidth="2.5" strokeLinecap="round"
            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{ padding: "24px", borderTop: "1px solid var(--divider)", background: "var(--surface)" }}>
          {/* Description */}
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 24 }}>
            {ep.description}
          </p>

          {/* Parameters */}
          {allParams.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 12 }}>
                Parameters
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {allParams.map((p) => (
                  <div key={p.name}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <code style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{p.name}</code>
                      {p.required
                        ? <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: "var(--red)", color: "#fff", padding: "2px 7px", borderRadius: 4 }}>REQUIRED</span>
                        : <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: "var(--surface2)", color: "var(--text-faint)", border: "var(--border)", padding: "2px 7px", borderRadius: 4 }}>OPTIONAL</span>
                      }
                    </div>
                    <input
                      ref={p.name === ep.param ? mainRef : undefined}
                      type="text"
                      className="input-field"
                      placeholder={p.example || `Enter ${p.name}…`}
                      value={paramValues[p.name] ?? ""}
                      onChange={(e) => setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleExecute()}
                    />
                    {p.description && (
                      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 5, lineHeight: 1.6 }}>{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Snippets (Fitur 2) */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, borderBottom: "var(--border)", paddingBottom: 8 }}>
              {(["js", "python", "php", "go"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  style={{
                    fontSize: 10, fontWeight: 800, textTransform: "uppercase", padding: "4px 8px",
                    background: activeTab === lang ? "var(--text)" : "transparent",
                    color: activeTab === lang ? "var(--surface)" : "var(--text-faint)",
                    borderRadius: 4, cursor: "pointer", border: "none"
                  }}
                >
                  {lang === "js" ? "JavaScript" : lang}
                </button>
              ))}
            </div>
            <div style={{ background: "#000", borderRadius: 8, padding: 16, position: "relative" }}>
               <pre style={{ margin: 0, fontSize: 11, color: "#fff", fontFamily: "var(--font-mono)", overflowX: "auto" }}>
                 <code>{snippets[activeTab]}</code>
               </pre>
               <div style={{ position: "absolute", top: 8, right: 8 }}>
                 <CopyBtn text={snippets[activeTab]} />
               </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-black"
              onClick={handleExecute}
              disabled={loading}
              style={{ minWidth: 120 }}
            >
              {loading
                ? <><span className="loader" style={{ width: 14, height: 14, borderWidth: 2 }} />Running…</>
                : "▶ Execute"
              }
            </button>
            {(response !== null || reqUrl) && (
              <button className="btn btn-ghost" onClick={handleClear}>
                Clear
              </button>
            )}
          </div>

          {/* Request URL */}
          {reqUrl && <RequestUrlRow url={reqUrl} />}

          {/* Response */}
          {response !== null && <ResponsePanel data={response} ms={ms} />}
        </div>
      )}
    </div>
  );
}

/* ─── Docs page ────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [activeTag, setActiveTag] = useState<Tag | "All">("All");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = endpoints.filter((ep) => {
    const matchTag = activeTag === "All" || ep.tag === activeTag;
    const q = search.toLowerCase();
    const matchSearch = !q || ep.name.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  const grouped = (activeTag === "All" ? tags : [activeTag]).map((tag) => ({
    tag,
    items: filtered.filter((e) => e.tag === tag),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="page-container">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            BACK
          </button>
        </div>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: 8 }}>
          Explore API
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
          RestApi for Developers
        </p>
      </div>

      {/* ── Search + filter bar ────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        {/* Search input */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5" strokeLinecap="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoints…"
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Tag filters (Dropdown) */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowFilter(v => !v)}
            aria-label="Filter by category"
            className="theme-toggle"
            style={{
              width: 48, height: 48,
              background: activeTag !== "All" ? "var(--accent)" : "var(--surface)",
              color: activeTag !== "All" ? "var(--accent-text)" : "var(--text)",
            }}
            title="Filter by category"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            {activeTag !== "All" && (
              <span style={{
                position: "absolute", top: -6, right: -6,
                background: "var(--text)", color: "var(--surface)", borderRadius: "50%",
                width: 18, height: 18, fontSize: 9, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "var(--border)", fontFamily: "var(--font-mono)",
              }}>
                1
              </span>
            )}
          </button>

          {showFilter && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 12,
              width: 280,
              background: "var(--surface)",
              border: "var(--border)",
              boxShadow: "var(--shadow-lg)",
              borderRadius: "var(--radius)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 18px 12px" }}>
                <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Filter</span>
                {activeTag !== "All" && (
                  <button onClick={() => setActiveTag("All")} style={{ fontSize: 10, background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontWeight: 800, textDecoration: "underline" }}>
                    CLEAR
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 300, overflowY: "auto", padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                {(["All", ...tags] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTag(t as Tag | "All");
                      setShowFilter(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: activeTag === t ? "var(--accent)" : "var(--surface)",
                      color: activeTag === t ? "var(--accent-text)" : "var(--text)",
                      border: "var(--border)",
                      cursor: "pointer",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.15s"
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Endpoint groups ────────────────────────────────────────────── */}
      {grouped.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", border: "var(--border)", borderRadius: "var(--radius)", background: "var(--surface)" }}>
          <p style={{ fontSize: 13, color: "var(--text-faint)", letterSpacing: "0.04em" }}>No endpoints match your search.</p>
        </div>
      ) : (
        grouped.map(({ tag, items }) => (
          <div key={tag} style={{ marginBottom: 36 }}>
            {/* Group header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: "var(--border)" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: tagColors[tag] ?? "var(--text)", border: "var(--border)", display: "block", flexShrink: 0 }} />
              <h2 style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text)" }}>{tag}</h2>
              <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "var(--text-faint)", letterSpacing: "0.06em" }}>
                {items.length} EP
              </span>
            </div>
            {items.map((ep) => <EndpointCard key={ep.id} ep={ep} />)}
          </div>
        ))
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 48, borderTop: "var(--border)", paddingTop: 20 }}>
        <p style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
          © 2026 Lune Api. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
