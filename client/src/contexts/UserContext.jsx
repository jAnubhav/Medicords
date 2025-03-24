import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserContainer = ({ children }) => {
    const [fullName, setFullName] = useState('');
    const [aadharId, setAadharId] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRedirect = link => navigate(link);

    const setAadharId_buf = e => {
        if (e.length > 14) return; let last = e[e.length - 1];

        if (last != ' ' && (last < '0' || '9' < last)) return;

        let inputValue = e.replace(/\s/g, "");
        let formattedValue = inputValue.match(/.{1,4}/g)?.join(" ") || "";

        setAadharId(formattedValue);
    }

    return (
        <UserContext.Provider value={{
            fullName, setFullName,
            aadharId, setAadharId_buf,
            password, setPassword,
            error, setError, handleRedirect
        }}>
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

                        <div className="flex justify-center items-center gap-2 mb-6">
                            <img
                                className="h-12 sm:h-12 w-auto"
                                src="logo.png"
                                alt="Medicords Logo"
                            />

                            <h1 className="text-white text-2xl sm:text-3xl font-bold">
                                Medicords
                            </h1>
                        </div>

                        {children}

                    </div>
                </div>
            </div>
        </UserContext.Provider>
    );
};

export { UserContext, UserContainer }