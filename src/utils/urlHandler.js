import * as XLSX from "xlsx";
import { normalizeData } from "./normalizeData";

export const handleUrlLoad = async ({
  url,
  startLoading,
  setProgress,
  setProgressText,
  setResult,
  setUnmappedFields,
  setIsLoading,
}) => {
  startLoading();
  setProgressText("Подключаемся...");

  try {
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url);
    const res = await fetch(proxyUrl, {
      headers: { "x-requested-with": "XMLHttpRequest" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setProgress(20);
    setProgressText("Загружаем данные...");

    const ext = url.split(".").pop().toLowerCase();
    let rawData = [];

    if (ext === "csv" || res.headers.get("content-type")?.includes("csv")) {
      const text = await res.text();
      setProgress(40);
      setProgressText("Парсим CSV...");
      const wb = XLSX.read(text, { type: "string" });
      rawData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        defval: "",
      });
    } else if (["xls", "xlsx"].includes(ext)) {
      const buf = await res.arrayBuffer();
      setProgress(40);
      setProgressText("Парсим Excel...");
      const wb = XLSX.read(buf, { type: "array" });
      rawData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        defval: "",
      });
    } else if (ext === "xml" || ext === "yml") {
      const text = await res.text();
      if (!text.trim().startsWith("<")) throw new Error("Не XML/YML");

      setProgress(40);
      setProgressText("Парсим XML/YML...");

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      if (xml.querySelector("parsererror"))
        throw new Error("Ошибка парсинга XML");

      const offers = xml.querySelectorAll("offer, item, product, tovar, goods");
      if (offers.length === 0) throw new Error("Товары не найдены");

      rawData = Array.from(offers).map((el, i) => {
        if (i % 50 === 0) {
          setProgress(40 + Math.round((i / offers.length) * 20));
        }
        const obj = {};
        for (const attr of el.attributes) obj[`@${attr.name}`] = attr.value;
        el.childNodes.forEach((child) => {
          if (child.nodeType === 1) {
            const val = child.textContent?.trim();
            if (val) obj[child.nodeName] = val;
            if (child.nodeName === "param" && child.hasAttribute("name")) {
              obj[`param_${child.getAttribute("name")}`] = val;
            }
          }
        });
        return obj;
      });
    } else {
      throw new Error("Формат не поддерживается");
    }

    setProgress(70);
    setProgressText(`Нормализация ${rawData.length} товаров...`);

    const normalized = normalizeData(rawData, setUnmappedFields);
    setResult(normalized);

    setProgress(100);
    setProgressText("Готово!");
    setTimeout(() => setIsLoading(false), 700);
  } catch (err) {
    alert("Ошибка загрузки: " + err.message);
    setIsLoading(false);
  }
};
