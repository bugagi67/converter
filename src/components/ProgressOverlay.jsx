export default function ProgressOverlay({ progress, text }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", zIndex: 9999, color: "white"
    }}>
      <div style={{ width: "80%", maxWidth: 600, textAlign: "center" }}>
        <div style={{
          width: 90, height: 90, border: "9px solid #333", borderTop: "9px solid #00e5ff",
          borderRadius: "50%", animation: "spin 1.3s linear infinite", margin: "0 auto 25px"
        }} />
        <h2 style={{ margin: 0, fontSize: 28 }}>{text || "Обработка..."}</h2>
        <p style={{ margin: "10px 0", fontSize: 20, opacity: 0.9 }}>
          {progress < 100 ? `${progress}%` : "Завершаем..."}
        </p>

        <div style={{ height: 36, background: "#222", borderRadius: 20, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #007bff, #00e5ff)",
            borderRadius: 20, transition: "width 0.4s ease", position: "relative"
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              animation: "shimmer 2s infinite"
            }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}