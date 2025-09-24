import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useState } from "react";
import { validateEmail } from "../../utils/helper.js";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector.jsx";
import Input from "../../components/Inputs/Input.jsx";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState("");

  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Por favor, introduce tu nombre completo.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, introduce un correo electrónico válido");
      return;
    }

    if (!password) {
      setError("Por favor, introduce la contraseña");
      return;
    }

    setError("");

    // SignUp API Call
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Crea una cuenta</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Introduces tus datos de inicio de sesión aquí abajo
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Nombre completo"
              placeholder="John Doe"
              type="text"
            />
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
              placeholder="Mínimo 8 caracteres"
              type="password"
            />
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setPassword(target.value)}
              label="Token de Administrador"
              placeholder="Cod. 6 dígitos"
              type="text"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            Registrarse
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            ¿Ya tienes una cuenta?{" "}
            <Link className="font-medium text-primary underline" to={"/login"}>
              Inicia Sesión
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
