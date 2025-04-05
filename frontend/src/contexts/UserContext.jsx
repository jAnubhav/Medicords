import { createContext, useContext, useState } from "react";

import { CredContext } from "./CredContext";

const UserContext = createContext();

const UserContainer = ({ children }) => {
    const { 
        formData, setFormData
    } = useContext(CredContext);

    const [errors, setErrors] = useState({});

    const handleChange = e => {
        let { name, value } = e.target;

        if (name === "aadharId") {
            value = value.replace(/\D/g, ""); if (value.length > 12) return;
            value = value.replace(/(\d{4})/g, "$1 ").trim();
        }

        if (name === "nationalId") {
            value = value.replace(/\D/g, ""); if (value.length > 10) return;
            value = value.replace(/(\d{5})/g, "$1 ").trim();
        }

        setFormData({ ...formData, [name]: value });
    };

    const validateAadharId = newErrors => {
        if (!formData.aadharId) {
            newErrors.aadharId = 'Aadhar ID is required';
        } else if (formData.aadharId.length !== 14) {
            newErrors.aadharId = 'Aadhar ID must be exactly 12 digits';
        }
    };

    const validateNationalId = newErrors => {
        if (!formData.nationalId) {
            newErrors.nationalId = 'National ID is required';
        } else if (formData.nationalId.length !== 11) {
            newErrors.nationalId = 'National ID must be exactly 10 digits';
        }
    }
    
    const validatePassword = newErrors => {
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (formData.password.length > 20) {
            newErrors.password = 'Password cannot exceed 20 characters';
        }
    };

    const validatePatient = () => {
        const errs = {}; validateAadharId(errs); validatePassword(errs);
        setErrors(errs); return Object.keys(errs).length === 0;
    };

    const validateHospital = () => {
        const errs = {}; validateNationalId(errs); validatePassword(errs);
        setErrors(errs); return Object.keys(errs).length === 0;
    };

    return (
        <UserContext.Provider value={{
            errors, setErrors, handleChange, 
            validatePatient, validateHospital
        }}> <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-gray-800 py-10 px-5 sm:px-10 rounded-xl shadow-lg">
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-10"> <img src="../logo.png" alt="Logo" /> </div>
                        <h1 className="text-3xl font-extrabold text-white">Medicords</h1>
                    </div>

                    {children}
                </div>
            </div>
        </UserContext.Provider>
    );
};

export { UserContainer, UserContext };