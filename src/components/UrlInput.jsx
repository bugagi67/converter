export default function UrlInput({ isLoading, onLoad }) {
  return (
    <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Вставьте ссылку на .csv, .xml, .yml или .xlsx"
        id="urlInput"
        style={{ flex: 1, minWidth: 280, padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <button
        onClick={() => {
          const url = document.getElementById("urlInput").value.trim();
          if (url) onLoad(url);
        }}
        disabled={isLoading}
        style={{
          padding: "12px 20px", fontSize: 16,
          backgroundColor: "#1a1a1a", color: "white",
          border: "none", borderRadius: 6, cursor: isLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap"
        }}
      >
        Загрузить по ссылке
      </button>
    </div>
  );
}