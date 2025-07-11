import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-30 bg-white/90 backdrop-blur-sm shadow-md">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <FaTrain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">TransitTrack</h1>
                            <p className="text-xs text-gray-600">Your journey, tracked</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Link to="/login">
                            <button className="border border-orange-200 text-orange-600 px-4 py-2 rounded hover:bg-orange-50">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded hover:from-orange-600 hover:to-red-600">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Track Your Journey
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                            in Real Time
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Stay informed about your public transport with live tracking, real-time updates,
                        and community feedback. Never miss your ride again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-6 h-auto rounded text-white">
                                Get Started Free
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="border border-orange-200 text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 h-auto rounded hover:text-black">
                                I Have an Account
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="border-0 w-100 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow rounded-lg px-6 py-6">
                        <div className="text-center pb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                {/* <MapPin className="w-6 h-6 text-white" /> */}
                            </div>
                            <p className="text-xl text-gray-900">Live Tracking</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-center">
                                See exactly where your bus or train is in real-time with GPS tracking and accurate arrival predictions.
                            </p>
                        </div>
                    </div>

                    <div className="border-0 w-100 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow rounded-lg px-6 py-6">
                        <div className="text-center pb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                {/* <Clock className="w-6 h-6 text-white" /> */}
                            </div>
                            <p className="text-xl text-gray-900">Smart Alerts</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-center">
                                Get notified about delays, route changes, and optimal departure times to never miss your connection.
                            </p>
                        </div>
                    </div>

                    <div className="border-0 w-100 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow rounded-lg px-6 py-6">
                        <div className="text-center pb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                {/* <Users className="w-6 h-6 text-white" /> */}
                            </div>
                            <p className="text-xl text-gray-900">Community Feedback</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-center">
                                Share and receive real-time updates from other commuters about crowding, delays, and service quality.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
