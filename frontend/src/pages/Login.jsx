import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/LoginApi';
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        try {
            const res = await loginUser(formData.username, formData.password);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            alert('Login successful 🎉');
            navigate('/home');
        } catch (err) {
            const errMsg = err.res?.data?.detail || "Login failed. Please try again.";
            alert(errMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black px-4">
            <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">

                {/* Header Icon + Title */}
                <div className="text-center">
                    <FaSignInAlt className="w-12 h-12 text-orange-500 mx-auto mb-3 animate-pulse" />
                    <h2 className="text-3xl font-extrabold text-white">Welcome Back!</h2>
                    <p className="text-gray-300 mt-1">Login to your account to continue 🚀</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="h-12 w-full rounded-lg px-4 bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-1">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="h-12 w-full rounded-lg px-4 pr-12 bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition"
                            >
                                {showPassword ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-orange-500/40 transition transform"
                    >
                        Login
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6 border-t border-gray-700 pt-4">
                    <p className="text-gray-300">
                        Don’t have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-orange-500 hover:text-orange-400 transition underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
