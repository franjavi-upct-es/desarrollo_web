import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from "./pages/Auth/Login";
import Home from "./pages/Dashboard/Home";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </Router>
      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

export default App;
