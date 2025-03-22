import React from "react";
import {
	BrowserRouter as Router, 
	Routes, Route, useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/pages/Home";
import Partners from "./components/pages/Partners";
import Affiliations from "./components/pages/Affiliations";

import LoginPage from "./components/pages/account/Login";
import SignupPage from "./components/pages/account/Signup";

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

				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
			</Routes>
		</>
	);
};

const App = () => {
	return (
		<Router>
			<InnerApp />
		</Router>
	);
};

export default App;