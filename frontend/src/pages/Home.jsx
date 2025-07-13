import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const [routeForm, setRouteForm] = useState({
        source: "",
        destination: "",
    })

    const handleRouteChange = (e) => {
        setRouteForm({
            ...routeForm,
            [e.target.name]: e.target.value,
        })
    }

    const handleRouteSubmit = (e) => {
        e.preventDefault()
        console.log("Route search:", routeForm)
    }
    const quickAccessCards = [
        {
            title: "Live Tracker",
            description: "Track buses and metros in real-time with live location updates",
            icon: "📍",
            link: "/tracker",
        },
        {
            title: "Routes",
            description: "Browse all available bus and metro routes in Ahmedabad",
            icon: "🗺️",
            link: "/routes",
        },
        {
            title: "Schedules",
            description: "View timetables and schedules for all transport services",
            icon: "⏰",
            link: "/schedules",
        },
        {
            title: "Feedback",
            description: "Share your experience and help improve public transport",
            icon: "💬",
            link: "/feedback",
        },
    ]

    const Steps = [
        {
            step: "1",
            title: "Search",
            description: "Enter your source and destination to find the best routes",
        },
        {
            step: "2",
            title: "Track",
            description: "Get real-time updates on vehicle locations and arrival times",
        },
        {
            step: "3",
            title: "Travel",
            description: "Board your transport with confidence and reach your destination",
        },
    ]
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16 mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Ahmedabad Public Transport Tracker</h1>
                <p className="text-xl opacity-90">Your smart companion for city travel</p>
            </div>

            <div className="py-12 px-4 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Quick Route Finder</h2>
                    <form onSubmit={handleRouteSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source Stop</label>
                                <input
                                    type="text"
                                    name="source"
                                    value={routeForm.source}
                                    onChange={handleRouteChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter starting point"
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
                                    onChange={handleRouteChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter destination"
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <Link href="/find-route">
                                <button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Find Route
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Quick Access</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickAccessCards.map((card, index) => (
                        <Link key={index} to={`/${card.link}`}>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                                <div className="text-4xl mb-4">{card.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{card.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className='py-16 px-4 max-w-8xl'>
                <div className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300 mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {
                            Steps.map((step, index) => {
                                return (
                                    <div className="text-center" key={index}>
                                        <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                            {step.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-3" >{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}


export default Home
