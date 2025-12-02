import DownloadButtons from "./DownloadButtons";

export default function ResultDisplay({ result, unmappedFields }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ color: "#28a745" }}>
        Готово! Обработано {result.length} товаров
      </h3>

      <DownloadButtons data={result} />

      <div style={{
        marginTop: 20, maxHeight: 400, overflow: "auto", border: "1px solid #333",
        padding: 15, backgroundColor: "#000", borderRadius: 8, fontSize: 14
      }}>
        <strong style={{ color: "#0f0" }}>Предпросмотр (первые 3 товара):</strong>
        <pre style={{ color: "#fff" }}>
          {JSON.stringify(result.slice(0, 3), null, 2)}
          {result.length > 3 && "\n\n... и ещё " + (result.length - 3) + " товаров"}
        </pre>
      </div>

      {unmappedFields.length > 0 && (
        <div style={{
          marginTop: 20, padding: 15, backgroundColor: "#300",
          border: "1px solid #f00", borderRadius: 8, color: "#ff9999"
        }}>
          <strong>Неизвестные поля (добавлены в extra):</strong>
          <pre>{JSON.stringify(unmappedFields, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}