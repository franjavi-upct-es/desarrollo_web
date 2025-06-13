import axios from "axios";
import { useState } from "react";

const PDFUploader = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(f => formData.append("pdf", f));

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/extract-albaran",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const success = res.data.filter(r => !r.error);
      const failed = res.data.filter(r => r.error);

      if (success.length > 0) {
        alert(`✅ ${success.length} albarán(es) procesado(s) correctamente.`);
      }
      if (failed.length > 0) {
        alert(
          `⚠️ ${failed.length} archivo(s) con error:\n` +
          failed.map(f => `${f.filename}: ${f.error}`).join("\n")
        );
      }

      onSuccess();
      setFiles([]);
    } catch {
      alert("❌ Error general al procesar PDF(s)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <label className="min-w-96 min-h-80 border-4 border-dashed border-blue-400 rounded-xl flex items-center justify-center cursor-pointer">
        <label className="flex bg-blue-300 dark:bg-blue-100 rounded-xl items-center min-h-60 min-w-72 justify-center">
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={handleChange}
          />
          <span className="text-lg text-center">
            {files.length > 0
              ? `${files.length} archivo(s) seleccionado(s)`
              : "Añadir Albaránes"}
          </span>
        </label>
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Procesar"}
      </button>
    </div>
  );
};

export default PDFUploader;
