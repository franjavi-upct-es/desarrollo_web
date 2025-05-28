import React from "react";
import Login from "./pages/Auth/Login";
import Home from "./pages/Dashboard/Home";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route path="/dashboard" exact element={<Home />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App;

const Root = () => {
    // Comprueba si el token existe en localStorage
    const isAuthenticated = !!localStorage.getItem("token");

    // Redirección al dashboard si está verificado, sino al login
    return isAuthenticated ? (
        <Navigate to="/dashboard" />
    ) : (
        <Navigate to="/login" />
    );
}