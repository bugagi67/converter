import { FIELD_MAP } from "../constants/FIELD_MAP";

export const normalizeData = (arr, onUnmapped = () => {}) => {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const newUnmapped = new Set();
  const result = [];

  arr.forEach((item) => {
    const normalized = {
      id: null, sku: "", name: "", price: 0, quantity: 0,
      brand: "", category: "", description: "", image: "", images: [],
      currency: "RUB", available: true, params: {}, extra: {}
    };

    Object.keys(item).forEach((rawKey) => {
      let key = rawKey.trim().toLowerCase();
      const value = item[rawKey];
      if (value === null || value === undefined || value === "") return;

      const mappedKey = FIELD_MAP[key];
      if (mappedKey) {
        // ... (весь твой маппинг, как был)
        if (mappedKey === "images" || mappedKey === "image") {
          if (Array.isArray(value)) {
            normalized.images = value.filter(Boolean);
            if (!normalized.image && value[0]) normalized.image = value[0];
          } else if (typeof value === "string") {
            const urls = value.split(/[\s,;]+/).filter(Boolean);
            normalized.images = urls;
            if (!normalized.image) normalized.image = urls[0] || "";
          }
        } else if (mappedKey === "price") {
          normalized.price = parseFloat(String(value).replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
        } else if (mappedKey === "quantity") {
          normalized.quantity = parseInt(value, 10) || 0;
        } else if (mappedKey === "available") {
          normalized.available = String(value).toLowerCase() === "true" || value === true;
        } else {
          normalized[mappedKey] = String(value).trim();
        }
        return;
      }

      if (key.startsWith("param_")) {
        const paramName = key.slice(6).trim();
        const cleanName = paramName.charAt(0).toUpperCase() + paramName.slice(1).toLowerCase();
        normalized.params[cleanName] = String(value).trim();
        return;
      }

      if (key.startsWith("@")) {
        const attrName = key.slice(1);
        if (attrName === "id") normalized.id = String(value);
        normalized.extra[attrName] = value;
        return;
      }

      normalized.extra[key] = value;
      newUnmapped.add(rawKey);
    });

    if (!normalized.name) normalized.name = "Без названия";
    if (!normalized.sku && normalized.id) normalized.sku = normalized.id;

    result.push(normalized);
  });

  if (newUnmapped.size > 0) onUnmapped(Array.from(newUnmapped));
  return result;
};