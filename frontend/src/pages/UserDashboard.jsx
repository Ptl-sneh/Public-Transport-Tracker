import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function UserDashboard() {
    const [user] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: "January 2024",
    })

    const [recentSearches] = useState([
        { id: 1, from: "Maninagar", to: "Paldi", date: "2024-01-15", time: "09:30 AM" },
        { id: 2, from: "Vastrapur", to: "Railway Station", date: "2024-01-14", time: "06:45 PM" },
        { id: 3, from: "Bopal", to: "CG Road", date: "2024-01-13", time: "08:15 AM" },
    ])

    const [savedRoutes] = useState([
        { id: 1, name: "Home to Office", route: "Maninagar → Paldi", type: "Bus" },
        { id: 2, name: "Weekend Shopping", route: "Satellite → Iscon", type: "Metro" },
        { id: 3, name: "University Route", route: "Ghatlodia → Ashram Road", type: "Bus" },
    ])

    const [submittedFeedback] = useState([
        { id: 1, comment: "Great service on Route 101!", sentiment: "Positive", date: "2024-01-15" },
        { id: 2, comment: "Metro was delayed today", sentiment: "Negative", date: "2024-01-12" },
        { id: 3, comment: "Good connectivity overall", sentiment: "Positive", date: "2024-01-10" },
    ])

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case "Positive":
                return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
            case "Negative":
                return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
            default:
                return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        }
    }

    const handleLogout = () => {
        // Handle logout logic
        alert("Logged out successfully!")
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Navigation */}
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Welcome back, {user.name}!</p>
                </div>

                {/* User Info Card */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                            <p className="opacity-90">{user.email}</p>
                            <p className="opacity-75 text-sm">Member since {user.joinDate}</p>
                        </div>
                        <div className="text-6xl opacity-50">👤</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Searches */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Searches</h2>
                        <div className="space-y-4">
                            {recentSearches.map((search) => (
                                <div
                                    key={search.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all duration-300 bg-gray-50 dark:bg-gray-750"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">{search.from}</span>
                                            <span className="mx-2 text-red-500">→</span>
                                            <span className="font-medium">{search.to}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>{search.date}</span>
                                        <span>{search.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {recentSearches.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">🔍</div>
                                <p className="text-gray-500 dark:text-gray-400">No recent searches</p>
                            </div>
                        )}
                    </div>

                    {/* Saved Routes */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Routes</h2>
                        <div className="space-y-4">
                            {savedRoutes.map((route) => (
                                <div
                                    key={route.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all duration-300 bg-gray-50 dark:bg-gray-750"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{route.name}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${route.type === "Bus"
                                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                                                    : "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                                                }`}
                                        >
                                            {route.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{route.route}</p>
                                </div>
                            ))}
                        </div>
                        {savedRoutes.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">⭐</div>
                                <p className="text-gray-500 dark:text-gray-400">No saved routes</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submitted Feedback */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submitted Feedback</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {submittedFeedback.map((feedback) => (
                            <div
                                key={feedback.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all duration-300 bg-gray-50 dark:bg-gray-750"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor(feedback.sentiment)}`}
                                    >
                                        {feedback.sentiment}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{feedback.date}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feedback.comment}</p>
                            </div>
                        ))}
                    </div>
                    {submittedFeedback.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">💬</div>
                            <p className="text-gray-500 dark:text-gray-400">No feedback submitted yet</p>
                        </div>
                    )}
                </div>

                {/* Account Settings */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300">
                            Change Email
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300">
                            Change Password
                        </button>
                        <button className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300">
                            Preferences
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center border border-blue-100 dark:border-blue-800 transition-colors duration-300">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{recentSearches.length}</div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Recent Searches</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-800 transition-colors duration-300">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{savedRoutes.length}</div>
                        <p className="text-green-700 dark:text-green-300 font-medium">Saved Routes</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl text-center border border-orange-100 dark:border-orange-800 transition-colors duration-300">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                            {submittedFeedback.length}
                        </div>
                        <p className="text-orange-700 dark:text-orange-300 font-medium">Feedback Given</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
