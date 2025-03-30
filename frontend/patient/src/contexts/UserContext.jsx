import { createContext, useState } from "react";

const UserContext = createContext();

const UserContainer = ({ children }) => {
    const [errors, setErrors] = useState({});

    return (
        <UserContext.Provider value={{ errors, setErrors }}>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-gray-800 py-12 px-5 sm:px-10 rounded-xl shadow-lg">
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-11"> <img src="./logo.png" alt="Logo" /> </div>
                        <h1 className="text-3xl font-extrabold text-white">Medicords</h1>
                    </div>

                    {children}
                </div>
            </div>
        </UserContext.Provider>
    );
};

export { UserContainer, UserContext };