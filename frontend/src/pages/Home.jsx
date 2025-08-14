import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
const Home = () => {
    const [routes, setRoutes] = useState([]);
    const [nearestStops, setNearestStops] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/bus-routes/')
            .then(res => res.json())
            .then(data => setRoutes(data))
            .catch(err => console.error(err));
    }, []);

    // Fetch nearest stops
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const { latitude, longitude } = pos.coords;
                axios.get(`http://127.0.0.1:8000/api/nearby/?lat=${latitude}&lng=${longitude}`)
                    .then(res => setNearestStops(res.data))
                    .catch(err => console.error(err));
            });
        }
    }, []);

    const quickAccessCards = [
        {
            title: "Live Tracker",
            description: "Track buses and metros in real-time with live location updates",
            icon: "📍",
            link: "/tracker",
        },
        {
            title: "Routes",
            description: "Browse all available bus and metro routes in Ahmedabad",
            icon: "🗺️",
            link: "/routes",
        },
        {
            title: "Schedules",
            description: "View timetables and schedules for all transport services",
            icon: "⏰",
            link: "/schedules",
        },
        {
            title: "Feedback",
            description: "Share your experience and help improve public transport",
            icon: "💬",
            link: "/feedback",
        },
    ]

    const Steps = [
        {
            step: "1",
            title: "Search",
            description: "Enter your source and destination to find the best routes",
        },
        {
            step: "2",
            title: "Track",
            description: "Get real-time updates on vehicle locations and arrival times",
        },
        {
            step: "3",
            title: "Travel",
            description: "Board your transport with confidence and reach your destination",
        },
    ]
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16 mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Ahmedabad Public Transport Tracker</h1>
                <p className="text-xl opacity-90">Your smart companion for city travel</p>
            </div>

            <div className="py-12 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Map View of Ahmedabad
                </h2>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <MapContainer center={[23.0225, 72.5714]} zoom={13} scrollWheelZoom className="w-full h-[500px] z-0">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />

                        {routes.map((route, idx) => (
                            <React.Fragment key={idx}>
                                {/* Draw route shape */}
                                {route.shape && route.shape.coordinates && (
                                    <Polyline
                                        positions={route.shape.coordinates}
                                        color="dodgerblue"
                                    />
                                )}

                                {/* Draw all stops */}
                                {route.trip_patterns.map(pattern => (
                                    pattern.stops.map((stopData, i) => {
                                        const stop = stopData.stop;
                                        return (
                                            <Marker
                                                key={`${pattern.id}-${i}`}
                                                position={[stop.latitude, stop.longitude]}
                                                icon={L.icon({
                                                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                                                    iconSize: [30, 30]
                                                })}
                                            >
                                                <Popup>
                                                    <b>{stop.name}</b><br />
                                                </Popup>
                                            </Marker>
                                        )
                                    })
                                ))}
                            </React.Fragment>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Nearest Stops Section */}
            <div className="max-w-6xl mx-auto py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nearest Stops to You</h2>
                <ul className="space-y-4">
                    {nearestStops.length > 0 ? (
                        nearestStops.map((stop, index) => (
                            <li key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between">
                                <span className="font-medium">{stop.name}</span>
                                <span className="text-gray-500">{stop.distance.toFixed(1)} km away</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Fetching nearest stops...</p>
                    )}
                </ul>
            </div>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Quick Access</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickAccessCards.map((card, index) => (
                        <Link key={index} to={`/${card.link}`}>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                                <div className="text-4xl mb-4">{card.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{card.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className='py-16 px-4 max-w-8xl'>
                <div className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300 mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {
                            Steps.map((step, index) => {
                                return (
                                    <div className="text-center" key={index}>
                                        <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                            {step.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-3" >{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}


export default Home
