import { useContext, useEffect } from "react";

import { CredContext } from "../../../contexts/CredContext";


const Dashboard = () => {
    const {
        fullName, setFullName,
        aadharId, setAadharId_buf
    } = useContext(CredContext)

    const decodeToken = async () => {
        const data = await fetch(
            "http://127.0.0.1:5000/decode-token", {
            method: "POST", headers: { 
                "Content-Type": "application/json"
            }, body: JSON.stringify({ 
                token: localStorage.getItem("auth-token") 
            })
        }).then(data => data.json());

        sessionStorage.setItem("data", JSON.stringify(data));
        setAadharId_buf(data[0]); setFullName(data[1]);
    }

    useEffect(() => {
        let data = JSON.parse(sessionStorage.getItem("data"));

        if (data != null) { setAadharId_buf(data[0]);
            setFullName(data[1]); } else decodeToken();
    }, []);

    return (
        <div>
            {fullName}
        </div>
    );
};

export default Dashboard;