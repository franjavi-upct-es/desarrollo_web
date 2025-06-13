import MainLayout from "./MainLayout";
import GastosChart from "./GastosChart";
import AlbaranList from "./AlbaranList";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ onLogout }) {
  const [albaranes, setAlbaranes] = useState([]);

  const fetchAlbaranes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/albaranes", { withCredentials: true });
      setAlbaranes(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlbaranes();
  }, []);

  const latest4 = albaranes.slice(0, 4);

  return (
    <MainLayout onLogout={onLogout} onUploadSuccess={fetchAlbaranes}>
      <h2 className="text-3xl font-bold text-center">Gestor de Albaranes y Facturas</h2>
      <GastosChart albaranes={albaranes} />
      <AlbaranList albaranes={latest4} refreshList={fetchAlbaranes} />
    </MainLayout>
  );
}
