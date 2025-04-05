import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input"
import { CredContext } from "../contexts/CredContext";
import { GridBox, TextBox } from "../components/GridBox";

const Dashboard = () => {
    const {
        formData, setFormData, token, setToken,
        status, setStatus, shortenAadharId
    } = useContext(CredContext);

    const [records, setRecords] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/get-data", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({ "token": token })
            }).then(data => data.json());

            if (res["cred"] === "Failure") {
                nav(`/${(status == "") ? "patients" : status}/login`);
                setToken(null); localStorage.removeItem("token"); return;
            }

            setFormData({ ...res["cred"] }); setRecords(res["records"]);

            sessionStorage.setItem("cred", JSON.stringify(res["cred"]));
            sessionStorage.setItem("records", JSON.stringify(res["records"]));

            const newStatus = (res["cred"]["aadharId"] == null) ? "hospitals" : "patients";
            sessionStorage.setItem("status", newStatus); setStatus(newStatus);
        }

        if (sessionStorage.getItem("cred") != null) {
            setFormData(JSON.parse(sessionStorage.getItem("cred")));
            setRecords(JSON.parse(sessionStorage.getItem("records")));

            setStatus(sessionStorage.getItem("status"));
        } else fetchData();
    }, []);

    const [showAddModal, setShowAddModal] = useState(false);

    //
    const [newRecord, setNewRecord] = useState({ 
        client_id: "", symptoms: [], diagnosis: "", treatment: ""
    });

    //
    const [errors, setErrors] = useState({});

    //
    const availableSymptoms = [
        "Fever", "Headache", "Cough", "Fatigue", "Nausea",
        "Vomiting", "Dizziness", "Chest Pain", "Shortness of Breath",
        "Abdominal Pain", "Joint Pain", "Muscle Pain", "Rash",
        "Swelling", "Sore Throat", "Runny Nose", "Back Pain",
        "Numbness", "Blurred Vision", "Loss of Appetite"
    ];

    //
    const [symptomInput, setSymptomInput] = useState("");


    const handleOpenModal = () => setShowAddModal(true);

    
    const handleCloseModal = () => {
        setShowAddModal(false); setSymptomInput("");

        setNewRecord({
            client_id: "", symptoms: [], diagnosis: "", treatment: ""
        });
    };

    //
    const handleChange = e => {
        let { name, value } = e.target;

        if (name === "client_id") {
            value = value.replace(/\D/g, ""); if (value.length > 12) return;
            value = value.replace(/(\d{4})/g, "$1 ").trim();
        }

        setNewRecord({ ...newRecord, [name]: value });
    };

    //
    const handleAddSymptom = symptom => {
        if (!newRecord.symptoms.includes(symptom)) setNewRecord({
            ...newRecord, symptoms: [...newRecord.symptoms, symptom]
        });

        setSymptomInput("");
    };

    //
    const handleRemoveSymptom = symptomToRemove => {
        setNewRecord({
            ...newRecord, symptoms: newRecord.symptoms
                .filter(symptom => symptom !== symptomToRemove)
        });
    };

    //
    const validateForm = () => {
        const newErrors = {};

        if (!newRecord.client_id) newErrors.aadharId = 'Aadhar ID is required';
        else if (newRecord.client_id.length !== 14) {
            newErrors.aadharId = 'Aadhar ID must be exactly 12 digits';
        }

        if (!newRecord.symptoms.length) newErrors.symptoms = 'Symptoms is Required';

        if (!newRecord.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
        if (!newRecord.treatment) newErrors.treatment = 'Treatment is required';

        setErrors(newErrors); return Object.keys(newErrors).length === 0;
    };

    //
    const handleAddRecord = async () => {
        if (!validateForm()) return; const newErrors = {};

        const res = await fetch("http://localhost:5000/add-record", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newRecord, "symptoms": newRecord.symptoms.join(","),
                "nationalId": shortenAadharId(formData.nationalId),
                "client_id": newRecord.client_id.replace(/\s+/g, "")
            })
        }).then(data => data.text());

        if (res === "AadharId") {
            newErrors.aadharId = "No Account with this Aadhar Id doesn't exists";
            setErrors(newErrors); return;
        }

        records.push({
            ...newRecord, "date": res, "symptoms": newRecord.symptoms.join(","),
            "client_id": newRecord.client_id.replace(/\s+/g, "")
        }); setRecords(records);

        sessionStorage.setItem("records", JSON.stringify(records)); handleCloseModal();
    };

    const filteredSymptoms = availableSymptoms.filter(symptom => symptom.toLowerCase()
        .includes(symptomInput.toLowerCase()) && !newRecord.symptoms.includes(symptom));

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10"> <img src="./logo.png" alt="Logo" /> </div>
                    <h1 className="text-2xl font-bold text-white">Medicords</h1>
                </div>
            </nav>


            <main className="flex-1 container mx-auto p-4 md:p-6">
                <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Welcome, <span className="text-blue-300">{formData.name}</span>
                    </h2>
                    <p className="mt-2 text-gray-400">Here are your medical records</p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Your Records</h3>
                        {status === "hospitals" && <button onClick={handleOpenModal} className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-4 py-2 rounded-md  transition-colors duration-300" >
                            <span className="mr-1">+</span> Add Record
                        </button>}
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

                                        <div className="bg-gray-700 p-3 rounded-lg text-xs flex items-center">
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
                                                    <span
                                                        key={idx}
                                                        className="bg-red-900/50 text-red-100 px-3 py-1 rounded-lg text-xs border border-red-800/30"
                                                    > {symptom.trim()} </span>
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

            {status === "hospitals" && showAddModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl max-w-lg w-full my-8">
                        <h3 className="text-xl font-semibold mb-4">Add New Record</h3>

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            <Input id="client_id" type="text" label="Patient's Aadhar Id" placeholder="XXXX XXXX XXXX"
                                inpValue={newRecord.client_id} error={errors.aadharId} func={handleChange} />

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
                                    <div key={index} className="bg-gray-900 px-3 py-2 rounded-md text-sm flex items-center">
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