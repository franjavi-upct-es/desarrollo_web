import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {

  const { userData, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-1/4 bg-white shadow-md p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Hotel Manolo</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full text-left text-gray-700 hover:text-violet-600"
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:text-red-800"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout;
