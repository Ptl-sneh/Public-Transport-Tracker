import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/LoginApi';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRules = {
        length: (pwd) => pwd.length >= 8,
        upper: (pwd) => /[A-Z]/.test(pwd),
        number: (pwd) => /\d/.test(pwd),
        special: (pwd) => /[@$!%*?&#]/.test(pwd)
    };

    const errors = {
        username:
            !formData.username.trim()
                ? 'Username is required'
                : formData.username.length < 3
                    ? 'Username must be at least 3 characters'
                    : '',
        email:
            !formData.email
                ? 'Email is required'
                : !emailRegex.test(formData.email)
                    ? 'Invalid email format'
                    : '',
        password:
            !formData.password
                ? 'Password is required'
                : !Object.values(passwordRules).every((rule) => rule(formData.password))
                    ? 'Password does not meet requirements'
                    : '',
        confirmPassword:
            !formData.confirmPassword
                ? 'Please confirm your password'
                : formData.confirmPassword !== formData.password
                    ? 'Passwords do not match'
                    : ''
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some((err) => err !== '')) return;

        try {
            await registerUser(formData.username, formData.email, formData.password);
            alert('Registered successfully!');
            navigate('/login');
        } catch (err) {
            const error = err.response?.data?.error || 'Registration failed. Try again.';
            alert(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black px-4">
            <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">

                {/* Icon + Title */}
                <div className="text-center">
                    <FaUserPlus className="w-12 h-12 text-orange-500 mx-auto mb-3 animate-bounce" />
                    <h2 className="text-3xl font-extrabold text-white">Create an Account</h2>
                    <p className="text-gray-300 mt-1">Sign up to access live tracking & feedback 🚀</p>
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
                            onBlur={handleBlur}
                            className={`h-12 w-full rounded-lg px-4 bg-gray-900/70 text-white placeholder-gray-400 
              border ${touched.username && errors.username ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'} 
              focus:ring-2 focus:ring-orange-500 outline-none transition`}
                        />
                        {touched.username && errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`h-12 w-full rounded-lg px-4 bg-gray-900/70 text-white placeholder-gray-400 
              border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'} 
              focus:ring-2 focus:ring-orange-500 outline-none transition`}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-1">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`h-12 w-full rounded-lg px-4 pr-12 bg-gray-900/70 text-white placeholder-gray-400 
                border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'} 
                focus:ring-2 focus:ring-orange-500 outline-none transition`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>

                        {/* Password Strength */}
                        <ul className="mt-2 text-sm space-y-1">
                            <li className={passwordRules.length(formData.password) ? 'text-green-500' : 'text-red-500'}>
                                • At least 8 characters
                            </li>
                            <li className={passwordRules.upper(formData.password) ? 'text-green-500' : 'text-red-500'}>
                                • At least one uppercase letter
                            </li>
                            <li className={passwordRules.number(formData.password) ? 'text-green-500' : 'text-red-500'}>
                                • At least one number
                            </li>
                            <li className={passwordRules.special(formData.password) ? 'text-green-500' : 'text-red-500'}>
                                • At least one special character
                            </li>
                        </ul>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`h-12 w-full rounded-lg px-4 pr-12 bg-gray-900/70 text-white placeholder-gray-400 
                border ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'} 
                focus:ring-2 focus:ring-orange-500 outline-none transition`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition"
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>
                        {formData.confirmPassword && (
                            <p className={`mt-2 text-sm ${formData.confirmPassword === formData.password ? 'text-green-500' : 'text-red-500'}`}>
                                {formData.confirmPassword === formData.password
                                    ? '✅ Passwords match'
                                    : '❌ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg shadow-lg 
            hover:scale-105 hover:shadow-orange-500/40 transition transform"
                    >
                        Register
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6 border-t border-gray-700 pt-4">
                    <p className="text-gray-300">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-orange-500 hover:text-orange-400 transition underline"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
