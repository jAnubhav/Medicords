import React, { useContext, useState } from 'react';

import { CredContext } from '../../../contexts/CredContext';

const symptoms = [
    "Fever", "Cough", "Fatigue", "Headache",
    "Shortness of Breath", "Body Aches",
    "Sore Throat", "Loss of Taste",
    "Nausea", "Dizziness"
];

const MedicalRecordForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [hospitalId, setHospitalId] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');

    const { accAdd } = useContext(CredContext)

    const toggleSymptom = symptom => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleHospitalIdChange = e => {
        const value = e.target.value;

        if (/^\d{0,8}$/.test(value)) {
            setHospitalId(value);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const res = await fetch("http://127.0.0.1:5000/add-record", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                acc_add: accAdd,

                hospitalId: hospitalId, diagnosis: diagnosis,
                symptoms: selectedSymptoms.join(", "), treatment: treatment
            })
        }).then(data => data.text());

        console.log(res);

        setIsModalOpen(false); setSelectedSymptoms([]);
        setHospitalId(''); setDiagnosis(''); setTreatment('');
    };

    return (
        <div>
            <div className="p-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Add Record
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl text-sm w-full mx-auto p-6 bg-gray-900 text-white shadow-md rounded-lg relative max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="p-2 bg-white absolute rounded top-0 right-0 text-gray-900 z-10"
                        >
                            ×
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-8">
                            {/* Hospital ID */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="hospitalId" className="text-right font-medium text-gray-300">
                                    Hospital ID
                                </label>
                                <input
                                    id="hospitalId"
                                    value={hospitalId}
                                    onChange={handleHospitalIdChange}
                                    className="col-span-3 border border-gray-700 bg-gray-900 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Hospital ID (0-9 digits)"
                                    type="number"
                                    min="1"
                                    max="99999999"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right font-medium text-gray-300">Symptoms</label>
                                <div className="col-span-3">
                                    {/* Selected Symptoms Chips */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedSymptoms.map((symptom) => (
                                            <div
                                                key={symptom}
                                                className="flex items-center bg-blue-700 text-white px-2 py-1 rounded-full text-sm"
                                            >
                                                {symptom}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSymptom(symptom)}
                                                    className="ml-2 hover:text-gray-200"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Symptom Selection Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {symptoms
                                            .filter(s => !selectedSymptoms.includes(s))
                                            .map((symptom) => (
                                                <button
                                                    key={symptom}
                                                    type="button"
                                                    onClick={() => toggleSymptom(symptom)}
                                                    className="px-2 py-1 text-sm bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                                                >
                                                    {symptom}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="diagnosis" className="text-right font-medium text-gray-300">
                                    Diagnosis
                                </label>
                                <textarea
                                    id="diagnosis"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    className="col-span-3 border border-gray-700 bg-gray-900 text-white rounded px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter diagnosis"
                                    maxLength={200}
                                    required
                                />
                            </div>

                            {/* Treatment */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="treatment" className="text-right font-medium text-gray-300">
                                    Treatment
                                </label>
                                <textarea
                                    id="treatment"
                                    value={treatment}
                                    onChange={(e) => setTreatment(e.target.value)}
                                    className="col-span-3 border border-gray-700 bg-gray-900 text-white rounded px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter treatment"
                                    maxLength={200}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordForm;