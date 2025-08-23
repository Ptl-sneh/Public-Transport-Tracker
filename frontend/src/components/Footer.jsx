import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Main footer grid */}
                <div className="grid md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-3xl font-bold text-red-400">Ahmedabad Public Transport Tracker</h3>
                        <p className="text-gray-300 dark:text-gray-400 leading-relaxed text-lg">
                            Making public transport accessible and convenient for everyone in Ahmedabad. Track buses, metros, and plan your journeys with real-time information.
                        </p>
                        <div className="flex space-x-6">
                            {[
                                { href: "https://www.facebook.com/", icon: <FaFacebookF className="w-6 h-6" />, label: "Facebook" },
                                { href: "https://x.com/", icon: <FaTwitter className="w-6 h-6" />, label: "Twitter" },
                                { href: "https://www.linkedin.com/in/ptlsneh/", icon: <FaLinkedinIn className="w-6 h-6" />, label: "LinkedIn" },
                                { href: "https://github.com/Ptl-sneh", icon: <FaGithub className="w-6 h-6" />, label: "GitHub" },
                            ].map(({ href, icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                                    aria-label={label}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
                        <nav className="flex flex-col space-y-3 text-lg">
                            {[
                                { to: "/home", label: "Home" },
                                { to: "/routes", label: "Routes" },
                                { to: "/findroute", label: "Find Route" },
                                { to: "/schedules", label: "Schedules" },
                            ].map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6">Support</h4>
                        <nav className="flex flex-col space-y-3 text-lg">
                            {[
                                { to: "/feedback", label: "Feedback" },
                            ].map(({ to, label }) => (
                                <Link
                                    key={label}
                                    to={to}
                                    className="text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom footer */}
                <div className="border-t border-gray-700 dark:border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center text-center text-gray-400 dark:text-gray-500 text-sm space-y-4 md:space-y-0">
                    <p>© 2025 Ahmedabad Public Transport Tracker. All rights reserved.</p>
                    <div className="flex space-x-8">
                        {[
                            { href: "#", label: "Privacy Policy" },
                            { href: "#", label: "Terms of Service" },
                            { href: "#", label: "Cookie Policy" }
                        ].map(({ href, label }) => (
                            <a
                                key={label}
                                href={href}
                                className="hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
