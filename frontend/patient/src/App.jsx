import {
	BrowserRouter as Router, Routes, Route
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import { CredContainer } from "./contexts/CredContext";

const App = () => {
	return (
		<CredContainer>
			<Router>
				<Routes>
					<Route path="/" element={<Dashboard />} />

					<Route path="/log-in" element={<Login />} />
					<Route path="/sign-up" element={<Signup />} />
				</Routes>
			</Router>
		</CredContainer>
	);
};

export default App;