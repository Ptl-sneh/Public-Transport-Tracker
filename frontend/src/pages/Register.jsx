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

        // block if errors exist
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-5 shadow-2xl bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <FaUserPlus className="w-10 h-10 text-orange-600 mx-auto" />
                <p className="text-2xl font-bold text-center text-white">Create an Account</p>
                <p className="text-center text-white text-base">Sign up to access live tracking and feedback</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium text-white">User name</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`h-12 border rounded px-3 w-full focus:ring-orange-500 ${touched.username && errors.username
                                    ? 'border-red-400'
                                    : 'border-gray-200 focus:border-orange-500'
                                }`}
                        />
                        {touched.username && errors.username && (
                            <p className="text-red-500 text-sm">{errors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-white">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`h-12 border rounded px-3 w-full focus:ring-orange-500 ${touched.email && errors.email
                                    ? 'border-red-400'
                                    : 'border-gray-200 focus:border-orange-500'
                                }`}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-white">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`h-12 pr-12 border rounded px-3 w-full focus:ring-orange-500 ${touched.password && errors.password
                                        ? 'border-red-400'
                                        : 'border-gray-200 focus:border-orange-500'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>

                        {/* Live password strength rules */}
                        <ul className="text-sm mt-2 space-y-1">
                            <li className={passwordRules.length(formData.password) ? 'text-green-600' : 'text-red-500'}>
                                • At least 8 characters
                            </li>
                            <li className={passwordRules.upper(formData.password) ? 'text-green-600' : 'text-red-500'}>
                                • At least one uppercase letter
                            </li>
                            <li className={passwordRules.number(formData.password) ? 'text-green-600' : 'text-red-500'}>
                                • At least one number
                            </li>
                            <li className={passwordRules.special(formData.password) ? 'text-green-600' : 'text-red-500'}>
                                • At least one special character (@$!%*?&#)
                            </li>
                        </ul>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-medium text-white">Confirm Password</label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`h-12 pr-12 border rounded px-3 w-full focus:ring-orange-500 ${touched.confirmPassword && errors.confirmPassword
                                        ? 'border-red-400'
                                        : 'border-gray-200 focus:border-orange-500'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>
                        {formData.confirmPassword && (
                            <p
                                className={`text-sm ${formData.confirmPassword === formData.password ? 'text-green-600' : 'text-red-500'
                                    }`}
                            >
                                {formData.confirmPassword === formData.password
                                    ? '✅ Passwords match'
                                    : '❌ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] rounded"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-white">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-orange-600 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
