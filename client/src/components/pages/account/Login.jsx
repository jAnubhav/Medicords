import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [aadharId, setAadharId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); setError('');

        if (!aadharId.trim()) {
            setError('Please enter your Aadhar ID');
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        console.log('Login attempt with:', { aadharId, password });
    };

    const handleRedirect = link => {
        navigate(link);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-8 px-6 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-10 px-4 shadow sm:rounded-lg sm:px-8 w-full max-w-md mx-auto">
                    <button
                        onClick={() => handleRedirect("/")}
                        className="absolute top-6 left-6 flex items-center text-gray-300 hover:text-white text-xs sm:text-sm focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Home
                    </button>

                    <div className="flex justify-center items-center gap-3 mb-6">
                        <img
                            className="h-12 sm:h-12 w-auto"
                            src="logo.png"
                            alt="Medicords Logo"
                        />

                        <h1 className="text-white text-2xl sm:text-3xl font-bold">
                            Medicords
                        </h1>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500 text-white p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="aadharId" className="block text-xs sm:text-sm font-medium text-gray-300">
                                Aadhar ID
                            </label>
                            <div className="mt-1">
                                <input
                                    id="aadharId"
                                    name="aadharId"
                                    type="text"
                                    autoComplete="off"
                                    required
                                    value={aadharId}
                                    onChange={(e) => setAadharId(e.target.value)}
                                    className="appearance-none block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white text-xs sm:text-sm"
                                    placeholder="XXXX XXXX XXXX"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white text-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-2 bg-gray-800 text-gray-300">
                                    New to Medicords?
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <button
                                onClick={() => handleRedirect("/signup")}
                                className="w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create a new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;