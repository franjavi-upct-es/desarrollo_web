import axios from "axios";
import { useEffect, useState } from "react";
import PDFUploader from "./PDFUploader";
import GastosChart from "./GastosChart";
import AlbaranList from "./AlbaranList";

export default function Dashboard({ onLogout }) {
  const [albaranes, setAlbaranes] = useState([]);

  const fetchAlbaranes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/albaranes");
      setAlbaranes(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlbaranes();
  }, []);

  const latest4 = albaranes.slice(0, 4)

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Uploader Panel */}
      <div className="lg:w-1/3 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center border-r dark:border-gray-700 dark:text-black p-6 space-y-6">
        <h2 className="text-2xl font-bold">Bienvenid@</h2>
        <PDFUploader onSuccess={fetchAlbaranes} />
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Main Area */}
      <div className="lg:w-2/3 w-full p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Gestor de Albaranes y Facturas</h2>
        <GastosChart albaranes={albaranes} />
        <AlbaranList albaranes={latest4} />
      </div>
    </div>
  );
}
