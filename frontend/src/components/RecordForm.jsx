import { useContext, useState } from "react";
import { CredContext } from "../contexts/CredContext";

import Input from "./Input";
import { Button } from "./Buttons";

const RecordForm = ({ setVis, records, setRecords }) => {
    const { formData, shortenAadharId } = useContext(CredContext);

    const [newRecord, setNewRecord] = useState({
        client_id: "", symptoms: [], diagnosis: "", treatment: ""
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

    const handleChange = e => {
        let { name, value } = e.target;

        if (name === "client_id") {
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

        
    const handleCloseModal = () => {
        setVis(false); setSymptomInput("");

        setNewRecord({
            client_id: "", symptoms: [], diagnosis: "", treatment: ""
        });
    };

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
                    <Button func={handleAddRecord} color="blue-600" trans="blue-700" title="Save Record" />
                    <Button func={handleCloseModal} color="gray-700" trans="gray-600" title="Cancel" />
                </div>
            </div>
        </div>
    );
};

export default RecordForm;