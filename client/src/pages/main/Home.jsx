import React from 'react';

const Home = () => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-6">
                        Medicords
                    </h1>
                    
                    <p className="text-gray-300 mb-8">
                        Medicords is revolutionizing personal health management by creating a secure, 
                        blockchain-powered platform that empowers patients to take complete control of 
                        their medical history. We provide a paperless solution that ensures your 
                        medical records are immutable, confidential, and accessible only to you and 
                        your authorized healthcare providers.
                    </p>
                    
                    <div className="text-sm">
                        <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;