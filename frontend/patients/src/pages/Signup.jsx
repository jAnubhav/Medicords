import React, { useContext } from 'react';

import { Input, Button } from './Elements';

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const SignupPage = () => {
    const { formData, shortenId, setToken } = useContext(CredContext);
    const { errors, setErrors, nav, validateForm } = useContext(UserContext);

    const handleSubmit = async e => {
        e.preventDefault(); if (!validateForm()) return;
        const newErrors = {};

        const res = await fetch("http://localhost:5000/patient-signup", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { ...formData, "aadharId": shortenId(formData.aadharId) }
            )
        }).then(data => data.text());

        if (res === "Failure") {
            newErrors.aadharId = 'Account with this Aadhar ID exists';
            setErrors(newErrors); return;
        }

        localStorage.setItem("token", res); setToken(res); nav("/");
    };

    return (
        <form className="space-y-6">
            <div className="space-y-4">
                <Input id="fullName" type="text" placeholder="Anubhav Jain"
                    label="Full Name" inpValue={formData.fullName} error={errors.fullName} />

                <Input id="aadharId" type="text" placeholder="XXXX XXXX XXXX"
                    label="Aadhar Id" inpValue={formData.aadharId} error={errors.aadharId} />

                <Input id="password" type="password" placeholder="********"
                    label="Password" inpValue={formData.password} error={errors.password} />
            </div>

            <Button handleSubmit={handleSubmit} text="Create Account" place="Already have an account?"
                link="/login" holder="Sign in here" />
        </form>
    );
};

const SignUp = () => {
    return (
        <UserContainer> <SignupPage /> </UserContainer>
    )
}

export default SignUp;