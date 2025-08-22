import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import yourL from '../icons/you-are-here.png'
import BS from '../icons/bus.png'
import Api from '../api/Api'
import BackToTop from "../components/BackToTop"

const you_are_here = L.icon({
    iconUrl: yourL,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});
const Busstop = L.icon({
    iconUrl: BS,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});
function RecenterMap({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

const Home = () => {
    const [user, setUser] = useState(null)
    const [favourites, setFavourites] = useState([])
    const [submittedFeedback, setSubmittedFeedback] = useState([])
    const [currentLocation, setCurrentLocation] = useState([23.0225, 72.5714]) // Default Ahmedabad
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [nearestStops, setNearestStops] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await Api.get("/auth/me/")
                setUser({
                    name: userRes.data.username,
                    email: userRes.data.email,
                })

                const favRes = await Api.get("/favourites/user/")
                setFavourites(Array.isArray(favRes.data) ? favRes.data : [])

                const fbRes = await Api.get("/feedback/user/")
                setSubmittedFeedback(Array.isArray(fbRes.data) ? fbRes.data : [])

                // Geolocation
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const { latitude, longitude } = pos.coords
                            setCurrentLocation([latitude, longitude])
                            Api.get(`/stops/nearby/?lat=${latitude}&lng=${longitude}`)
                                .then(res => setNearestStops(res.data))
                                .catch(err => console.error(err))
                        },
                        (err) => {
                            console.error("Geolocation error:", err)
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        }
                    )
                }
            } catch (err) {
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
    const positiveFeedbackCount = submittedFeedback.filter(fb => fb.sentiment === "Positive").length
    const feedbackPercentage = submittedFeedback.length > 0
        ? Math.round((positiveFeedbackCount / submittedFeedback.length) * 100)
        : 0

    if (loading) {
        return <div className="text-center py-20 text-gray-400 text-xl animate-pulse">Loading your dashboard...</div>
    }
    if (error) {
        return <div className="text-center py-20 text-red-500 font-semibold text-xl">{error}</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-700">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

                {/* User Info Card */}
                <section className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white rounded-3xl p-10 shadow-xl flex justify-between items-center max-md:flex-col max-md:gap-6 max-md:text-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back, {user.name}</h2>
                        <p className="text-lg opacity-90">{user.email}</p>
                    </div>
                    <div className="text-7xl opacity-40 select-none">🧑‍💻</div>
                </section>

                {/* Location & Map */}
                <section className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Location</h2>
                    <div className="overflow-hidden rounded-xl border border-orange-200 dark:border-orange-800 bg-gray-100 dark:bg-gray-900">
                        <MapContainer
                            center={currentLocation}
                            zoom={13}
                            style={{ height: "400px", width: "100%" }}
                            className="z-0"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            {nearestStops.map((stopObj, index) => (
                                <Marker key={index} position={[stopObj.stop.latitude, stopObj.stop.longitude]} icon={Busstop}>
                                    <Popup>{stopObj.stop.name}</Popup>
                                </Marker>
                            ))}
                            <Marker position={currentLocation} icon={you_are_here}>
                                <Popup>You are here</Popup>
                            </Marker>
                            <RecenterMap center={currentLocation} />
                        </MapContainer>
                    </div>
                </section>

                {/* Grid: Favourites and Feedback */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Favourites */}
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 max-h-[400px] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Routes</h2>
                        {favourites.length ? (
                            <div className="space-y-4">
                                {favourites.map(route => (
                                    <div key={route.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition duration-300 bg-gray-50 dark:bg-gray-700">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{route.route_identifier}</h3>
                                            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold">Bus</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">{route.source} → {route.destination}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500 dark:text-gray-400">No saved routes yet</p>
                        )}
                    </div>

                    {/* Submitted Feedback */}
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 max-h-[400px] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submitted Feedback</h2>
                        {submittedFeedback.length ? (
                            <div className="space-y-5">
                                {submittedFeedback.map(feedback => (
                                    <div key={feedback.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow-md transition duration-200">
                                        <div className="flex justify-between mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(feedback.sentiment)}`}>
                                                {feedback.sentiment}
                                            </span>
                                            <span className="text-sm text-gray-400 dark:text-gray-300">{feedback.created_at?.split("T")[0]}</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-100 text-base">{feedback.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500 dark:text-gray-400">No feedback submitted yet</p>
                        )}
                    </div>
                </section>

                {/* Bottom Stats Panel */}
                <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center border border-blue-100 dark:border-blue-800 shadow hover:scale-105 transition duration-200">
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">{feedbackPercentage}%</p>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Positive Feedback</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-800 shadow hover:scale-105 transition duration-200">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{favourites.length}</p>
                        <p className="text-green-700 dark:text-green-300 font-medium">Saved Routes</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl text-center border border-orange-100 dark:border-orange-800 shadow hover:scale-105 transition duration-200">
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{submittedFeedback.length}</p>
                        <p className="text-orange-700 dark:text-orange-300 font-medium">Feedback Given</p>
                    </div>
                </section>

            </div>
            <BackToTop />
            <Footer />
        </div>
    )
}

export default Home;