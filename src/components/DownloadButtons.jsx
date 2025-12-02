import * as XLSX from "xlsx";

export default function DownloadButtons({ data }) {
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "result.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const keys = Object.keys(data[0]);
    const csv = [keys.join(","), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "result.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "result.xlsx");
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <button onClick={downloadJSON} style={{ marginRight: 10, padding: "10px 20px" }}>Скачать JSON</button>
      <button onClick={downloadCSV} style={{ marginRight: 10, padding: "10px 20px" }}>Скачать CSV</button>
      <button onClick={downloadXLSX} style={{ padding: "10px 20px" }}>Скачать XLSX</button>
    </div>
  );
}