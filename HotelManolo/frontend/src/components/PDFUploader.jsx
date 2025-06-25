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
    setLoading(true);
    let successCount = 0;
    for (const file of files) {
      const formData = new FormData();
      formData.append("pdf", file);
      try {
        const res = await axios.post(
          "/ocr",
          formData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );
        if (res.data.albaranNumber) {
          alert(`✅ ${file.name}: Albarán procesado: ${res.data.albaranNumber}`);
        } else {
          alert(`⚠️ ${file.name}: No se encontró número de albarán en el PDF`);
        }
        successCount++;
      } catch (err) {
        alert(`❌ ${file.name}: Error al procesar PDF`);
      }
    }
    setLoading(false);
    setFiles([]);
    if (successCount > 0) onSuccess();
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
