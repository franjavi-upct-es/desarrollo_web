import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import AlbaranModal from "./AlbaranModal";

export default function AlbaranList({ albaranes, readOnly = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-2">
      {albaranes.map((alb, idx) => (
        <div key={idx} className="flex justify-between items-center border-b py-2">
          <span>
            Albarán {alb.albaranId} - {new Date(alb.timestamp).toLocaleString()}
          </span>
          {!readOnly && (
            <button
              onClick={() => {
                setSelected(alb);
                setModalOpen(true);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaRegEye />
            </button>
          )}
        </div>
      ))}

      {!readOnly && modalOpen && (
        <AlbaranModal albaran={selected} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
