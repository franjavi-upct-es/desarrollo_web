import { useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import ProfilePhotoSelector from "../../inputs/ProfilePhotoSelector";

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

    return (
      <AuthLayout>
        <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Crea una cuenta</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">
            Únete a nosotros introduciendo tus datos debajo.
          </p>

          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
          </form>
        </div>
      </AuthLayout>
    );
  };
};

export default SignUp;
