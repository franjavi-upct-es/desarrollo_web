import { useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import ProfilePhotoSelector from "../../inputs/ProfilePhotoSelector";
import Input from "../../inputs/Input";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);

  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventeDefault();

    if (!fullName) {
      setError("Por favor, introduce tu nombre completo")
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, introduce un correo electrónico válido")
      return;
    }

    if (!password) {
      setError("Por favor, introduce la contraseña")
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
          Únete a nosotros introduciendo tus datos debajo.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Nombre completo"
              placeholder="Jhon"
              type="text"
            />

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

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Admin Token"
              placeholder="Código de 6 Dígitos"
              type="text"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">Regístrate</button>

          <p className="text-[13px] text-slate-800 mt-3">
            ¿Ya tienes una cuenta?{" "}
          </p>
          <Link className="font-medium text-primary underline" to="/login">
            Inicia Sesión
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
