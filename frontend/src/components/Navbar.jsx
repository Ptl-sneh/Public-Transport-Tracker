import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            let access = localStorage.getItem("access");
            const refresh = localStorage.getItem("refresh");

            try {
                const res = await axios.get("http://127.0.0.1:8000/api/auth/me/", {
                    headers: { Authorization: `Bearer ${access}` },
                });
                setUsername(res.data.username);
            } catch (err) {
                if (err.response?.status === 401 && refresh) {
                    try {
                        const refreshRes = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", { refresh });
                        access = refreshRes.data.access;
                        localStorage.setItem("access", access);
                        const res = await axios.get("http://127.0.0.1:8000/api/auth/me/", {
                            headers: { Authorization: `Bearer ${access}` },
                        });
                        setUsername(res.data.username);
                    } catch (refreshErr) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                }
            }
        };
        fetchUser();
    }, []);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUsername(null);
        navigate("/");
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center py-5 md:py-4">
                    {/* Logo */}
                    <div className="flex items-center space-x-3 cursor-pointer select-none">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                            <FaTrain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <Link to="/" className="text-2xl font-extrabold text-red-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded">
                                APTT
                            </Link>
                            <p className="text-xs text-gray-300 dark:text-gray-400 select-none">Your journey, tracked</p>
                        </div>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-10 text-lg font-medium">
                        {["home", "routes", "findroute", "schedules", "feedback"].map((path) => (
                            <Link
                                key={path}
                                to={`/${path === "home" ? "home" : path}`}
                                className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition-colors"
                            >
                                {path.charAt(0).toUpperCase() + path.slice(1)}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-5">
                        {username ? (
                            <>
                                <span className="text-gray-600 dark:text-gray-300 select-none">Hi, {username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-400"
                                    aria-label="Logout"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded">
                                    Login
                                </Link>
                                <Link to="/register">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-400">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-5 px-4 space-y-5 animate-fade-in-down">
                        {["home", "routes", "findroute", "schedules", "feedback"].map((path) => (
                            <Link
                                key={path}
                                to={`/${path === "home" ? "home" : path}`}
                                className="block text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                {path.charAt(0).toUpperCase() + path.slice(1)}
                            </Link>
                        ))}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                            {username ? (
                                <>
                                    <span className="text-gray-600 dark:text-gray-300 block select-none">Hi, {username}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-400"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <button className="w-full text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-left px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 rounded">
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-400">
                                            Sign Up
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
