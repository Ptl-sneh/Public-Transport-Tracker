import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-red-400 mb-4">Ahmedabad Public Transport Tracker</h3>
                        <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-4">
                            Making public transport accessible and convenient for everyone in Ahmedabad. Track buses, metros, and plan
                            your journeys with real-time information.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                <span className="text-white font-bold">f</span>
                            </div>
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                <span className="text-white font-bold">t</span>
                            </div>
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                <span className="text-white font-bold">i</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            <Link
                                to="/home"
                                className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/routes"
                                className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Routes
                            </Link>
                            <Link
                                to="/findroute"
                                className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Find Route
                            </Link>
                            <Link
                                to="/schedules"
                                className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Schedules
                            </Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <div className="space-y-2">
                            <Link
                                to="/feedback"
                                className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Feedback
                            </Link>
                            <Link
                                to="/dashboard"
                                className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link to="#" className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors">
                                Help Center
                            </Link>
                            <Link to="#" className="block text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-700 dark:border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-4 md:mb-0">
                            © 2025 Ahmedabad Public Transport Tracker. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
