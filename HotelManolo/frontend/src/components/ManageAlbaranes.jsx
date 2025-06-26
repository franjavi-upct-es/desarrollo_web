import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "./MainLayout";
import { FaRegEye } from "react-icons/fa";
import AlbaranModal from "./AlbaranModal";
import { toast } from "react-toastify";

const months = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function ManageAlbaranes({ onLogout }) {
  const [albaranes, setAlbaranes] = useState([]);
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetchAlbaranes();
  }, []);

  const fetchAlbaranes = async () => {
    try {
      const res = await axios.get("/albaranes", { withCredentials: true });
      setAlbaranes(res.data.reverse());
    } catch {
      console.error("Error cargando albaranes");
    }
  };

  const years = Array.from(
    new Set(albaranes.map(a => new Date(a.timestamp).getFullYear()))
  ).sort((a, b) => b - a);

  const filtered = albaranes.filter(a => {
    const d = new Date(a.timestamp);
    if (yearFilter !== "all" && d.getFullYear() !== +yearFilter) return false;
    if (monthFilter !== "all" && d.getMonth() !== +monthFilter) return false;
    return true;
  });

  const toggleSelect = id => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  const toggleSelectAll = checked => {
    if (checked) {
      const allIds = filtered.map(a => a._id);
      setSelected(new Set(allIds));
    } else {
      setSelected(new Set());
    }
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return toast.info("Selecciona al menos un albarán");

    if (!confirm(`¿Eliminar ${selected.size} albarán(es)?`)) return;

    let success = 0;
    let fail = 0;

    await Promise.all(
      Array.from(selected).map(async id => {
        try {
          await axios.delete(`/albaranes/${id}`, { withCredentials: true });
          success++;
        } catch {
          fail++;
        }
      })
    );

    if (success > 0) toast.success(`${success} eliminado(s)`);
    if (fail > 0) toast.error(`${fail} fallido(s)`);

    setSelected(new Set());
    fetchAlbaranes();
  };

  return (
    <MainLayout onLogout={onLogout} onUploadSuccess={fetchAlbaranes}>
      <h2 className="text-3xl font-bold text-center">Gestión Avanzada</h2>

      {/* Filters */}
      <div className="flex flex-wrap space-x-4 mb-4 dark:text-black">
        <select
          className="p-2 border rounded"
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
        >
          <option value="all">Todos los años</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          disabled={yearFilter === "all"}
        >
          <option value="all">Todos los meses</option>
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
        <button
          onClick={deleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={selected.size === 0}
        >
          Eliminar seleccionados ({selected.size})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={e => toggleSelectAll(e.target.checked)}
                  checked={filtered.length > 0 && selected.size === filtered.length}
                />
              </th>
              <th className="p-2 text-left">Archivo</th>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Fecha subida</th>
              <th className="p-2 text-center">Ver</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a._id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(a._id)}
                    onChange={() => toggleSelect(a._id)}
                  />
                </td>
                <td className="p-2">{a.filename}</td>
                <td className="p-2">{a.albaranId}</td>
                <td className="p-2">
                  {new Date(a.timestamp).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => {
                      setCurrent(a);
                      setModalOpen(true)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaRegEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && current && (
        <AlbaranModal
          albaran={current}
          onClose={() => setModalOpen(false)}
        />
      )}
    </MainLayout>
  );
}
