import React, { useState, useEffect } from 'react';
import AuthLayout from "../../components/layouts/AuthLayout";
import {Link, useNavigate} from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import {validateEmail} from "../../utils/helper.js";

const Login = () => {
	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
	    console.log("Login page mounted");
	}, []);
    
    const handleLogin = async (e) => {
	e.preventDefault();

	if (!validateEmail(email)) {
	    setError("Introduce un correo válido.")
	    return;
	}
	if (!password) {
	    setError("Introduce la contraseña")
	    return;
	}

	setError("");

	// Login API call
    }

    return (
	<AuthLayout>
	    <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
		<h3 className="text-xl font-semibold text-black">Bienvenid@</h3>
		<p className="text-xs text-slate-700 mt-[5px] mb-6">
		    Introduce tus datos para iniciar sesión
		</p>

		<form onSubmit={handleLogin}>
		    <Input
			value={email}
			onChange={({ target }) => setEmail(target.value)}
			label="Email"
			placeholder="john@example.com"
			type="text"
		    />
		    
		    <Input
			value={password}
			onChange={({ target }) => setPassword(target.value)}
			label="Contraseña"
			placeholder="Min 8 caracteres"
			type="password"
		    />

		    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

		    <button type="submit" className="btn-primary">
			Iniciar sesión
		    </button>

		    <p className="text-[13px] text-slate-800 mt-3">
			¿Aún no te has registrado?{" "}
			<Link className="font-medium text-primary underline" to="/signup">
			    Registrate
			</Link>
		    </p>
		</form>
	    </div>
	</AuthLayout>
    )
}

export default Login;
