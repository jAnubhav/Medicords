import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";

import CredContext, { BACKEND_URL } from "./CredContext";

// JWT expiration check utility
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

const UserContext = createContext();

const UserContainer = ({ children }) => {
    const {
        formData, setFormData, load, setLoad, setToken,
        setStatus, shortenAadharId, shortenNationalId
    } = useContext(CredContext);

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);

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
        setGeneralError(null);
        if (!validate(clientId)) return; setLoad(true);
        
        // Debug: Log the backend URL being used
        console.log("Using backend URL:", BACKEND_URL);
        
        try {
            const response = await fetch(`${BACKEND_URL}/${url}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { ...formData, type, [clientId]: func(formData[clientId]) }
                )
            });
            if (!response.ok) {
                setGeneralError("Server error. Please try again.");
                setLoad(false);
                console.error(`Server error: ${response.status}`);
                return;
            }
            const res = await response.text();
            if (res === "Failure") {
                setErrors({
                    [clientId]: `No Account with this ${clientId.replace(/([A-Z])/g, ' $1')
                        .replace(/^./, s => s.toUpperCase())} exists`
                }); setLoad(false); return;
            } else if (res === "Password") {
                setErrors({ password: 'Incorrect Password' }); setLoad(false); return;
            }
            if (url === "signup") {
                try {
                    sessionStorage.setItem("cred", JSON.stringify({
                        [clientId]: func(formData[clientId]), name: formData.name
                    }));
                    sessionStorage.setItem("records", JSON.stringify([]));
                } catch (err) {
                    console.error("Error saving signup data to sessionStorage:", err);
                }
            }
            setFormData({ ...formData, [clientId]: func(formData[clientId]) });
            try {
                if (!isTokenExpired(res)) {
                    localStorage.setItem("token", res);
                    setToken(res);
                } else {
                    setGeneralError("Received expired token. Please try again.");
                    setLoad(false);
                    return;
                }
            } catch (err) {
                setGeneralError("Error saving token. Please try again.");
                console.error("Error saving token:", err);
                setLoad(false);
                return;
            }
            try {
                sessionStorage.setItem("status", type);
            } catch {}
            setStatus(type); nav("/");
        } catch (err) {
            setGeneralError("Network error. Please try again.");
            console.error("Error in handleSubmit:", err);
        } finally {
            setLoad(false);
        }
    };

    return (
        <UserContext.Provider value={{ errors, handleChange, handleSubmit }}>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-gray-800 py-10 px-5 sm:px-10 rounded-xl shadow-lg">
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-10"> <img src="../logo.png" alt="Logo" /> </div>
                        <h1 className="text-3xl font-extrabold text-white">Medicords</h1>
                    </div>
                    {generalError && (
                        <div className="bg-red-800 text-red-100 p-4 rounded mb-4">
                            {generalError}
                        </div>
                    )}
                    {children}
                </div>
            </div> {load && (<Loader />)}
        </UserContext.Provider>
    );
};

export default UserContext;
export { UserContainer };