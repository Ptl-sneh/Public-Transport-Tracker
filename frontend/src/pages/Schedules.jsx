import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Schedules() {
    const [activeFilter, setActiveFilter] = useState("bus")
    const [searchTerm, setSearchTerm] = useState("")

    const busSchedules = [
        { routeNo: "101", startTime: "05:30", endTime: "23:00", frequency: "Every 15 mins" },
        { routeNo: "102", startTime: "06:00", endTime: "22:30", frequency: "Every 20 mins" },
        { routeNo: "103", startTime: "05:45", endTime: "23:30", frequency: "Every 12 mins" },
        { routeNo: "104", startTime: "06:15", endTime: "22:00", frequency: "Every 25 mins" },
        { routeNo: "105", startTime: "05:30", endTime: "23:15", frequency: "Every 18 mins" },
    ]

    const metroSchedules = [
        { routeNo: "Blue Line", startTime: "06:00", endTime: "23:00", frequency: "Every 8 mins" },
        { routeNo: "Red Line", startTime: "06:15", endTime: "22:45", frequency: "Every 10 mins" },
        { routeNo: "Green Line", startTime: "06:30", endTime: "22:30", frequency: "Every 12 mins" },
    ]

    const currentSchedules = activeFilter === "bus" ? busSchedules : metroSchedules

    const filteredSchedules = currentSchedules.filter((schedule) =>
        schedule.routeNo.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Navigation */}
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Schedules & Timetables</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        View timings and frequency for all transport services
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search by route or stop..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Filter Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg transition-colors duration-300">
                        <button
                            onClick={() => setActiveFilter("bus")}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeFilter === "bus"
                                    ? "bg-red-500 text-white shadow-lg"
                                    : "text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                                }`}
                        >
                            Bus
                        </button>
                        <button
                            onClick={() => setActiveFilter("metro")}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeFilter === "metro"
                                    ? "bg-red-500 text-white shadow-lg"
                                    : "text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                                }`}
                        >
                            Metro
                        </button>
                    </div>
                </div>

                {/* Timetable */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-red-500 dark:bg-red-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Route No</th>
                                    <th className="px-6 py-4 text-left font-semibold">Start Time</th>
                                    <th className="px-6 py-4 text-left font-semibold">End Time</th>
                                    <th className="px-6 py-4 text-left font-semibold">Frequency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchedules.map((schedule, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
                                                {schedule.routeNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{schedule.startTime}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{schedule.endTime}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                                                {schedule.frequency}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredSchedules.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">⏰</div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No schedules found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
                    </div>
                )}

                {/* Additional Info */}
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">📍 Real-time Updates</h3>
                        <p className="text-blue-700 dark:text-blue-300">
                            Schedules are updated in real-time based on traffic conditions and operational changes. Check the live
                            tracker for the most accurate arrival times.
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-3">💡 Pro Tip</h3>
                        <p className="text-green-700 dark:text-green-300">
                            Peak hours (8-10 AM & 6-8 PM) may have increased frequency. Plan your journey accordingly for the best
                            travel experience.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
