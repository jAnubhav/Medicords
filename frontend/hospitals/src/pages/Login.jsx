import React, { useContext } from 'react';

import { Input, Button } from './Elements';

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const LoginPage = () => {
    const { formData, shortenId, setToken } = useContext(CredContext)
    const { errors, setErrors, nav } = useContext(UserContext);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.aadharId) {
            newErrors.aadharId = 'Aadhar ID is required';
        } else if (formData.aadharId.length !== 14) {
            newErrors.aadharId = 'Aadhar ID must be exactly 12 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (formData.password.length > 20) {
            newErrors.password = 'Password cannot exceed 20 characters';
        }

        setErrors(newErrors); return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault(); if (!validateForm()) return;
        const newErrors = {}, aadharId = shortenId(formData.aadharId);

        const res = await fetch("http://localhost:5000/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, "aadharId": aadharId })
        }).then(data => data.text());

        if (res === "AadharId") {
            newErrors.aadharId = 'No Account with this Aadhar ID exists';
            setErrors(newErrors); return;
        } else if (res === "Password") {
            newErrors.password = 'Incorrect Password';
            setErrors(newErrors); return;
        }

        localStorage.setItem("token", res); setToken(res); nav("/");
    };

    return (
        <form className="space-y-6">
            <div className="space-y-4">
                <Input id="aadharId" type="text" placeholder="XXXX XXXX XXXX"
                    label="Aadhar Id" value={formData.aadharId} error={errors.aadharId} />

                <Input id="password" type="password" placeholder="********"
                    label="Password" value={formData.password} error={errors.password} />
            </div>

            <Button handleSubmit={handleSubmit} text="Sign In" place="Don't have an account?"
                link="/signup" holder="Register here" />
        </form>
    );
};

const Login = () => {
    return (
        <UserContainer> <LoginPage /> </UserContainer>
    )
}

export default Login;