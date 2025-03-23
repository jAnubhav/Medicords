const Input = ({ id, label, type, autoComplete, value, onChange, placeholder }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-gray-300">{label}</label>

            <div className="mt-1">
                <input
                    id={id} name={id} type={type} autoComplete={autoComplete} required value={value} onChange={e => onChange(e.target.value)}
                    className="appearance-none block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white text-xs sm:text-sm"
                    placeholder={placeholder}
                />
            </div>
        </div>

    );
};

export default Input;