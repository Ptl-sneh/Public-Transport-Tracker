import React from 'react'
import { Link } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';
import BackToTop from '../components/BackToTop';

const Landing = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="animate-fade-in-up max-w-8xl mx-auto px-4 sm:px-6 lg:px-30 bg-white dark:bg-gray-900 backdrop-blur-sm shadow-md">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                <FaTrain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-red-500 hover:text-red-600 transition-colors">APTT</h1>
                                <p className="text-xs text-white">Your journey, tracked</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link to="/login">
                                <button className="border border-orange-200 text-orange-600 px-4 py-2 rounded-[50px] hover:bg-orange-50 hover:cursor-pointer">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-[50px] hover:from-orange-600 hover:to-red-600 hover:cursor-pointer">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 text-center max-w-4xl mx-auto">
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Ahmedabad Public
                            <span className="text-red-500 block">Ahmedabad Public Transport Tracker</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Track Buses, Metros & Plan Your Trip Instantly
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-6 h-auto rounded-[50px] text-white hover:cursor-pointer">
                                    Get Started Free
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="border border-orange-400 text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 h-auto rounded-[50px] hover:text-black hover:cursor-pointer">
                                    I Have an Account
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="animate-fade-in-up text-4xl font-bold text-center text-gray-900 mb-16">Why Choose Our App?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="animate-fade-in-up bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ">
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Live Tracker</h3>
                            <p className="text-gray-500 leading-relaxed">Real-time location tracking of buses and metros with accurate arrival times</p>
                        </div>
                        <div className="animate-fade-in-up bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ">
                            <div className="text-4xl mb-4">🗺️</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Route Finder</h3>
                            <p className="text-gray-500 leading-relaxed">Find the best routes between any two stops with multiple transport options</p>
                        </div>
                        <div className="animate-fade-in-up bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ">
                            <div className="text-4xl mb-4">⏰</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Real-time Schedules</h3>
                            <p className="text-gray-500 leading-relaxed">Updated schedules and timetables for all public transport services</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl sm:px-6 lg:px-8 py-16 mx-auto text-center">
                    <h2 className="animate-fade-in-up text-4xl font-bold text-white mb-8">About Ahmedabad Transport</h2>
                    <p className="animate-fade-in-up text-lg text-gray-500 leading-relaxed">
                        Ahmedabad's public transport system connects millions of people daily through an extensive network of buses
                        and metro services. Our app makes it easier than ever to navigate the city, plan your journeys, and stay
                        updated with real-time information. Whether you're a daily commuter or a visitor exploring the city, we've
                        got you covered with comprehensive transport solutions.
                    </p>
                </div>
                <footer className="bg-gray-900 text-white py-12 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h3 className="text-2xl font-bold mb-4">Ahmedabad Public Transport Tracker</h3>
                        <p className="text-gray-400">© 2025 - Making public transport accessible for everyone</p>
                    </div>
                </footer>
            </div>
            <BackToTop/>
        </>
    )
}
export default Landing
