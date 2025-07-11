import React from 'react'
import { FaTrain , FaUserPlus} from 'react-icons/fa';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register form submitted:', formData);
    // Add your register logic here
      };
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                    <FaTrain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">TransitTrack</h1>
                <p className="text-gray-600 text-sm">Your journey, tracked</p>
            </div>
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-5 shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
                <FaUserPlus className="w-10 h-10 text-orange-600 mx-auto" />
                <p className="text-2xl font-bold text-center text-gray-900">Create an Account</p>
                <p className="text-center text-gray-600 text-base">Sign up to access live tracking and feedback</p>

                <div className="mt-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="h-12 border border-gray-200 rounded px-3 w-full focus:border-orange-500 focus:ring-orange-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="h-12 border border-gray-200 rounded px-3 w-full focus:border-orange-500 focus:ring-orange-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
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

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="h-12 pr-12 border border-gray-200 rounded px-3 w-full focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showConfirmPassword ? (
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
                            Register
                        </button>
                    </form>
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
