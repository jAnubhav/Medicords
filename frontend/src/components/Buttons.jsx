import { Link } from "react-router-dom";

const ButtonLink = ({ handleSubmit, text, place, link, holder }) => {
    return (
        <>
            <div>
                <button onClick={handleSubmit} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">{text}</button>
            </div>

            <div className="text-center text-sm text-gray-400"> <p> {place}{' '} <Link to={link}
                className="font-medium text-blue-400 hover:text-blue-300">{holder}</Link> </p>
            </div>
        </>
    );
};

const Button = ({ func, color, trans, title }) => {
    return (
        <button onClick={func} className={`px-4 py-2 text-sm bg-${color} hover:bg-${trans} rounded-md cursor-pointer`}> {title} </button>
    );
};

export { Button, ButtonLink };