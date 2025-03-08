import React from 'react';

import {
	BrowserRouter as Router,
	Route, Routes, useLocation
} from 'react-router-dom';

import Navbar from './components/navbar/Navbar';

import Home from './components/pages/Home';
import Partners from './components/pages/Partners';
import Affiliations from './components/pages/Affiliations';

import Sign from './components/pages/account';

const InnerApp = () => {
	const sign = ["/sign-in", "/create-account"];

	return (
		<>
			{!sign.includes(useLocation().pathname) && <Navbar />}

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/health-partners' element={<Partners />} />
				<Route path='/affiliations' element={<Affiliations />} />

				<Route path='/sign-in' element={<Sign inner={0} />} />
				<Route path='/create-account' element={<Sign inner={1} />} />
			</Routes>
		</>
	);
}

const App = () => {
	return (
		<Router> <InnerApp /> </Router>
	);
}

export default App;