import { createContext, useState } from "react";

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [formData, setFormData] = useState({
        aadharId: '', fullName: '', password: '',
    });

    const handleChange = e => {
        const { name, value, type, checked } = e.target;

        if (name === 'aadharId' && value.length > 12) return;
        if (name === 'aadharId' && !/^\d*$/.test(value)) return;

        setFormData({
            ...formData, [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <CredContext.Provider value={{
            formData, handleChange
        }}> {children} </CredContext.Provider>
    );
};

export { CredContainer, CredContext };