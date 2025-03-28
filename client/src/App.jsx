import React from "react";
import {
	BrowserRouter as Router, Routes,
	Route, useLocation, Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/main/Home";
import Partners from "./pages/main/Partners";
import Affiliations from "./pages/main/Affiliations";

import LoginPage from "./pages/account/Login";
import SignupPage from "./pages/account/Signup";
import Dashboard from "./pages/account/Dashboard";

import { CredContainer } from "./contexts/CredContext";

import { isAuth } from "./utility";

const InnerApp = () => {
	const href = useLocation().pathname;
	const accounts = ["/login", "/signup"];

	return (
		<>
			{!accounts.includes(href) && <Navbar />}

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/health-partners" element={<Partners />} />
				<Route path="/affiliations" element={<Affiliations />} />

				<Route path="/login" element={isAuth() ? <Navigate to="/dashboard" /> : <LoginPage />} />
				<Route path="/signup" element={isAuth() ? <Navigate to="/dashboard" /> : <SignupPage />} />

				<Route path="/dashboard" element={(!isAuth()) ? <Navigate to="/" /> : <Dashboard />} />
			</Routes>
		</>
	);
};

const App = () => {
	return (
		<Router>
			<CredContainer>
				<InnerApp />
			</CredContainer>
		</Router>
	);
};

export default App;