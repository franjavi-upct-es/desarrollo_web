import { useState } from "react";
import { FaRegEye, FaTrash } from "react-icons/fa";
import AlbaranModal from "./AlbaranModal";
import axios from "axios";

// Simple confirmation modal component
function ConfirmModal({ open, filename, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-lg">
        <p className="mb-4">
          ¿Eliminar <b>{filename}</b>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlbaranList({
  albaranes,
  refreshList,
  readOnly = false
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // New state for delete confirmation
  const [deletePending, setDeletePending] = useState(null);

  const handleDelete = async (id, filename) => {
    try {
      await axios.delete(
        `/albaranes/${id}`,
        { withCredentials: true }
      );
      alert("✅ Albarán eliminado");
    } catch (e) {
      console.error(e);
      alert("❌ Error al eliminar");
    } finally {
      setDeletePending(null);
      refreshList(); // Always refresh, even on error
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-2">
      {albaranes.map((alb, idx) => (
        <div key={idx} className="flex justify-between items-center border-b py-2">
          <span>
            Albarán {alb.albaranId} –{" "}
            {new Date(alb.timestamp).toLocaleString()}
          </span>
          {!readOnly && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelected(alb);
                  setModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaRegEye />
              </button>
              <button
                onClick={() => setDeletePending(alb)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      ))}

      {!readOnly && modalOpen && (
        <AlbaranModal
          albaran={selected}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={!!deletePending}
        filename={deletePending?.filename}
        onConfirm={() => handleDelete(deletePending?._id, deletePending?.filename)}
        onCancel={() => setDeletePending(null)}
      />
    </div>
  );
}