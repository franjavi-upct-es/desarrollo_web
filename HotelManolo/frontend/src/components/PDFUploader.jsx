import axios from "axios";
import { useState } from "react"

const PDFUploader = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5001/extract-albaran",
        formData
      );
      onSuccess();
    } catch {
      alert("Error al procesar PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="w-64 h-64 bg-blue-100 border-4 border-dashed border-blue-400 flex items-center justify-center text-center rounded-xl cursor-pointer">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />
        {file ? file.name : "Ingresar nuevo PDF"}
      </label>
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Procesar"}
      </button>
    </div>
  )
}

export default PDFUploader
