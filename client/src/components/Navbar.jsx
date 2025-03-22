import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <img
                                src="logo.png"
                                alt="Medicords Logo"
                                className="h-9"
                            />
                            <span className="ml-2 text-xl font-bold text-white">Medicords</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to={"/"} className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm">Home</Link>
                            <Link to={"/health-partners"} className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm">Health Partners</Link>
                            <Link to={"/affiliations"} className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm">Affiliations</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center">
                        <Link to={"/login"} className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm">Login</Link>
                        <Link to={"/signup"} className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-500">Signup</Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 focus:outline-none"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>

                            <svg
                                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>

                            <svg
                                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to={"/"} className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-sm">Home</Link>
                    <Link to={"/health-partners"} className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-sm">Health Partners</Link>
                    <Link to={"/affiliations"} className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-sm">Affiliations</Link>
                    <Link to={"/login"} className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-sm">Login</Link>
                    <Link to={"/signup"} className="bg-blue-600 text-white block px-3 py-2 m-2 rounded-md text-sm">Signup</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;