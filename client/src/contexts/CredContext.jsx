import { createContext, useState } from "react";

const CredContext = createContext();

const CredContainer = ({ children }) => {
    const [fullName, setFullName] = useState('');
    const [aadharId, setAadharId] = useState('');
    const [password, setPassword] = useState('');

    const [accAdd, setAccAdd] = useState('');

    const setAadharId_buf = e => {
        if (e.length > 14) return; let last = e[e.length - 1];

        if (last != ' ' && (last < '0' || '9' < last)) return;

        let inputValue = e.replace(/\s/g, "");
        let formattedValue = inputValue.match(/.{1,4}/g)?.join(" ") || "";

        setAadharId(formattedValue);
    }

    return (
        <CredContext.Provider value={{
            fullName, setFullName,
            aadharId, setAadharId_buf,
            password, setPassword,
            accAdd, setAccAdd
        }}> {children} </CredContext.Provider>
    );
};

export { CredContainer, CredContext };