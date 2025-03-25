import React from "react";
import {
	BrowserRouter as Router, Routes, 
	Route, useLocation, Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/pages/main/Home";
import Partners from "./components/pages/main/Partners";
import Affiliations from "./components/pages/main/Affiliations";

import LoginPage from "./components/pages/account/Login";
import SignupPage from "./components/pages/account/Signup";
import Dashboard from "./components/pages/account/Dashboard";

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
		<Router> <InnerApp /> </Router>
	);
};

export default App;