import { createContext, useState } from "react";

// Configurable backend URL (change as needed for prod/dev)
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Debug: Log the backend URL being used
console.log("Backend URL loaded:", BACKEND_URL);
console.log("Environment variable:", import.meta.env.VITE_BACKEND_URL);

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [formData, setFormData] = useState({
        aadharId: '', nationalId: '', name: '', password: ''
    });

    const [load, setLoad] = useState(false);

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [status, setStatus] = useState(sessionStorage.getItem("status") || "patients");

    const shortenAadharId = aadharId => aadharId.replace(/\s+/g, "");
    const shortenNationalId = nationalId => nationalId.replace(/\s+/g, "");

    return (
        <CredContext.Provider value={{
            formData, setFormData, load, setLoad,
            token, setToken, status, setStatus,
            shortenAadharId, shortenNationalId
        }}> {children} </CredContext.Provider>
    );
};

export default CredContext;
export { CredContainer };