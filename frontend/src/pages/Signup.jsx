import React, { useContext } from 'react';

import Input from '../components/Input';
import { ButtonLink } from '../components/Buttons'

import { CredContext } from '../contexts/CredContext';
import { UserContainer, UserContext } from '../contexts/UserContext';

const SignupPage = ({ type }) => {
    const { formData } = useContext(CredContext), { errors, handleChange, handleSubmit } = useContext(UserContext);
    const chk = type === "patients", handleFormSubmit = e => handleSubmit(e, "signup", chk ? "aadharId" : "nationalId");

    return (
        <form className="space-y-6">
            <div className="space-y-4">
                <Input id="name" type="text" placeholder={chk ? "Anubhav Jain" : "Fortis HealthCare"}
                    label={`${chk ? "Patient" : "Hospital"}'s Name`} inpValue={formData.name} error={errors.name} />

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

            <ButtonLink handleSubmit={handleFormSubmit} text="Create Account" 
                place="Already have an account?" link={`/${type}/login`} holder="Sign in here" />
        </form>
    );
};

const SignUp = ({ type }) => {
    return (
        <UserContainer> <SignupPage type={type} /> </UserContainer>
    )
}

export default SignUp;