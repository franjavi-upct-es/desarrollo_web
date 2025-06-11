import axios from "axios";
import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5001/login",
        { username: user, password: pwd },
        { withCredentials: true }
      );
      onLogin();
    } catch {
      setErr("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
        {err && <p className="text-red-500">{err}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={user}
          className="w-full p-2 border rounded"
          onChange={e => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pwd}
          className="w-full p-2 border rounded"
          onChange={e => setPwd(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600" text-white py-2 rounded>
          Entrar
        </button>
      </form>
    </div>
  );
};
