import { createContext, useState } from "react";

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [formData, setFormData] = useState({
        aadharId: '', fullName: '', password: '',
    });

    const [records, setRecords] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleChange = e => {
        let { name, value, type, checked } = e.target;

        if (name === "aadharId") {
            value = value.replace(/\D/g, ""); if (value.length > 12) return;
            let formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
    
            setFormData({ ...formData, [name]: formattedValue }); return;
        }

        setFormData({
            ...formData, [name]: type === 'checkbox' ? checked : value
        });
    };

    const shortenId = aadharId => aadharId.substring(0, 4) +
        aadharId.substring(5, 9) + aadharId.substring(10, 14);

    return (
        <CredContext.Provider value={{
            formData, setFormData, 
            handleChange, shortenId, 
            token, setToken,
            records, setRecords
        }}> {children} </CredContext.Provider>
    );
};

export { CredContainer, CredContext };