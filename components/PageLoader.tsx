export default function PageLoader() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      zIndex: 9999
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--text-muted)",
        letterSpacing: "0.05em"
      }}>
        Loading...
      </div>
    </div>
  );
}
