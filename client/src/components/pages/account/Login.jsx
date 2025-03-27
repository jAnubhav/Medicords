import React, { useContext } from 'react';

import Button from './elements/Button';
import Input from './elements/Input';

import {
    UserContainer, UserContext
} from '../../../contexts/UserContext';

import {
    CredContext
} from '../../../contexts/CredContext';

import { formatId } from '../../../utility';

const InnerLogin = () => {
    const {
        error, setError, handleRedirect
    } = useContext(UserContext)

    const {
        aadharId, setAadharId_buf,
        password, setPassword
    } = useContext(CredContext)

    const handleSubmit = async e => {
        e.preventDefault(); setError('');

        if (!aadharId.trim()) {
            setError('Please enter your Aadhar ID');
            return;
        }

        if (aadharId.length != 14) {
            setError('Please enter correct Aadhar ID');
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        const res = await fetch("http://127.0.0.1:5000/sign-in", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                aadharId: formatId(aadharId),
                password: password
            })
        }).then(data => data.json());

        if (res.message === "AadharId") {
            setError("No Account with this Aadhar Id exists");
        } else if (res.message === "Password") {
            setError("Password is Incorrect");
        } else {
            localStorage.setItem("auth-token", res.token);
            handleRedirect("/dashboard");
        }
    };

    return (
        <>
            <form className="space-y-4">
                {error && (
                    <div className="bg-red-500 text-white p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                        {error}
                    </div>
                )}

                <Input id="aadharId" label="Aadhar ID" type="text" autoComplete="off"
                    value={aadharId} onChange={setAadharId_buf} placeholder="XXXX XXXX XXXX" />

                <Input id="password" label="Password" type="password" autoComplete="current-password"
                    value={password} onChange={setPassword} placeholder="********" />

                <Button onClick={handleSubmit} title="Sign In" type="submit" addClass=
                    "border-transparent text-white bg-blue-600 hover:bg-blue-500" />
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-2 bg-gray-800 text-gray-300">
                            New to Medicords?
                        </span>
                    </div>
                </div>

                <Button onClick={() => handleRedirect("/signup")} title="Create a New Account" type=
                    "button" addClass="border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700" />
            </div>
        </>
    );
};

const LoginPage = () => {
    return (
        <UserContainer>
            <InnerLogin />
        </UserContainer>
    )
}

export default LoginPage;