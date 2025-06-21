import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import Input from "../../inputs/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventeDefault();

    if (!validateEmail(email)) {
      setError("Por favor, introduce un correo electrónico válido")
      return;
    }
    if (!password) {
      setError("Por favor, introduce la contraseña")
      return;
    }

    setError("");

    // Login API Call

  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Bienvenid@</h3>
        <p className="text-xs test-slate-700 mt-[5px] mb-6">
          Por favor, introduce tus datos para iniciar sesión.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="jhon@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Contraseña"
            placeholder="Min. 8 caractéres"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">Iniciar Sesión</button>

          <p className="text-[13px] text-slate-800 mt-3">
            ¿Aún no te has registrado?{" "}
          </p>
          <Link className="font-medium text-primary underline" to="/signup">
            Regístrate
          </Link>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
