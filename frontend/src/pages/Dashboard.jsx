import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/Buttons";
import { GridBox, TextBox } from "../components/GridBox";
import Loader from "../components/Loader";
import RecordForm from "../components/RecordForm";

import CredContext, { BACKEND_URL } from "../contexts/CredContext";

// JWT expiration check utility
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

const Dashboard = () => {
    const {
        formData, setFormData, load, setLoad,
        token, setToken, status, setStatus
    } = useContext(CredContext);

    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);

    const nav = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            setLoad(true);
            setError(null);
            try {
                if (!token || isTokenExpired(token)) {
                    setError("Session expired. Please log in again.");
                    logout();
                    return;
                }
                const res = await fetch(`${BACKEND_URL}/get-data`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                const data = await res.json();
                if (!data || typeof data !== "object" || !("cred" in data) || !("records" in data)) {
                    setError("Invalid response from server.");
                    setLoad(false);
                    return;
                }
                if (data["cred"] === "Failure") {
                    nav(`/${status}/login`);
                    setToken(null);
                    try { localStorage.removeItem("token"); } catch {}
                    setLoad(false);
                    return;
                }
                setFormData({ ...data["cred"] });
                setRecords(data["records"]);
                try {
                    sessionStorage.setItem("cred", JSON.stringify(data["cred"]));
                    sessionStorage.setItem("records", JSON.stringify(data["records"]));
                } catch (err) {
                    console.error("Error saving to sessionStorage:", err);
                }
                const newStatus = data["cred"]["aadharId"] == null ? "hospitals" : "patients";
                try { sessionStorage.setItem("status", newStatus); } catch {}
                setStatus(newStatus);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error("Error fetching data:", err);
            } finally {
                setLoad(false);
            }
        };
        const cachedCred = sessionStorage.getItem("cred");
        const cachedRecords = sessionStorage.getItem("records");
        if (cachedCred && cachedRecords) {
            try {
                setFormData(JSON.parse(cachedCred));
                setRecords(JSON.parse(cachedRecords));
                setStatus(sessionStorage.getItem("status"));
            } catch (err) {
                setError("Corrupted session data. Reloading...");
                console.error("Error parsing sessionStorage:", err);
                fetchData();  // fallback
            }
        } else {
            fetchData();
        }
    }, []);

    const [showAddModal, setShowAddModal] = useState(false);
    const handleOpenModal = () => setShowAddModal(true);

    const logout = () => {
        try { sessionStorage.removeItem("cred"); } catch {}
        try { sessionStorage.removeItem("records"); } catch {}
        try { localStorage.removeItem("token"); } catch {}
        nav(`/${status}/login`); setToken(null);
        setFormData({ aadharId: '', nationalId: '', name: '', password: '' });
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10">
                            <img src="./logo.png" alt="Logo" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Medicords</h1>
                    </div>
                    <Button func={logout} color="blue-600" trans="blue-700" title="Log Out" />
                </div>
            </nav>
            <main className="flex-1 container mx-auto p-4 md:p-6">
                {error && (
                    <div className="bg-red-800 text-red-100 p-4 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Welcome, <span className="text-blue-300">{formData.name}</span>
                    </h2>
                    <p className="mt-2 text-gray-400">Here are your medical records</p>
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Your Records</h3>
                        {status === "hospitals" && (
                            <Button func={handleOpenModal} color="blue-600" trans="blue-700" title="+ Add Record" />
                        )}
                    </div>
                    <div className="space-y-6">
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
                                                <p className="text-gray-400 text-sm font-medium">{
                                                    (status === "patients" ? "Hospital" : "Patient")} ID: </p>
                                                <p className="text-white text-sm font-bold">{record.client_id.match(new RegExp(
                                                    `\\d{1,${record.client_id % 3 === 0 ? 4 : 5}}`, 'g')).join(' ')}</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-700 py-2 px-3 rounded-lg text-sm flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-2">
                                        <GridBox color="red" svg="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" title="Symptoms">
                                            <div className="flex flex-wrap gap-2">
                                                {record.symptoms.split(",").map((symptom, idx) => (
                                                    <span key={idx} className="bg-red-900/50 text-red-100 px-3 py-1 rounded-lg text-xs border border-red-800/30"> {symptom.trim()} </span>
                                                ))}
                                            </div>
                                        </GridBox>

                                        <TextBox color="yellow" svg="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" title="Diagnosis" value={record.diagnosis} />

                                        <TextBox color="green" svg="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" title="Treatment" value={record.treatment} />
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
            {load && (<Loader />)}
            {status === "hospitals" && showAddModal && (
                <RecordForm setVis={setShowAddModal} records={records} setRecords={setRecords} />
            )}
        </div>
    );
};

export default Dashboard;