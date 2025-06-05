import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import ExpenseChart from "../../components/UI/ExpenseChart";
import FilesTable from "../../components/UI/FilesTable";
import UploadPDFCard from "../../components/UI/UploadPDFCard";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { pdfPaths } from "../../utils/apiPaths";
import { formatDate } from "../../utils/helper";
import toast from "react-hot-toast";

const Home = () => {
  const { userData } = useContext(UserContext);
  const nombre = userData.nombre;
  const [archivos, setArchivos] = useState([])
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  useEffect(() => {
    fetchArchivos();
  }, []);

  const fetchArchivos = async () => {
    try {
      const res = await axiosInstance.get(pdfPaths.list);
      setArchivos(res.data);
    } catch (error) {
      console.error("Error al cargar archivos:", error);
      toast.error("No se pudieron cargar los archivos");
    }
  };

  const handleVerPDF = (url) => {
    setSelectedFileUrl(url);
  };

  const handleCerrarViewer = () => {
    setSelectedFileUrl(null);
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-semibold mb-4">Bienvenid@, {nombre}</h2>
      <UploadPDFCard onUpoadSuccess={fetchArchivos} />
      <ExpenseChart />
      <FilesTable
        archivos={archivos}
        onVerPDF={handleVerPDF}
        formatDate={formatDate}
      />
      {selectedFileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white w-[90vw] h-[90vh] rounded shadow-lg relative">
            <button
              onClick={handleCerrarViewer}
              className="absolute top-2 right-2 text-red-600 font-bold"
            >
              X
            </button>
            <iframe src={selectedFileUrl} title="Visor PDF" className="w-full h-full" />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Home;
