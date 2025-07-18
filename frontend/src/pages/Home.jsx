import React from 'react'
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Map View of Ahmedabad</h2>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <MapContainer
                        center={[23.0225, 72.5714]} // Ahmedabad coordinates
                        zoom={13}
                        scrollWheelZoom={true}
                        className="w-full h-[500px] z-0"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={[23.0225, 72.5714]}>
                            <Popup>Ahmedabad Center</Popup>
                        </Marker>
                    </MapContainer>
                </div>
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
