import React from "react";
import {
	BrowserRouter as Router, Routes, 
	Route, useLocation, Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/pages/Home";
import Partners from "./components/pages/Partners";
import Affiliations from "./components/pages/Affiliations";

import LoginPage from "./components/pages/account/Login";
import SignupPage from "./components/pages/account/Signup";

const InnerApp = () => {
	const href = useLocation().pathname;
	const accounts = ["/login", "/signup", "/dashboard"];

	const isAuth = () => localStorage.getItem("auth-token");

	return (
		<>
			{!accounts.includes(href) && <Navbar />}

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/health-partners" element={<Partners />} />
				<Route path="/affiliations" element={<Affiliations />} />

				<Route path="/login" element={isAuth() ? <Navigate to="/dashboard" /> : <LoginPage />} />
				<Route path="/signup" element={isAuth() ? <Navigate to="/dashboard" /> : <SignupPage />} />

				<Route path="/dashboard" element={(!isAuth()) ? <Navigate to="/" /> : <Home />} />
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