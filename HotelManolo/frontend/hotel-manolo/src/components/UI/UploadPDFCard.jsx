import { useState } from "react"
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { pdfPaths } from "../../utils/apiPaths";

const UploadPDFCard = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Selecciona un archivo PDF");

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploading(true);
      const res = await axiosInstance.post(pdfPaths.add, formData);
      if (res.data.albaran) {
        toast.success(`Albarán procesado: ${res.data.albaran}`);
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
      } else {
        toast.error(res.data.error || "No se obtuvo albarán");
      }
    } catch (err) {
      toast.error("Error al subir el PDF");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-md font-semibold mb-2">Subir PDF</h3>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="btn-primary"
      >
        {uploading ? "Subiendo..." : "Subir y Procesar"}
      </button>
    </div>
  );
};

export default UploadPDFCard;
