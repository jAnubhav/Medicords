import { createContext, useState } from "react";

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [formData, setFormData] = useState({
        aadharId: '', fullName: '', password: '',
    });

    const [records, setRecords] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const shortenId = aadharId => aadharId.substring(0, 4) +
        aadharId.substring(5, 9) + aadharId.substring(10, 14);

    return (
        <CredContext.Provider value={{
            formData, setFormData, 
            shortenId, token, setToken,
            records, setRecords
        }}> {children} </CredContext.Provider>
    );
};

export { CredContainer, CredContext };