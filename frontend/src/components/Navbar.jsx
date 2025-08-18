import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded JWT:", decoded);

                // ✅ Try to extract username safely
                const extractedName =
                    decoded.username ||
                    decoded.name ||
                    decoded.email ||
                    decoded.sub ||      // common in some JWTs
                    `User-${decoded.user_id || ""}`;

                setUsername(extractedName);
            } catch (error) {
                console.error("Failed to decode JWT:", error);
                setUsername(null);
            }
        } else {
            setUsername(null);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUsername(null);
        navigate("/");
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-red-500 hover:text-red-600 transition-colors">
                        APTT
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/home" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Home</Link>
                        <Link to="/routes" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Routes</Link>
                        <Link to="/findroute" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Find Route</Link>
                        <Link to="/schedules" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Schedules</Link>
                        <Link to="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Feedback</Link>
                        <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Dashboard</Link>
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {username ? (
                            <>
                                <span className="text-gray-600 dark:text-gray-300">Hi, {username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-300">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                        <div className="flex flex-col space-y-4">
                            <Link to="/home" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Home</Link>
                            <Link to="/routes" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Routes</Link>
                            <Link to="/findroute" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Find Route</Link>
                            <Link to="/schedules" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Schedules</Link>
                            <Link to="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Feedback</Link>
                            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Dashboard</Link>

                            {/* Mobile Auth Buttons */}
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {username ? (
                                    <>
                                        <span className="text-gray-600 dark:text-gray-300">Hi, {username}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 text-left"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login">
                                            <button className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors text-left">
                                                Login
                                            </button>
                                        </Link>
                                        <Link to="/register">
                                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 text-left">
                                                Sign Up
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
