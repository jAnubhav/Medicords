import React, { useContext } from 'react';

import { Input, Button } from './Elements';

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const SignupPage = () => {
    const {
        formData, shortenId, setToken
    } = useContext(CredContext);

    const {
        nav, errors, setErrors,
        validateForm, handleChange
    } = useContext(UserContext);

    const handleSubmit = async e => {
        e.preventDefault(); if (!validateForm()) return;
        const newErrors = {};

        const res = await fetch("http://localhost:5000/hospital-signup", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { ...formData, "nationalId": shortenId(formData.nationalId) }
            )
        }).then(data => data.text());

        if (res === "Failure") {
            newErrors.nationalId = 'Account with this National ID exists';
            setErrors(newErrors); return;
        }

        localStorage.setItem("token", res); setToken(res); nav("/");
    };

    return (
        <form className="space-y-6">
            <div className="space-y-4">
                <Input id="hospitalName" type="text" placeholder="Fortis HealthCare" func={handleChange}
                    label="Hospital Name" inpValue={formData.hospitalName} error={errors.hospitalName} />

                <Input id="nationalId" type="text" placeholder="XXXXX XXXXX" func={handleChange}
                    label="National Id" inpValue={formData.nationalId} error={errors.nationalId} />

                <Input id="password" type="password" placeholder="********" func={handleChange}
                    label="Password" inpValue={formData.password} error={errors.password} />
            </div>

            <Button handleSubmit={handleSubmit} text="Create Account"
                place="Already have an account?" link="/login" holder="Sign in here" />
        </form>
    );
};

const SignUp = () => {
    return (
        <UserContainer> <SignupPage /> </UserContainer>
    )
}

export default SignUp;