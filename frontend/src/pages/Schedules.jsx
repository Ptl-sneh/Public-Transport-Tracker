import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import axios from "axios"
import Modal from "react-modal"
import BackToTop from "../components/BackToTop"

Modal.setAppElement("#root") // important for accessibility

export default function Schedules() {
    const [searchTerm, setSearchTerm] = useState("")
    const [schedules, setSchedules] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState(null)
    const [trips, setTrips] = useState([])

    // Fetch schedules from backend
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/bus-schedules/")
            .then((res) => setSchedules(res.data))
            .catch((err) => console.error("Error fetching schedules:", err))
    }, [])

    // Filter schedules
    const filteredSchedules = schedules.filter((schedule) =>
        schedule.routeNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    

    // Open modal and fetch trips for the route
    const openTripsModal = (route) => {
        console.log('route',route)
        setSelectedRoute(route)
        setIsModalOpen(true)
        axios.get(`http://127.0.0.1:8000/api/bus-routes/${route.route_id}/trips/`)
            .then((res) => setTrips(res.data))
            .catch((err) => console.error("Error fetching trips:", err))
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Bus Schedules & Timetables
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        View timings and frequency for all bus routes
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search by route number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Timetable */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-red-500 text-white">
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
                                        onClick={() => openTripsModal(schedule)}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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

                {/* No results */}
                {filteredSchedules.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">⏰</div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            No schedules found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>

            {/* Trips Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Trips Modal"
                className="w-full max-w-5xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 outline-none max-h-[80vh] overflow-y-auto "
                overlayClassName="fixed inset-0 backdrop-blur flex justify-center items-start z-50"
            >
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">
                        Trips for Route {selectedRoute?.routeNo}
                    </h2>

                    <div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition hover:cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {trips.length > 0 ? (
                    <ul className="space-y-3">
                        {trips.map((trip, idx) => (
                            <li
                                key={idx}
                                className="p-4 border rounded-lg bg-gray-700 shadow-sm"
                            >
                                <p className="text-gray-800 dark:text-gray-200">
                                    <span className="font-semibold">Trip No:</span>{" "}
                                    {idx+1}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200">
                                    <span className="font-semibold">Departure:</span>{" "}
                                    {trip.departure_time}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200">
                                    <span className="font-semibold">Arrival:</span>{" "}
                                    {trip.arrival_time}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No trips available.</p>
                )}
            </Modal>
            <BackToTop/>
            <Footer />
        </div>
    )
}
