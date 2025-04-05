import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input';
import { ButtonLink } from '../components/Buttons'

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const SignupPage = ({ type }) => {
    const {
        formData, setFormData, setToken, setStatus,
        shortenAadharId, shortenNationalId
    } = useContext(CredContext);

    const {
        errors, setErrors, handleChange,
        validatePatient, validateHospital
    } = useContext(UserContext);

    const nav = useNavigate();

    const transformLabel = str => {
        return str.replace(/([A-Z])/g, ' $1')
            .replace(/^./, s => s.toUpperCase());
    };

    const handleSubmit = async (e, validate, clientId, func) => {
        e.preventDefault(); if (!validate()) return; const errs = {};

        const res = await fetch("http://localhost:5000/signup", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { ...formData, "type": type, [clientId]: func(formData[clientId]) }
            )
        }).then(data => data.text());

        if (res === "Failure") {
            errs[clientId] = `Account with this ${transformLabel(
                clientId)} exists`; setErrors(errs); return;
        }

        sessionStorage.setItem("cred", JSON.stringify({
            [clientId]: func(formData[clientId]), name: formData.name
        })); sessionStorage.setItem("records", JSON.stringify([]));

        setFormData({ ...formData, [clientId]: func(formData[clientId]) });

        sessionStorage.setItem("status", type); setStatus(type); 
        localStorage.setItem("token", res); setToken(res); nav("/");
    };

    const handlePatientSubmit = async e => {
        await handleSubmit(e, validatePatient, "aadharId", shortenAadharId);
    }

    const handleHospitalSubmit = async e => {
        await handleSubmit(e, validateHospital, "nationalId", shortenNationalId);
    }

    const placeholder = (type === "patients") ? "Anubhav Jain" : "Fortis HealthCare";
    const label = (type === "patients") ? "Patient's Name" : "Hospital's Name";

    return (
        <form className="space-y-6">
            <div className="space-y-4">
                <Input id="name" type="text" placeholder={placeholder} func={handleChange}
                    label={label} inpValue={formData.name} error={errors.name} />

                {type === 'patients' ? (
                    <Input id="aadharId" type="text" placeholder="XXXX XXXX XXXX" func={handleChange}
                        label="Aadhar Id" inpValue={formData.aadharId} error={errors.aadharId} />
                ) : (
                    <Input id="nationalId" type="text" placeholder="XXXXX XXXXX" func={handleChange}
                        label="National Id" inpValue={formData.nationalId} error={errors.nationalId} />
                )}

                <Input id="password" type="password" placeholder="********" func={handleChange}
                    label="Password" inpValue={formData.password} error={errors.password} />
            </div>

            <ButtonLink handleSubmit={(type === 'patients' ? handlePatientSubmit : handleHospitalSubmit)}
                text="Create Account" place="Already have an account?" link={`/${type}/login`} holder="Sign in here" />
        </form>
    );
};

const SignUp = ({ type }) => {
    return (
        <UserContainer> <SignupPage type={type} /> </UserContainer>
    )
}

export default SignUp;