import React from 'react'
import { Link } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';
import BackToTop from '../components/BackToTop';

const Landing = () => {
    return (
        <>
            {/* Page Wrapper */}
            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">

                {/* Navbar */}
                <div className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

                        {/* Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                                <FaTrain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-orange-600 tracking-wide">APTT</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Your journey, tracked</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3">
                            <Link to="/login">
                                <button className="px-5 py-2 border border-orange-400 text-orange-600 font-medium rounded-full hover:bg-orange-100 dark:hover:bg-orange-600 dark:hover:text-white transition-all">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="flex items-center justify-center text-center max-w-5xl mx-auto px-6 pt-24 pb-20">
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent mb-6 leading-tight">
                            Ahmedabad Public <br />
                            <span className="block">Transport Tracker</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Track Buses 🚍, Easily Plan Your Daily Trips in One Place
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <button className="px-10 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-transform">
                                    Get Started Free
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="px-10 py-4 rounded-full text-lg font-semibold border border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-800 hover:text-black transition">
                                    I Have an Account
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <h2 className="animate-fade-in-up text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        Why Choose Our App?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Card 1 */}
                        <div className="animate-fade-in-up bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-lg hover:shadow-orange-500/30 transition-transform hover:-translate-y-2 backdrop-blur-md">
                            <div className="text-5xl mb-4">📍</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Live Tracker</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Real-time location of buses with accurate arrival times, no more guessing!
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="animate-fade-in-up bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-lg hover:shadow-orange-500/30 transition-transform hover:-translate-y-2 backdrop-blur-md">
                            <div className="text-5xl mb-4">🗺️</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Route Finder</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Discover the best routes between stops with buses.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="animate-fade-in-up bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-lg hover:shadow-orange-500/30 transition-transform hover:-translate-y-2 backdrop-blur-md">
                            <div className="text-5xl mb-4">⏰</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-time Schedules</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Live updated schedules & timetables across all city transport services in one place.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="max-w-5xl mx-auto text-center px-6 py-20">
                    <h2 className="animate-fade-in-up text-4xl font-bold text-gray-900 dark:text-white mb-8">
                        About Ahmedabad Transport
                    </h2>
                    <p className="animate-fade-in-up text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
                        Ahmedabad’s public transport system serves millions daily via buses 🚌.
                        Our app makes navigation seamless — plan routes, see live arrivals, and travel stress-free.
                        Whether daily commuting or city exploration, we’ve got you covered.
                    </p>
                </section>

                {/* Footer */}
                <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 py-16 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <h3 className="text-2xl font-extrabold text-orange-500 mb-4">
                            Ahmedabad Public Transport Tracker
                        </h3>
                        <p className="text-gray-400 mb-6">
                            © 2025 - Making public transport smarter, faster & accessible for everyone 🚀
                        </p>
                        <div className="flex justify-center space-x-6 text-gray-400 text-lg">
                            <a href="https://www.facebook.com/" className="hover:text-orange-400 transition">Facebook</a>
                            <a href="https://x.com/" className="hover:text-orange-400 transition">Twitter</a>
                            <a href="https://www.linkedin.com/in/ptlsneh/" className="hover:text-orange-400 transition">Linkedin</a>
                            <a href="https://github.com/Ptl-sneh" className="hover:text-orange-400 transition">Github</a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Back-to-top button */}
            <BackToTop />
        </>
    )
}

export default Landing;
