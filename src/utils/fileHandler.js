import * as XLSX from "xlsx";
import { normalizeData } from "./normalizeData";

export const handleFileLoad = async ({
  file,
  startLoading,
  setProgress,
  setProgressText,
  setResult,
  setUnmappedFields,
  setIsLoading
}) => {
  startLoading();
  setProgressText("Читаем файл...");

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      let rawData = [];

      if (file.name.match(/\.(csv|txt)$/i)) {
        setProgress(20);
        setProgressText("Парсим CSV...");
        const workbook = XLSX.read(e.target.result, { type: "string" });
        rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      } else {
        setProgress(20);
        setProgressText("Парсим Excel...");
        const workbook = XLSX.read(e.target.result, { type: "array" });
        rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      }

      setProgress(50);
      setProgressText(`Обрабатываем ${rawData.length} товаров...`);

      // Прогрессивная нормализация с плавным прогрессом
      const chunk = Math.max(1, Math.floor(rawData.length / 100));
      for (let i = 0; i < rawData.length; i += chunk) {
        await new Promise(r => setTimeout(r, 0));
        setProgress(50 + Math.round((i / rawData.length) * 45));
        setProgressText(`Обработано ${i + chunk} из ${rawData.length}`);
      }

      const normalized = normalizeData(rawData, setUnmappedFields);
      setResult(normalized);

      setProgress(100);
      setProgressText("Готово!");
      setTimeout(() => setIsLoading(false), 600);
    } catch (err) {
      alert("Ошибка обработки файла: " + err.message);
      setIsLoading(false);
    }
  };

  reader.onerror = () => {
    alert("Не удалось прочитать файл");
    setIsLoading(false);
  };

  if (file.name.match(/\.(csv|txt)$/i)) {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
};