import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CredContext } from "../contexts/CredContext";

const Dashboard = () => {
    const {
        formData, setFormData, token, setToken
    } = useContext(CredContext);

    const [records, setRecords] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/get-patient-data", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({ "token": token })
            }).then(data => data.json());

            if (res["cred"] === "Failure") {
                setToken(null); localStorage.removeItem("token"); nav("/login");
            }

            setFormData({ ...res["cred"] }); setRecords(res["records"]);

            sessionStorage.setItem("cred", JSON.stringify(res["cred"]));
            sessionStorage.setItem("records", JSON.stringify(res["records"]));
        }

        if (sessionStorage.getItem("cred") != null) {
            setFormData(JSON.parse(sessionStorage.getItem("cred")));
            setRecords(JSON.parse(sessionStorage.getItem("records")));
        } else fetchData();

    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10"> <img src="./logo.png" alt="Logo" /> </div>
                    <h1 className="text-2xl font-bold text-white">Medicords</h1>
                </div>
            </nav>

            <main className="flex-1 container mx-auto p-4 md:p-6 pt-0">
                <div className="mt-5 mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Welcome, <span className="text-blue-300">{formData.fullName}</span>
                    </h2>
                    <p className="mt-2 text-gray-400">Here are your medical records</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Your Records</h3>
                    <div className="space-y-4">
                        {records && records.length > 0 ? (
                            records.map((record, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700"
                                    style={{
                                        zIndex: records.length - index,
                                        position: 'relative',
                                        marginTop: index === 0 ? '0' : '-8px'
                                    }}
                                >
                                    <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-700 pb-4 mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-500 p-2 rounded-lg mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Hospital ID: </p>
                                                <p className="text-white font-medium">{record.client_id.replace(/(\d{5})/g, "$1 ")}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-700 py-2 px-4 rounded-lg text-sm flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-2">
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <h4 className="text-sm font-medium text-white">Symptoms</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {record.symptoms.split(",").map((symptom, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-red-900/50 text-red-100 px-3 py-1 rounded-full text-sm border border-red-800/30"
                                                    >
                                                        {symptom.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <h4 className="text-sm font-medium text-white">Diagnosis</h4>
                                            </div>
                                            <div className="bg-yellow-900/20 border border-yellow-800/30 text-yellow-100 px-3 py-2 rounded-lg">
                                                <p className="text-white font-medium">{record.diagnosis}</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                                <h4 className="text-sm font-medium text-white">Treatment</h4>
                                            </div>
                                            <div className="bg-green-900/20 border border-green-800/30 text-green-100 px-3 py-2 rounded-lg">
                                                <p className="text-white font-medium">{record.treatment}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg border border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-400">No medical records present right now</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;