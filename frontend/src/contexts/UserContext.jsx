import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CredContext } from "./CredContext";

const UserContext = createContext();

const UserContainer = ({ children }) => {
    const {
        formData, setFormData, setToken, setStatus,
        shortenAadharId, shortenNationalId
    } = useContext(CredContext);

    const [errors, setErrors] = useState({});

    const nav = useNavigate();

    const validate = (type) => {
        const errs = {}, isPatient = type === "aadharId", id = formData[type];

        if (!id) errs[type] = `${isPatient ? 'Aadhar' : 'National'} ID is required`;
        else if (id.length !== (isPatient ? 14 : 11)) errs[type] = `${isPatient ?
            'Aadhar' : 'National'} ID must be exactly ${isPatient ? 12 : 10} digits`;
        
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
        else if (formData.password.length > 20) errs.password = 'Password cannot exceed 20 characters';
        
        setErrors(errs); return Object.keys(errs).length === 0;
    };

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

    const handleSubmit = async (e, url, clientId) => {
        e.preventDefault(); const [type, func] = clientId === "aadharId" ? 
            ["patients", shortenAadharId] : ["hospitals", shortenNationalId];
        
        if (!validate(clientId)) return;

        const res = await fetch(`http://localhost:5000/${url}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { ...formData, type, [clientId]: func(formData[clientId]) }
            )
        }).then(data => data.text());

        if (res === "Failure") {
            setErrors({ [clientId]: `No Account with this ${clientId.replace(/([A-Z])/g, 
                ' $1').replace(/^./, s => s.toUpperCase())} exists` }); return;
        } else if (res === "Password") {
            setErrors({ password: 'Incorrect Password' }); return;
        }

        if (url === "signup") {
            sessionStorage.setItem("cred", JSON.stringify({
                [clientId]: func(formData[clientId]), name: formData.name
            })); sessionStorage.setItem("records", JSON.stringify([]));
        }

        setFormData({ ...formData, [clientId]: func(formData[clientId]) });

        sessionStorage.setItem("status", type); setStatus(type);
        localStorage.setItem("token", res); setToken(res); nav("/");
    };


    return (
        <UserContext.Provider value={{ errors, handleChange, handleSubmit }}>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
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