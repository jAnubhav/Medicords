import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input, Button } from './Elements';

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const LoginPage = () => {
    const {
        formData, setFormData, shortenId, setToken
    } = useContext(CredContext);

    const {
        errors, setErrors,
        validateForm, handleChange
    } = useContext(UserContext);

    const nav = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault(); if (!validateForm()) return;
        const newErrors = {};

        const res = await fetch("http://localhost:5000/hospital-login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { ...formData, "nationalId": shortenId(formData.nationalId) }
            )
        }).then(data => data.text());

        if (res === "NationalId") {
            newErrors.nationalId = 'No Account with this National ID exists';
            setErrors(newErrors); return;
        } else if (res === "Password") {
            newErrors.password = 'Incorrect Password';
            setErrors(newErrors); return;
        }

        setFormData({ ...formData, "nationalId": shortenId(formData.nationalId) })
        localStorage.setItem("token", res); setToken(res); nav("/");
    };

    return (
        <form className="space-y-6">
            <div className="space-y-4">
                <Input id="nationalId" type="text" placeholder="XXXXX XXXXX" func={handleChange}
                    label="National Id" inpValue={formData.nationalId} error={errors.nationalId} />

                <Input id="password" type="password" placeholder="********" func={handleChange}
                    label="Password" inpValue={formData.password} error={errors.password} />
            </div>

            <Button handleSubmit={handleSubmit} text="Sign In" 
                place="Don't have an account?" link="/signup" holder="Register here" />
        </form>
    );
};

const Login = () => {
    return (
        <UserContainer> <LoginPage /> </UserContainer>
    )
}

export default Login;