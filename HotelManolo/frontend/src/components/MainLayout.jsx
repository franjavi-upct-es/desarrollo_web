import { useNavigate, useLocation } from "react-router-dom";
import PDFUploader from "./PDFUploader";

export default function MainLayout({ onLogout, onUploadSuccess, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isOverview = location.pathname === "/";
  const isManage = location.pathname === "/manage";

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel */}
      <div className="lg:w-1/3 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center border-r dark:border-gray-700 p-6 space-y-6 dark:text-gray-600">
        <h2 className="text-2xl font-bold">Bienvenid@</h2>
        <PDFUploader onSuccess={onUploadSuccess} />
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Right Panel */}
      <div className="lg:w-2/3 w-full p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto space-y-6">
        {/* Tab Nav */}
        <div className="flex border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => navigate("/")}
            className={`flex-1 py-3 text-center ${isOverview
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            Resumen
          </button>
          <button
            onClick={() => navigate("/manage")}
            className={`flex-1 py-3 text-center ${isManage
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            Gestión Avanzada
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
