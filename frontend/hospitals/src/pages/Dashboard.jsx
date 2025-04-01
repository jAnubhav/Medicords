import { useContext, useEffect, useState } from "react";
import { CredContext } from "../contexts/CredContext";

import { Input } from "./Elements";

const Dashboard = () => {
    const {
        formData, setFormData, token
    } = useContext(CredContext);

    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/get-hospital-data", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({ "token": token })
            }).then(data => data.json());

            setFormData({ ...res["cred"] }); setRecords(res["records"]);
        };

        fetchData();
    }, []);

    const [showAddModal, setShowAddModal] = useState(false);

    const [newRecord, setNewRecord] = useState({
        aadharId: "", symptoms: [], diagnosis: "", treatment: ""
    });

    const [errors, setErrors] = useState({});

    const availableSymptoms = [
        "Fever", "Headache", "Cough", "Fatigue", "Nausea",
        "Vomiting", "Dizziness", "Chest Pain", "Shortness of Breath",
        "Abdominal Pain", "Joint Pain", "Muscle Pain", "Rash",
        "Swelling", "Sore Throat", "Runny Nose", "Back Pain",
        "Numbness", "Blurred Vision", "Loss of Appetite"
    ];

    const [symptomInput, setSymptomInput] = useState("");

    const handleOpenModal = () => setShowAddModal(true);

    const handleCloseModal = () => {
        setShowAddModal(false); setSymptomInput("");

        setNewRecord({
            aadharId: "", symptoms: [], diagnosis: "", treatment: ""
        });
    };

    const handleChange = e => {
        let { name, value } = e.target;

        if (name === "aadharId") {
            value = value.replace(/\D/g, ""); if (value.length > 12) return;
            value = value.replace(/(\d{4})/g, "$1 ").trim();
        }

        setNewRecord({ ...newRecord, [name]: value });
    };

    const handleAddSymptom = symptom => {
        if (!newRecord.symptoms.includes(symptom)) setNewRecord({
            ...newRecord, symptoms: [...newRecord.symptoms, symptom]
        });

        setSymptomInput("");
    };

    const handleRemoveSymptom = symptomToRemove => {
        setNewRecord({
            ...newRecord, symptoms: newRecord.symptoms
                .filter(symptom => symptom !== symptomToRemove)
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!newRecord.aadharId) newErrors.aadharId = 'Aadhar ID is required';
        else if (newRecord.aadharId.length !== 14) {
            newErrors.aadharId = 'Aadhar ID must be exactly 12 digits';
        }

        if (!newRecord.symptoms.length) newErrors.symptoms = 'Symptoms is Required';

        if (!newRecord.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
        if (!newRecord.treatment) newErrors.treatment = 'Treatment is required';

        setErrors(newErrors); return Object.keys(newErrors).length === 0;
    };

    const handleAddRecord = async () => {
        if (!validateForm()) return;
        const newErrors = {};
        


        handleCloseModal();
    };

    const filteredSymptoms = availableSymptoms.filter(symptom => symptom.toLowerCase()
        .includes(symptomInput.toLowerCase()) && !newRecord.symptoms.includes(symptom));

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
                        Welcome, <span className="text-blue-300">{formData.hospitalName}</span>
                    </h2>
                    <p className="mt-2 text-gray-400">Here are your medical records</p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Your Records</h3>
                        <button onClick={handleOpenModal} className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-4 py-2 rounded-md  transition-colors duration-300" >
                            <span className="mr-1">+</span> Add Record
                        </button>
                    </div>

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

            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl max-w-lg w-full my-8">
                        <h3 className="text-xl font-semibold mb-4">Add New Record</h3>

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            <Input id="aadharId" type="text" label="Patient's Aadhar Id" placeholder="XXXX XXXX XXXX"
                                inpValue={newRecord.aadharId} error={errors.aadharId} func={handleChange} />

                            <div className="relative">
                                <Input id="symptoms" type="text" label="Symptoms" placeholder="Type to Search Symptoms"
                                    inpValue={symptomInput} error={errors.symptoms} func={e => setSymptomInput(e.target.value)} />

                                {symptomInput && filteredSymptoms.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {filteredSymptoms.map((symptom, index) => (
                                            <div
                                                key={index}
                                                className="px-3 text-sm py-2 hover:bg-gray-600 cursor-pointer"
                                                onClick={() => handleAddSymptom(symptom)}
                                            >
                                                {symptom}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {!!newRecord.symptoms.length && <div className="flex flex-wrap gap-2 mt-2">
                                {newRecord.symptoms.map((symptom, index) => (
                                    <div key={index} className="bg-blue-600 px-3 py-2 rounded-full text-xs flex items-center">
                                        {symptom}
                                        <button
                                            className="ml-2 focus:outline-none"
                                            onClick={() => handleRemoveSymptom(symptom)}
                                        > × </button>
                                    </div>
                                ))}
                            </div>}

                            <Input id="diagnosis" type="text" label="Diagnosis" placeholder="Enter Diagnosis"
                                inpValue={newRecord.diagnosis} error={errors.diagnosis} func={handleChange} />

                            <Input id="treatment" type="text" label="Treatment" placeholder="Enter Treatment"
                                inpValue={newRecord.treatment} error={errors.treatment} func={handleChange} />
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={handleAddRecord} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-300" > Save Record </button>

                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-300" > Cancel </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;