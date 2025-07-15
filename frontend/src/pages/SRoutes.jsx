import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SRoutes = () => {
    const [activeTab, setActiveTab] = useState("Bus")
    const [searchRoute, setSearchRoute] = useState("")

    const BusRoutes = [
        { routeNo: "101", startStop: "Maninagar", endStop: "Paldi", distance: "12km" },
        { routeNo: "102", startStop: "Vastrapur", endStop: "Railway Station", distance: "15 km" },
        { routeNo: "103", startStop: "Bopal", endStop: "CG Road", distance: "18 km" },
        { routeNo: "104", startStop: "Satellite", endStop: "Iscon", distance: "8 km" },
        { routeNo: "105", startStop: "Ghatlodia", endStop: "Ashram Road", distance: "20 km" },
    ]

    const MetroRoutes = [
        { routeNo: "Blue Line", startStop: "Vastral Gam", endStop: "Thaltej Gam", distance: "40 km" },
        { routeNo: "Red Line", startStop: "APMC", endStop: "Motera", distance: "25 km" },
        { routeNo: "Green Line", startStop: "Sector 1", endStop: "Gift City", distance: "30 km" },
    ]

    const currentRoutes = activeTab === "Bus" ? BusRoutes : MetroRoutes;

    const findRoutes = currentRoutes.filter((route) => route.routeNo.toLowerCase().includes(searchRoute.toLowerCase()) || route.startStop.toLowerCase().includes(searchRoute.toLowerCase()) || route.endStop.toLowerCase().includes(searchRoute.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" >
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Available Routes</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Explore all bus and metro routes in Ahmedabad</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="max-w-md mx-auto">
                        <input type="text" placeholder="Search by route name or stop..." value={searchRoute} onChange={(e) => setSearchRoute(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                    </div>
                </div>
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg transition-colors duration-300">
                        <button
                            onClick={() => setActiveTab("Bus")} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === "Bus" ? "bg-red-500 text-white shadow-lg" : "text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"}`}>
                            Bus Routes
                        </button>
                        <button
                            onClick={() => setActiveTab("Metro")} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === "Metro" ? "bg-red-500 text-white shadow-lg" : "text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"}`}>
                            Metro Routes
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {findRoutes.map((route, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                                            {route.routeNo}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">{route.distance}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">{route.startStop}</span>
                                        <span className="mx-3 text-red-500">→</span>
                                        <span className="font-medium">{route.endStop}</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300">
                                        View on Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
    )
}

export default SRoutes
