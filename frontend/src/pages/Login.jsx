import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input';
import { ButtonLink } from '../components/Buttons';

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const LoginPage = ({ type }) => {
    const {
        formData, setFormData, setToken, setStatus,
        shortenAadharId, shortenNationalId
    } = useContext(CredContext);

    const {
        errors, setErrors, handleChange,
        validatePatient, validateHospital
    } = useContext(UserContext);

    const nav = useNavigate()

    const handleSubmit = async (e, validate, clientId, func) => {
        e.preventDefault(); if (!validate()) return; const errs = {};

        const res = await fetch("http://localhost:5000/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { ...formData, "type": type, [clientId]: func(formData[clientId]) }
            )
        }).then(data => data.text());

        if (res === "Failure") {
            errs[clientId] = `Account with this ${transformLabel(
                clientId)} exists`; setErrors(errs); return;
        } else if (res === "Password") {
            errs.password = 'Incorrect Password'; setErrors(errs); return;
        }

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

    return (
        <form className="space-y-6">
            <div className="space-y-4">
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
                text="Sign In" place="Don't have an account?" link={`/${type}/signup`} holder="Register here" />
        </form>
    );
};

const Login = ({type}) => {
    return (
        <UserContainer> <LoginPage type={type} /> </UserContainer>
    )
}

export default Login;