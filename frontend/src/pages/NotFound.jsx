import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 md:p-12 max-w-lg w-full text-center border border-gray-700">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500"> 404</div>

                        <div className="absolute top-0 left-0 right-0 text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 animate-pulse"> 404 </div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100">You're on the Wrong Page</h1>
                <p className="text-gray-400 mb-8 text-sm">The page you're looking for doesn't exist or has been moved.</p>

                <div className="flex justify-center mb-6">
                    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"><span>Go to Dashboard</span></Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;