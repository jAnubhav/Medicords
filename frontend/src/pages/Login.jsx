import { useContext } from 'react';

import Input from '../components/Input';
import { ButtonLink } from '../components/Buttons';

import CredContext from '../contexts/CredContext';
import UserContext, { UserContainer } from '../contexts/UserContext';

const LoginPage = ({ type }) => {
    const { formData } = useContext(CredContext), { errors, handleChange, handleSubmit } = useContext(UserContext);
    const handleFormSubmit = e => handleSubmit(e, "login", type === "patients" ? "aadharId" : "nationalId");

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

            <ButtonLink handleSubmit={handleFormSubmit} text="Sign In" 
                place="Don't have an account?" link={`/${type}/signup`} holder="Register here" />
        </form>
    );
};

const Login = ({ type }) => {
    return (
        <UserContainer> <LoginPage type={type} /> </UserContainer>
    )
}

export default Login;