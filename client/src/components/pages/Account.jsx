import React from "react";

const LogIn = () => {
    return (
        <div>Sign In</div>
    );
}

const SignUp = () => {
    return (
        <div>Create Account</div>
    );
}

const Sign = ({ inner }) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="container h-50 w-50 p-15 bg-base-300">
                {inner ? <SignUp /> : <LogIn />}
            </div>
        </div>
    );
}

export default Sign