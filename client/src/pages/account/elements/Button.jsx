const Button = ({ onClick, title, addClass, type }) => {
    return (
        <div className="mt-4 sm:mt-6">
            <button type={type} onClick={onClick}
                className={`w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border rounded-md shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${addClass}`}>{title}</button>
        </div>
    );
};

export default Button;