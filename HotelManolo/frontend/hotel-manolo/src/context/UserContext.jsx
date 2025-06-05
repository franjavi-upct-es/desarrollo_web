import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { dashboardPaths } from "../utils/apiPaths";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    nombre: localStorage.getItem("nombreUsuario") || "",
    isAuthenticated: !!localStorage.getItem("token"),
    stats: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!userData.isAuthenticated) return;
      try {
        const res = await axiosInstance.get(dashboardPaths.stats);
        setUserData((prev) => ({ ...prev, stats: res.data }));
      } catch (error) {
        console.error("Error al obtener estadísticas", error);
      }
    };
    fetchStats();
  }, [userData.isAuthenticated]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreUsuario");
    setUserData({ nombre: "", isAuthenticated: false, stats: null });
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};
