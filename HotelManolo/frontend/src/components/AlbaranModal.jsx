import { useState } from "react";

export default function AlbaranModal({ albaran, onClose }) {
  const [tab, setTab] = useState("details");
  const [pdfError, setPdfError] = useState(false);

  const pdfUrl = `/uploads/${albaran?.filename}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded w-11/12 max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex border-b mb-4">
          <button
            type="button"
            onClick={() => setTab("details")}
            className={`flex-1 py-2 ${tab === "details" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Detalles
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex-1 py-2 ${tab === "preview" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Vista previa PDF
          </button>
        </div>

        {tab === "details" && (
          <div className="space-y-4">
            <p><strong>ID:</strong> {albaran?.albaranId || 'N/A'}</p>
            <p><strong>Archivo:</strong> {albaran?.filename || 'N/A'}</p>
            <p><strong>Fecha:</strong> {albaran?.timestamp ? new Date(albaran.timestamp).toLocaleString() : 'N/A'}</p>
            {albaran?.text && (
              <div>
                <p><strong>Texto extraído:</strong></p>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{albaran.text}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "preview" && (
          <div className="h-96 flex flex-col gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mb-2"
              download
            >
              Descargar PDF
            </a>
            <iframe
              src={pdfUrl}
              className="w-full h-full border rounded"
              title="PDF Preview"
              onError={() => setPdfError(true)}
            />
            {pdfError && (
              <div className="text-red-500 mt-2">
                No se pudo cargar el PDF. ¿Estás autenticado? ¿Existe el archivo?
              </div>
            )}
          </div>
        )}

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
