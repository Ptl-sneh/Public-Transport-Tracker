import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

const FRoutes = () => {
    const [routeForm, setRouteForm] = useState({
        source: "",
        destination: "",
    })
    const [searchResults, setSearchResults] = useState([])
    const [isSearched, setIsSearched] = useState(false)

    const handleChange = (e) => {
        setRouteForm({
            ...routeForm,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Simulate search results
        const mockResults = [
            {
                id: 1,
                type: "Bus",
                route: "Route 101 → Route 205",
                changeover: "CG Road",
                time: "45 mins",
                fare: "₹25",
                steps: [
                    "Take Bus 101 from " + routeForm.source,
                    "Change at CG Road",
                    "Take Bus 205 to " + routeForm.destination,
                ],
            },
            {
                id: 2,
                type: "Metro",
                route: "Blue Line",
                changeover: "None",
                time: "35 mins",
                fare: "₹30",
                steps: ["Take Metro Blue Line from nearest station", "Direct route to destination"],
            },
            {
                id: 3,
                type: "Bus + Metro",
                route: "Route 103 → Blue Line",
                changeover: "Thaltej Metro Station",
                time: "50 mins",
                fare: "₹35",
                steps: [
                    "Take Bus 103 from " + routeForm.source,
                    "Change to Metro at Thaltej",
                    "Take Blue Line to " + routeForm.destination,
                ],
            },
        ]
        setSearchResults(mockResults)
        setIsSearched(true)
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Navigation */}
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Plan Your Journey</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Find the best route between any two stops</p>
                </div>

                {/* Search Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source Stop</label>
                                <input
                                    type="text"
                                    name="source"
                                    value={routeForm.source}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter starting point"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Destination Stop
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={routeForm.destination}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter destination"
                                    required
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Find Route
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {isSearched && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Route Suggestions */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Route Suggestions</h2>
                            <div className="space-y-4">
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${result.type === "Bus"
                                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                                                    : result.type === "Metro"
                                                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                                                        : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                                                    }`}
                                            >
                                                {result.type}
                                            </span>
                                            <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>⏱️ {result.time}</span>
                                                <span>💰 {result.fare}</span>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{result.route}</h3>

                                        {result.changeover !== "None" && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <span className="font-medium">Changeover:</span> {result.changeover}
                                            </p>
                                        )}

                                        <div className="space-y-1">
                                            {result.steps.map((step, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                                        {index + 1}
                                                    </span>
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Route Map</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-96 flex items-center justify-center transition-colors duration-300">
                                <div className="text-center">
                                    <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">🗺️</div>
                                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Interactive Map</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Route visualization will be displayed here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isSearched && (
                    <div className="text-center py-12">
                        <div className="text-gray-300 dark:text-gray-600 text-6xl mb-4">🚌</div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Ready to find your route?</h3>
                        <p className="text-gray-500 dark:text-gray-400">Enter your source and destination above to get started</p>
                    </div>
                )}
            </div>
            <Footer />  
        </div>
    )
}

export default FRoutes
