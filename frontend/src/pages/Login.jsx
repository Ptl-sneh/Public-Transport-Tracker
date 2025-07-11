import React from 'react'
import { FaTrain } from 'react-icons/fa';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle login logic here
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                    <FaTrain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">TransitTrack</h1>
                <p className="text-gray-600 text-sm">Your journey, tracked</p>
            </div>
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-5 shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
                <p className="text-2xl font-bold text-center text-gray-900">Welcome Back!</p>
                <p className="text-center text-gray-600 text-base">Login to your account to continue</p>

                <div className="mt-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="h-12 border border-gray-200 rounded px-3 w-full focus:border-orange-500 focus:ring-orange-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="h-12 pr-12 border border-gray-200 rounded px-3 w-full focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible className="w-5 h-5" />
                                    ) : (
                                        <AiOutlineEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] rounded"
                        >
                            Login
                        </button>
                    </form>
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors hover:underline"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
