import { createContext, useState } from "react";

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [formData, setFormData] = useState({
        aadharId: '', fullName: '', password: '',
    });

    const [token, setToken] = useState(localStorage.getItem("token"));
    const shortenId = aadharId => aadharId.replace(/\s+/g, "");

    return (
        <CredContext.Provider value={{
            formData, setFormData, 
            shortenId, token, setToken
        }}> {children} </CredContext.Provider>
    );
};

export { CredContainer, CredContext };