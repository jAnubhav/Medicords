const Loader = () => {
    return (
        <div className="fixed inset-0 bg-gray-800 opacity-85 z-100 flex items-center justify-center">
            <div className="relative">
                <div className="h-25 w-25 border-10 border-gray-100 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default Loader;