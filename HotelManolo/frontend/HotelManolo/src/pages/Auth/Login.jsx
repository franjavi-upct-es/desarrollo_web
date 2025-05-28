import React, { useState, useEffect } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";

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

        setError("");

    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Bienvenid@</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Introduce tus datos para iniciar sesión
                </p>

                <form>
                </form>
            </div>
        </AuthLayout>
    )
}
