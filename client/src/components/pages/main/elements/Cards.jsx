const Card = ({ partner }) => {
    return (
        <div
            key={partner.id}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden 
                    border border-gray-700 transform transition 
                    duration-300 hover:scale-105 hover:shadow-xl"
        >
            <div className="h-40 overflow-hidden relative">
                <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover absolute inset-0 
                           opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 
                            bg-gradient-to-t from-gray-900 to-transparent 
                            h-1/2 opacity-80"></div>
            </div>

            <div className="p-4 text-white">
                <h2 className="text-lg font-semibold mb-3 text-blue-400">
                    {partner.name}
                </h2>

                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <a
                            href={`mailto:${partner.email}`}
                            className="text-gray-300 hover:text-blue-400 
                                   transition duration-300 truncate"
                        >
                            {partner.email}
                        </a>
                    </div>

                    <div className="flex items-center text-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <a
                            href={`tel:${partner.phone.replace(/\D/g, '')}`}
                            className="text-gray-300 hover:text-blue-400 
                                   transition duration-300"
                        >
                            {partner.phone}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;