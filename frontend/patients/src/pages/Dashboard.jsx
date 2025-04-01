import { useContext, useEffect, useState } from "react";
import { CredContext } from "../contexts/CredContext";

const Dashboard = () => {
    const {
        formData, setFormData, token
    } = useContext(CredContext);

    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/get-patient-data", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({ "token": token })
            }).then(data => data.json());

            setFormData({ ...res["cred"] }); setRecords(res["records"]);
        }

        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <nav className="bg-gray-800 p-4 shadow-lg">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10"> <img src="./logo.png" alt="Logo" /> </div>
                    <h1 className="text-2xl font-bold text-white">Medicords</h1>
                </div>
            </nav>

            <main className="flex-1 container mx-auto p-4 md:p-6">
                <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
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
                                    key={record.recordId}
                                    className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                                    style={{
                                        zIndex: userData.records.length - index,
                                        position: 'relative',
                                        marginTop: index === 0 ? '0' : '-8px'
                                    }}
                                >
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <div>
                                            <p className="text-lg font-semibold">{record.recordId}</p>
                                            <p className="text-sm text-gray-400">Hospital ID: {record.hospitalId}</p>
                                        </div>
                                        <div className="bg-gray-700 py-1 px-3 rounded-full text-sm">
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg border border-gray-700">
                                <p className="text-gray-400">No records present right now</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;