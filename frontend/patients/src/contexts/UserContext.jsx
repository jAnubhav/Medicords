import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CredContext } from "./CredContext";

const UserContext = createContext();

const UserContainer = ({ children }) => {
    const { formData } = useContext(CredContext);

    const [errors, setErrors] = useState({});
    const nav = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.aadharId) {
            newErrors.aadharId = 'Aadhar ID is required';
        } else if (formData.aadharId.length !== 14) {
            newErrors.aadharId = 'Aadhar ID must be exactly 12 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (formData.password.length > 20) {
            newErrors.password = 'Password cannot exceed 20 characters';
        }

        setErrors(newErrors); return Object.keys(newErrors).length === 0;
    };

    return (
        <UserContext.Provider value={{ errors, setErrors, nav, validateForm }}>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-gray-800 py-10 px-5 sm:px-10 rounded-xl shadow-lg">
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-10"> <img src="./logo.png" alt="Logo" /> </div>
                        <h1 className="text-3xl font-extrabold text-white">Medicords</h1>
                    </div>

                    {children}
                </div>
            </div>
        </UserContext.Provider>
    );
};

export { UserContainer, UserContext };