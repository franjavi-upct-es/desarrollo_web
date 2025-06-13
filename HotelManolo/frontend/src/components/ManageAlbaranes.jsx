import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "./MainLayout";

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

  useEffect(() => {
    fetchAlbaranes();
  }, []);

  const fetchAlbaranes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/albaranes", { withCredentials: true });
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
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return alert("Selecciona al menos uno");
    if (!confirm(`Eliminar ${selected.size} albarán(es)?`)) return;
    for (let id of selected) {
      try {
        await axios.delete(`http://localhost:5001/albaranes/${id}`, { withCredentials: true });
      } catch (e) {
        console.error("Error deleting", id, e);
      }
    }
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
                  onChange={e => {
                    if (e.target.checked) {
                      setSelected(new Set(filtered.map(a => a.id)));
                    } else {
                      setSelected(new Set());
                    }
                  }}
                  checked={filtered.length > 0 && selected.size === filtered.length}
                />
              </th>
              <th className="p-2 text-left">Archivo</th>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Fecha subida</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(a.id)}
                    onChange={() => toggleSelect(a.id)}
                  />
                </td>
                <td className="p-2">{a.filename}</td>
                <td className="p-2">{a.albaranId}</td>
                <td className="p-2">
                  {new Date(a.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
