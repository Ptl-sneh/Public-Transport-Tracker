import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RouteMapModal from '../components/RouteMapModal';

const SRoutes = () => {
    const [searchRoute, setSearchRoute] = useState("");
    const [busRoutes, setBusRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Bus Routes from backend API on mount
    useEffect(() => {
        axios.get('http://localhost:8000/api/bus-routes/')
            .then(response => {
                setBusRoutes(response.data);
            })
            .catch(error => {
                console.error("Error fetching bus routes:", error);
            });
    }, []);

    // Filter routes based on search input (case insensitive)
    const findRoutes = busRoutes.filter((route) => {
        const searchLower = searchRoute.toLowerCase();
        return (
            (route.name && route.name.toLowerCase().includes(searchLower)) ||
            (route.start_stop?.name && route.start_stop.name.toLowerCase().includes(searchLower)) ||
            (route.end_stop?.name && route.end_stop.name.toLowerCase().includes(searchLower))
        );
    });

    const openMapModal = (routeId) => {
        setSelectedRouteId(routeId);
        setIsModalOpen(true);
    };

    const closeMapModal = () => {
        setIsModalOpen(false);
        setSelectedRouteId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" >
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Available Bus Routes</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Explore all bus routes in Ahmedabad</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search by route name or stop..."
                            value={searchRoute}
                            onChange={(e) => setSearchRoute(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {findRoutes.map((route) => (
                        <div
                            key={route.id}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                                            {route.name}
                                        </span>
                                        {/* You can add distance here if available */}
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">{route.start_stop?.name}</span>
                                        <span className="mx-3 text-red-500">→</span>
                                        <span className="font-medium">{route.end_stop?.name}</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300" onClick={() => openMapModal(route.id)}>
                                        View on Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>  

                <RouteMapModal routeId={ selectedRouteId} isOpen={isModalOpen} onClose={closeMapModal} />

                {findRoutes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No routes found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SRoutes;
