import axios from "axios"
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

axios.defaults.withCredentials = true;

const App = () => {
  const [logged, setLogged] = useState(false);

  // Comprueba sesión activa
  useEffect(() => {
    axios.get("http://localhost:5001/albaranes")
      .then(() => setLogged(true))
      .catch(() => setLogged(false));
  }, [])

  return logged
    ? <Dashboard inLogout={() => {
      axios.post("http://localhost:5001/logout").then(() => setLogged(false));
    }} />
    : <LoginPage onLogin={() => setLogged(true)} />;
}

export default App;
