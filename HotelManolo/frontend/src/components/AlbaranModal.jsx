// src/components/AlbaranModal.jsx
import { useState } from "react";

export default function AlbaranModal({ albaran, onClose }) {
  const [tab, setTab] = useState("details");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded w-11/12 max-w-2xl shadow-lg">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setTab("details")}
            className={`flex-1 py-2 ${tab==="details" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Detalles
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`flex-1 py-2 ${tab==="preview" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Vista previa PDF
          </button>
        </div>

        {tab === "details" && (
          <div className="space-y-2">
            <p><strong>ID:</strong> {albaran.albaranId}</p>
            <p><strong>Archivo:</strong> {albaran.filename}</p>
            <p><strong>Fecha:</strong> {new Date(albaran.timestamp).toLocaleString()}</p>
          </div>
        )}

        {tab === "preview" && (
          <div className="h-96">
            <iframe
              src={`http://localhost:5001/uploads/${albaran.filename}`}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          </div>
        )}

        <div className="text-right mt-4">
          <button
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
