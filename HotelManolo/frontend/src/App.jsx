import axios from "axios";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import ManageAlbaranes from "./components/ManageAlbaranes";

// Use relative URLs for all API requests so they work with the same-origin backend
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "";

export default function App() {
  const [logged, setLogged] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");
  const navigate = useNavigate();
  const location = useLocation();

  // Persist dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark);
  }, [dark]);

  // On mount, check session
  useEffect(() => {
    axios
      .get("/albaranes")
      .then(() => {
        setLogged(true);
        // Only redirect to / if on /login or /
        if (location.pathname === "/login" || location.pathname === "/") {
          navigate("/", { replace: true });
        }
        // Otherwise, stay on the current route (e.g., /manage)
      })
      .catch(() => {
        setLogged(false);
        navigate("/login", { replace: true });
      });
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    axios.post("/logout").finally(() => {
      setLogged(false);
      navigate("/login", { replace: true });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDark(d => !d)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          aria-label="Toggle Dark Mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={100} />
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            logged ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={() => setLogged(true)} />
            )
          }
        />

        {/* Private: Overview Dashboard */}
        <Route
          path="/"
          element={
            logged ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Private: Advanced Management */}
        <Route
          path="/manage"
          element={
            logged ? (
              <ManageAlbaranes onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={logged ? "/" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}
