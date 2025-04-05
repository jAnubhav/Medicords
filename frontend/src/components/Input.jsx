const Input = ({ id, type, label, placeholder, inpValue, error, func }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1"> {label} </label>

            <input id={id} name={id} type={type} placeholder={placeholder}
                className={`appearance-none rounded-md relative block w-full py-2 px-3 bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} placeholder-gray-400 text-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10`} value={inpValue} onChange={func} required
            />

            {error && (<p className="text-red-500 text-xs mt-1">{error}</p>)}
        </div>
    );
};

export default Input;