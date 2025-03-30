import { useContext } from "react";
import { Link } from "react-router-dom";

import { CredContext } from "../contexts/CredContext";

const Input = ({ id, type, label, placeholder, value, error }) => {
    const { handleChange } = useContext(CredContext);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1"> {label} </label>

            <input id={id} name={id} type={type} placeholder={placeholder}
                className={`appearance-none rounded-md relative block w-full py-2 px-3 bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} placeholder-gray-400 text-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10`} value={value} onChange={handleChange} required
            />

            {error && (<p className="text-red-500 text-xs mt-1">{error}</p>)}
        </div>
    );
};

const Button = ({ handleSubmit, text }) => {
    return (
        <div>
            <button onClick={handleSubmit} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">{text}</button>
        </div>
    );
};

const Switch = ({ text, link, holder }) => {
    return (
        <div className="text-center text-sm text-gray-400"> <p> {text}{' '} <Link to={link}
            className="font-medium text-blue-400 hover:text-blue-300">{holder}</Link> </p> </div>
    );
};

export { Input, Button, Switch };