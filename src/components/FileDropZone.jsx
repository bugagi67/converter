export default function FileDropZone({ isLoading, onFile }) {
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => e.preventDefault()}
      style={{
        border: "2px dashed #aaa", borderRadius: 12, padding: 50, textAlign: "center",
        cursor: "pointer", marginTop: 30, backgroundColor: "#435074ff",
        transition: "all 0.3s", opacity: isLoading ? 0.6 : 1
      }}
    >
      <p style={{ fontSize: 18, margin: "0 0 10px 0" }}>
        Перетащите файл сюда или кликните, чтобы выбрать
      </p>
      <input
        type="file"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
        disabled={isLoading}
        style={{ display: "none" }}
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        style={{
          display: "inline-block", marginTop: 10, padding: "12px 30px",
          backgroundColor: "#28a745", color: "white", borderRadius: 8,
          fontSize: 16, cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        {isLoading ? "Обрабатывается..." : "Выбрать файл"}
      </label>
    </div>
  );
}