import React from 'react';

import Card from './elements/Cards';

const healthPartnersData = [
    {
        id: 1,
        name: "City General Hospital",
        email: "contact@citygeneral.com",
        phone: "(555) 123-4567",
        image: "/api/placeholder/300/200"
    },
    {
        id: 2,
        name: "Wellness Medical Center",
        email: "info@wellnessmed.com", 
        phone: "(555) 987-6543",
        image: "/api/placeholder/300/200"
    },
    {
        id: 3,
        name: "Regional Health Institute",
        email: "support@regionalhealth.com",
        phone: "(555) 246-8135",
        image: "/api/placeholder/300/200"
    },
    {
        id: 4,
        name: "Community Care Hospital",
        email: "contact@communitycare.com",
        phone: "(555) 369-2580",
        image: "/api/placeholder/300/200"
    },
    {
        id: 5,
        name: "Metropolitan Medical Center",
        email: "info@metromedical.com",
        phone: "(555) 147-2589",
        image: "/api/placeholder/300/200"
    },
    {
        id: 6,
        name: "Sunrise Healthcare Network",
        email: "support@sunrisehealthcare.com",
        phone: "(555) 753-9514",
        image: "/api/placeholder/300/200"
    }
];

const Affliliations = () => {
    return (
        <div className="bg-gray-800 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-center mb-8 text-white">
                    Our Affiliations
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {healthPartnersData.map((partner) => (<Card partner={partner} />))}
                </div>
            </div>
        </div>
    );
};

export default Affliliations;