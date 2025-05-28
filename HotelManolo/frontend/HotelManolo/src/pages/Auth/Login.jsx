import React, { useState, useEffect } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";

const USERS = [
    { dni: "12345678A", password: "admin123", nombre: "Manolo" },
    { dni: "87654321B", password: "user456", nombre: "Ana" },
    // Agrega más usuarios aquí
];

const Login = () => {
    const [dni, setDni] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Login page mounted");
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!dni) {
            setError("Introduce el DNI.");
            return;
        }
        if (!password) {
            setError("Introduce la contraseña.");
            return;
        }

        const user = USERS.find(u => u.dni === dni && u.password === password);
        if (!user) {
            setError("DNI o contraseña incorrectos.");
            return;
        }

        setError("");
        // Guarda el nombre de pila en localStorage para usarlo en el dashboard
        localStorage.setItem("nombreUsuario", user.nombre);
        navigate("/dashboard");
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Bienvenid@</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Introduce tus datos para iniciar sesión
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={dni}
                        onChange={({ target }) => setDni(target.value)}
                        label="DNI"
                        placeholder="12345678A"
                        type="text"
                    />
                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Contraseña"
                        placeholder="Tu contraseña"
                        type="password"
                    />
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Iniciar sesión</button>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Login;