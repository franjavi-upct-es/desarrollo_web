import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Input from "../../components/Inputs/Input";
import AuthLayout from "../../components/Layouts/AuthLayout";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!dni || !password) {
      setError("Rellena todos los campos");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/v1/auth/login", { dni, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nombreUsuario", res.data.nombre);
      setUserData({
        nombre: res.data.nombre,
        isAuthenticated: true,
        stats: null,
      });
      toast.success("Sessión iniciada correctamente");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <h3 className="text-xl font-semibold mb-4">Iniciar Sesión</h3>

        <Input
          label="DNI"
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="btn-primary mt-4">Entrar</button>
      </form>
    </AuthLayout>
  );
};

export default Login;
