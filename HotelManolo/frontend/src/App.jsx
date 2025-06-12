import axios from "axios";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

axios.defaults.withCredentials = true;

const App = () => {
  const [logged, setLogged] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark);
  }, [dark]);

  useEffect(() => {
    axios.get("http://localhost:5001/albaranes")
      .then(() => setLogged(true))
      .catch(() => setLogged(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
      {logged
        ? <Dashboard onLogout={() => {
          axios.post("http://localhost:5001/logout").then(() => setLogged(false));
        }} />
        : <LoginPage onLogin={() => setLogged(true)} />
      }
    </div>
  );
};

export default App;
