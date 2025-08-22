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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-700">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
                        Bus Schedules & Timetables
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        View timings and frequency for all bus routes
                    </p>
                </section>

                {/* Search Bar */}
                <section className="max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search by route number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-400 focus:border-transparent shadow-md transition duration-300"
                        aria-label="Search bus schedules by route number"
                    />
                </section>

                {/* Schedule Table */}
                <section className="overflow-x-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
                    <table className="w-full border-collapse">
                        <thead className="bg-red-600 text-white sticky top-0 z-10 select-none">
                            <tr>
                                {["Route No", "Start Time", "End Time", "Frequency"].map((heading) => (
                                    <th key={heading} className="px-6 py-4 text-left font-semibold">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule, i) => (
                                <tr
                                    key={i}
                                    onClick={() => openTripsModal(schedule)}
                                    className="cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                </section>

                {/* No Results */}
                {filteredSchedules.length === 0 && (
                    <section className="text-center py-16 max-w-xl mx-auto">
                        <div className="text-gray-400 dark:text-gray-500 text-7xl mb-5 select-none">⏰</div>
                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            No schedules found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Try adjusting your search terms
                        </p>
                    </section>
                )}

            </main>

            {/* Trips Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Trips Modal"
                className="w-full max-w-4xl mx-auto mt-24 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 outline-none max-h-[80vh] overflow-y-auto backdrop-blur"
                overlayClassName="fixed inset-0 bg-opacity-40 backdrop-blur flex justify-center items-start z-50"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Trips for Route {selectedRoute?.routeNo}
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-red-400 transition"
                    >
                        Close
                    </button>
                </div>

                {trips.length > 0 ? (
                    <ul className="space-y-4">
                        {trips.map((trip, idx) => (
                            <li key={idx} className="p-5 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm">
                                <p className="text-gray-800 dark:text-gray-200">
                                    <span className="font-semibold">Trip No:</span> {idx + 1}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200">
                                    <span className="font-semibold">Departure:</span> {trip.departure_time}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200">
                                    <span className="font-semibold">Arrival:</span> {trip.arrival_time}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center">No trips available.</p>
                )}
            </Modal>

            <BackToTop />
            <Footer />
        </div>
    )
}
