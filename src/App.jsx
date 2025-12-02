import { useState } from "react";
import UrlInput from "./components/UrlInput";
import FileDropZone from "./components/FileDropZone";
import ProgressOverlay from "./components/ProgressOverlay";
import ResultDisplay from "./components/ResultDisplay";
import { handleFileLoad } from "./utils/fileHandler";
import { handleUrlLoad } from "./utils/urlHandler";

export default function App() {
  const [result, setResult] = useState(null);
  const [unmappedFields, setUnmappedFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setProgressText("Загрузка...");
    setResult(null);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", minHeight: "100vh" }}>
      <h1>Конвертер прайсов (Универсальный)</h1>

      {isLoading && <ProgressOverlay progress={progress} text={progressText} />}

      <div style={{ maxWidth: "90%", margin: "0 auto" }}>
        <UrlInput
          isLoading={isLoading}
          onLoad={(url) => handleUrlLoad({
            url, startLoading, setProgress, setProgressText, setResult, setUnmappedFields, setIsLoading
          })}
        />

        <FileDropZone
          isLoading={isLoading}
          onFile={(file) => handleFileLoad({
            file, startLoading, setProgress, setProgressText, setResult, setUnmappedFields, setIsLoading
          })}
        />

        {result && !isLoading && (
          <ResultDisplay result={result} unmappedFields={unmappedFields} />
        )}
      </div>
    </div>
  );
}