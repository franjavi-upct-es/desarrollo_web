import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

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
    let failCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("pdf", file);
      try {
        const res = await axios.post(
          "/ocr",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        if (res.data.albaranNumber) {
          successCount++;
        } else {
          failCount++;
          toast.warning(`⚠️ ${file.name}: No se encontró número de albarán`);
        }
      } catch (err) {
        failCount++;
        toast.error(`❌ ${file.name}: Error al procesar`);
      }
    }

    setLoading(false);
    setFiles([]);

    // Resumen final
    if (successCount > 0) {
      toast.success(`✅ ${successCount} albarán(es) procesado(s)`);
      onSuccess(); // solo si hubo alguno exitoso
    }
    if (failCount > 0) {
      toast.error(`❌ ${failCount} archivo(s) fallaron`);
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
