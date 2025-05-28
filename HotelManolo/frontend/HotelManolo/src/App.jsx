import React from "react";
import Login from "./pages/Auth/Login";

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
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </Router>
        </div>
    )
}

export default App;