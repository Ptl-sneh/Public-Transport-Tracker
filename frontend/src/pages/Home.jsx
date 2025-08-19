import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import yourL from '../icons/YRH.png'
import BS from '../icons/BusStop.png'
import Api from '../api/Api'

const you_are_here = L.icon({
    iconUrl: yourL,
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const Busstop = L.icon({
    iconUrl: BS,
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

function RecenterMap({ center }) {
    const map = useMap()
    map.setView(center)
    return null
}

const Home = () => {
    const [user, setUser] = useState(null)
    const [favourites, setFavourites] = useState([])
    const [submittedFeedback, setSubmittedFeedback] = useState([])
    const [currentLocation, setCurrentLocation] = useState([23.0225, 72.5714]) // Default Ahmedabad
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [nearestStops, setNearestStops] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✅ Fetch user info
                const userRes = await Api.get("/auth/me/")
                setUser({
                    name: userRes.data.username,
                    email: userRes.data.email,
                    joinDate: userRes.data.date_joined?.split("T")[0] || "N/A",
                })

                // ✅ Fetch user favourites
                const favRes = await Api.get("/favourites/user/")
                setFavourites(Array.isArray(favRes.data) ? favRes.data : [])

                // ✅ Fetch user feedback
                const fbRes = await Api.get("/feedback/user/")
                setSubmittedFeedback(Array.isArray(fbRes.data) ? fbRes.data : [])

                // ✅ Get user’s current location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const { latitude, longitude } = pos.coords
                            setCurrentLocation([latitude, longitude])

                            // Fetch nearest stops
                            Api.get(`/stops/nearby/?lat=${latitude}&lng=${longitude}`)
                                .then(res => setNearestStops(res.data))
                                .catch(err => console.error(err))
                        },
                        (err) => console.error(err)
                    )
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err)
                setError("Failed to load dashboard data.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

    const positiveFeedbackCount = submittedFeedback.filter(
        (fb) => fb.sentiment === "Positive"
    ).length

    const feedbackPercentage =
        submittedFeedback.length > 0
            ? Math.round((positiveFeedbackCount / submittedFeedback.length) * 100)
            : 0

    const handleLogout = () => {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh") // ✅ Clear both
        window.location.href = "/login"
    }

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading your dashboard...
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Welcome back, {user?.name}!
                    </p>
                </div>

                {/* User Info */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                            <p className="opacity-90">{user?.email}</p>
                            <p className="opacity-75 text-sm">
                                Member since {user?.joinDate}
                            </p>
                        </div>
                        <div className="text-6xl opacity-50">👤</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Your Location
                    </h2>
                    <MapContainer
                        center={currentLocation}
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                        className="z-0 rounded-xl"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        {nearestStops.map((stopObj, index) => (
                            <Marker
                                key={index}
                                position={[stopObj.stop.latitude, stopObj.stop.longitude]}
                                icon={Busstop}
                            >
                                <Popup>
                                    <b>{stopObj.stop.name}</b><br />
                                </Popup>
                            </Marker>
                        ))}

                        {/* User marker */}
                        <Marker position={currentLocation} icon={you_are_here}>
                            <Popup>You are here</Popup>
                        </Marker>
                        {/* ✅ This will recenter when currentLocation updates */}
                        <RecenterMap center={currentLocation} />
                    </MapContainer>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Map */}


                    {/* Favourites */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 max-h-[400px] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Saved Routes
                        </h2>
                        {favourites.length > 0 ? (
                            <div className="space-y-4">
                                {favourites.map((route) => (
                                    <div
                                        key={route.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all duration-300 bg-gray-50 dark:bg-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {route.route_identifier}
                                            </h3>
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                                Bus
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {route.source} → {route.destination}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No saved routes yet
                            </div>
                        )}
                    </div>

                    {/* Submitted Feedback */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-h-[400px] overflow-y-auto shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Submitted Feedback
                        </h2>
                        {submittedFeedback.length > 0 ? (
                            <div className="space-y-4">
                                {submittedFeedback.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all duration-300 bg-gray-50 dark:bg-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor(
                                                    feedback.sentiment
                                                )}`}
                                            >
                                                {feedback.sentiment}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {feedback.created_at?.split("T")[0]}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                            {feedback.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No feedback submitted yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Account Settings
                    </h2>
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

                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center border border-blue-100 dark:border-blue-800 transition-colors duration-300">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{feedbackPercentage}%</div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Positive Feedback</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-800 transition-colors duration-300">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{favourites.length}</div>
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


export default Home