import { createContext, useState } from "react";

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [formData, setFormData] = useState({
        nationalId: '', hospitalName: '', password: '',
    });

    const [records, setRecords] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const shortenId = nationalId => nationalId.substring(0, 4) +
        nationalId.substring(5, 9) + nationalId.substring(10, 14);

    return (
        <CredContext.Provider value={{
            formData, setFormData, 
            shortenId, token, setToken,
            records, setRecords
        }}> {children} </CredContext.Provider>
    );
};

export { CredContainer, CredContext };