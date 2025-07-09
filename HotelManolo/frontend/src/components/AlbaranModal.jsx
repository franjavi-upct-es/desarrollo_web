import { useState } from "react";

const BACKEND_URL = "http://localhost:5002" // || process.env.REACT_APP_BACKEND;

export default function AlbaranModal({ albaran, onClose }) {
  const [tab, setTab] = useState("details");

  const pdfUrl = albaran?.pdfFileId
    ? `${BACKEND_URL}/uploads/${albaran.pdfFileId}`
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded w-11/12 max-w-2xl shadow-lg">
        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setTab("details")}
            className={`flex-1 py-2 ${tab === "details" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Detalles
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`flex-1 py-2 ${tab === "preview" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Vista previa PDF
          </button>
        </div>

        {/* Tab: Detalles */}
        {tab === "details" && (
          <div className="space-y-2">
            <p><strong>ID:</strong> {albaran?.albaranId || "N/A"}</p>
            <p><strong>Archivo:</strong> {albaran?.filename || "N/A"}</p>
            <p><strong>Fecha:</strong> {albaran?.timestamp ? new Date(albaran.timestamp).toLocaleString() : "N/A"}</p>
            <p><strong>pdfFileId:</strong> {albaran?.pdfFileId || "N/A"}</p>
          </div>
        )}

        {/* Tab: Preview */}
        {tab === "preview" && (
          <div className="space-y-2">
            {albaran?.pdfFileId ? (
              <>
                <a
                  href={`https://hotel-manolo-ocr.onrender.com/uploads/${albaran.pdfFileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  🔎 Ver en nueva pestaña
                </a>
                <div className="h-96 border rounded overflow-hidden">
                  <iframe
                    src={`https://hotel-manolo-ocr.onrender.com/uploads/${albaran.pdfFileId}`}
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                </div>
              </>
            ) : (
              <p className="text-red-500">⚠️ Este albarán no tiene PDF asociado.</p>
            )}
          </div>
        )}

        {/* Cerrar */}
        <div className="text-right mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
