import { useContext, useEffect } from "react";

import { CredContext } from "../../contexts/CredContext";

import MedicalRecordForm from "./elements/MedicalForm";

const Dashboard = () => {
    const {
        fullName, setFullName,
        setAadharId_buf, setAccAdd
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

        const { cred, acc_add } = data;

        sessionStorage.setItem("data", JSON.stringify(data));
        setAadharId_buf(cred[0]); setFullName(cred[1]);

        setAccAdd(acc_add)
    }

    useEffect(() => {
        let data = JSON.parse(sessionStorage.getItem("data"));

        if (data != null) {
            setAadharId_buf(data["cred"][0]);
            setFullName(data["cred"][1]);

            setAccAdd(data["rec"])
        } else decodeToken();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-center text-white">
                        Dashboard
                    </h1>
                    {fullName && (
                        <p className="text-center text-gray-400 mt-2">
                            Welcome, {fullName}
                        </p>
                    )}
                </header>
                
                <MedicalRecordForm />
            </div>
        </div>
    );
};

export default Dashboard;