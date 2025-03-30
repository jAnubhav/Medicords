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
	const { isAuth } = useContext(CredContext)

	return (
		<Routes>
			<Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />

			<Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
			<Route path="/signup" element={isAuth ? <Navigate to="/" /> : <Signup />} />
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