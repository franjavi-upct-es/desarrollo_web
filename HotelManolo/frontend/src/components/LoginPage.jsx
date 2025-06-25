// src/components/LoginPage.jsx
import axios from "axios";
import { useState } from "react";
import AlbaranList from "./AlbaranList";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// --- Demo data for list ---
const demoAlbaranes = Array.from({ length: 3 }).map((_, i) => ({
  albaranId: `A24${Math.floor(10000 + Math.random() * 89999)}`,
  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
}));

// --- Demo data for chart ---
const demoCounts = Array.from({ length: 12 }).map(() =>
  Math.floor(Math.random() * 10)
);
const demoChartData = {
  labels: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  datasets: [
    {
      label: "Demo Gastos",
      data: demoCounts,
      backgroundColor: "#3b82f6",
      borderRadius: 8,
      barThickness: 40,
    },
  ],
};
const demoChartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { ticks: { stepSize: 1 } },
  },
};

// --- DemoChart component ---
function DemoChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center mb-4">Registro de Gastos</h3>
      <Bar data={demoChartData} options={demoChartOptions} />
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    console.log('🔐 Frontend: Attempting login with:', user);
    console.log('🌐 Frontend: Current URL:', window.location.href);
    try {
      console.log('📤 Frontend: Sending login request to /login');
      const response = await axios.post(
        "/login",
        { username: user, password: pwd },
        { withCredentials: true }
      );
      console.log('✅ Frontend: Login successful', response);
      onLogin();
    } catch (error) {
      console.log('❌ Frontend: Login failed', error);
      setErr("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="md:flex min-h-screen">
      {/* Left: Login Form */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center px-8 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Bienvenid@</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Introduce tus datos para iniciar sesión
        </p>

        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <label className="block font-semibold mb-1">
              Introduce tu DNI
            </label>
            <input
              type="text"
              placeholder="12345678A"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Introduce tu contraseña
            </label>
            <input
              type="password"
              placeholder="Min 8 caracteres"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700"
            />
          </div>
          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>

      {/* Right: Demo Dashboard */}
      <div className="md:w-1/2 hidden md:flex bg-cyan-100 dark:bg-cyan-900 p-8 overflow-y-auto items-center">
        <div className="w-full space-y-6">
          {/* Template Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Gestor de Facturas
            </h2>

            {/* Demo Chart */}
            <DemoChart />

            {/* Demo List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Vista previa de albaranes
              </h3>
              <AlbaranList albaranes={demoAlbaranes} readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
