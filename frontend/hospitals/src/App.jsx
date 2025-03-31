import { useContext, useEffect } from "react";

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
	const { token } = useContext(CredContext)

	return (
		<Routes>
			<Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />

			<Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
			<Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
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