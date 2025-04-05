import { useContext } from "react";

import {
    BrowserRouter as Router,
    Routes, Route, Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import {
    CredContainer, CredContext
} from "./contexts/CredContext";

const InnerApp = () => {
    const { token, status } = useContext(CredContext)

    console.log(status)

    return (
        <Routes>
            <Route path="/" element={token ? <Dashboard /> : <Navigate to={`/${status}/login`} />} />

            <Route path="/patients/login" element={token ? <Navigate to="/" /> : <Login type="patients" />} />
            <Route path="/patients/signup" element={token ? <Navigate to="/" /> : <Signup type="patients" />} />

            <Route path="/hospitals/login" element={token ? <Navigate to="/" /> : <Login type="hospitals" />} />
            <Route path="/hospitals/signup" element={token ? <Navigate to="/" /> : <Signup type="hospitals" />} />
        </Routes>
    );
};

const App = () => {
    return (
        <CredContainer>
            <Router> <InnerApp /> </Router>
        </CredContainer>
    )
}

export default App;