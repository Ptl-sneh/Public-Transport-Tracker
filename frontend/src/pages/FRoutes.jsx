import React, { useState, useMemo, useEffect} from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import Api from "../api/Api";
import 'leaflet/dist/leaflet.css'
import transferImg from '../icons/location.png'
import busStopImg from '../icons/bus-stop.png'

const busStopIcon = L.icon({
    iconUrl: busStopImg,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const transferIcon = L.icon({
    iconUrl: transferImg,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const MapPanToSelected = ({ coordinates }) => {
    const map = useMap();
    useEffect(() => {
        if (coordinates && coordinates.length > 0) {
            map.fitBounds(coordinates);
        }
    }, [coordinates, map]);
    return null;
};

const FRoutes = () => {
    const [routeForm, setRouteForm] = useState({ source: "", destination: "" });
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [stopSuggestions, setStopSuggestions] = useState({ source: [], destination: [] });
    const [favourites, setFavourites] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setRouteForm({ ...routeForm, [name]: value });

        if (value.length > 1) {
            try {
                const res = await Api.get("/stops/search/", { params: { q: value } });
                const uniqueStops = [...new Set(res.data.map((s) => s.name))];
                setStopSuggestions((prev) => ({ ...prev, [name]: uniqueStops }));
            } catch { }
        } else {
            setStopSuggestions((prev) => ({ ...prev, [name]: [] }));
        }
    };

    const handleSwap = () => {
        setRouteForm((prev) => ({ source: prev.destination, destination: prev.source }));
    };

    const generateRouteSteps = (route, source, destination) => {
        if (!route.has_transfer) {
            return [`Take ${route.name} from ${source}`, `Continue to ${destination}`];
        } else {
            return [
                `Take ${route.sr_bus} from ${source}`,
                `Change at ${route.transfer_point}`,
                `Take ${route.dr_name} to ${destination}`,
            ];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await Api.get("/find_route/", {
                params: {
                    source: routeForm.source,
                    destination: routeForm.destination,
                    time: selectedTime,
                },
            });

            const results = response.data
                .filter((route) => route.next_buses && route.next_buses.length > 0)
                .map((route) => {
                    const next_buses_text = route.next_buses
                        .slice(0, 3)
                        .map((b) => b.departure_time)
                        .join(", ");
                    return {
                        id: route.id,
                        type: "Bus",
                        route: route.name,
                        fare: `₹${route.fare}`,
                        has_transfer: route.has_transfer,
                        source_coordinates: route.source_coordinates,
                        destination_coordinates: route.destination_coordinates,
                        transfer_coordinates: route.transfer_coordinates,
                        transfer_point: route.transfer_point,
                        shape: route.shape || [],
                        steps: generateRouteSteps(route, routeForm.source, routeForm.destination),
                        time: route.has_transfer ? "50 mins" : "35 mins",
                        changeover: route.has_transfer ? route.transfer_point : "None",
                        next_bus_eta: next_buses_text,
                    };
                });

            setSearchResults(results);
            setIsSearched(true);
            if (results.length > 0) setSelectedRouteId(results[0].id);
        } catch {
            setError("Could not find routes");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedRoute = useMemo(
        () => searchResults.find((r) => r.id === selectedRouteId),
        [searchResults, selectedRouteId]
    );

    // Fetch favourites
    useEffect(() => {
        Api.get("/favourites/")
            .then((res) => setFavourites(res.data))
            .catch((err) => console.error("Error fetching favourites", err));
    }, []);

    const handleToggleFavourite = async (route) => {
        const existingFav = favourites.find(
            (f) =>
                f.route_identifier === route.route &&
                f.source === routeForm.source &&
                f.destination === routeForm.destination
        );

        if (existingFav) {
            await Api.delete(`/favourites/${existingFav.id}/`);
            setFavourites(favourites.filter((f) => f.id !== existingFav.id));
        } else {
            const res = await Api.post("/favourites/", {
                route_identifier: route.route,
                source: routeForm.source,
                destination: routeForm.destination,
            });
            setFavourites([...favourites, res.data]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Plan Your Journey</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Find the best route between any two stops</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={handleSwap}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Swap Source & Destination
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {['source', 'destination'].map(name => (
                                <div key={name} className="relative">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {name.charAt(0).toUpperCase() + name.slice(1)} Stop
                                    </label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={routeForm[name]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${name} stop`}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        autoComplete="off"
                                    />
                                    {stopSuggestions[name].length > 0 && (
                                        <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full mt-1 max-h-40 overflow-auto text-sm text-gray-900 dark:text-white">
                                            {stopSuggestions[name].map((s, idx) => (
                                                <li
                                                    key={idx}
                                                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                                    onClick={() => {
                                                        setRouteForm({ ...routeForm, [name]: s })
                                                        setStopSuggestions(prev => ({ ...prev, [name]: [] }))
                                                    }}
                                                >
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Travel Time
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? 'Searching...' : 'Find Route'}
                            </button>
                        </div>
                        {error && <div className="text-center text-red-500 dark:text-red-400">{error}</div>}
                    </form>
                </div>

                {isSearched && !isLoading && (
                    <div className="grid lg:grid-cols-3 gap-6" >
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Route Suggestions</h2>
                            <div className="space-y-4">
                                {searchResults.length > 0 ? (
                                    searchResults.map(result => (
                                        <div
                                            key={result.id}
                                            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${selectedRouteId === result.id ? 'border-2 border-red-500' : ''
                                                }`}
                                            onClick={() => setSelectedRouteId(result.id)}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                                    {result.type}
                                                </span>

                                                <div className="flex space-x-4 items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span>⏱️ {result.time}</span>
                                                    <span>💰 {result.fare}</span>
                                                    <div key={result.id} className='mt-2'>
                                                        <div className="flex justify-between items-center mb-2 cursor-pointer hover:bg-gray-600 rounded">
                                                            <h3 className="font-semibold text-lg">{result.route}</h3>

                                                            {/* ⭐ Favourite toggle */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleToggleFavourite(result)
                                                                }}
                                                                className="text-yellow-500 text-xl cursor-pointer hover:bg-gray-600 rounded"
                                                            >
                                                                {favourites.some(f =>
                                                                    f.route_identifier === result.route &&
                                                                    f.source === routeForm.source &&
                                                                    f.destination === routeForm.destination
                                                                ) ? "★" : "☆"}
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{result.route}</h3>
                                            {result.changeover !== 'None' && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    <span className="font-medium">Changeover:</span> {result.changeover}
                                                </p>
                                            )}

                                            <div className="space-y-1">
                                                {result.steps.map((step, index) => (
                                                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                                            {index + 1}
                                                        </span>
                                                        {step}
                                                    </div>
                                                ))}

                                                {/* ✅ Detailed Next Bus ETA */}
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">⏳ Next Buses:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                                                        {result.next_bus_eta.split(",").map((time, idx) => (
                                                            <li key={idx} className="ml-2">{time.trim()}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 dark:text-gray-400">No routes found for your search</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Route Map</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-[600px] transition-colors duration-300">
                                {searchResults.length > 0 ? (
                                    <MapContainer center={[23.0225, 72.5714]} zoom={12} style={{ height: "100%", width: "100%"}}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; OpenStreetMap contributors"
                                        />

                                        {selectedRoute && (
                                            <MapPanToSelected
                                                coordinates={[
                                                    selectedRoute.source_coordinates,
                                                    selectedRoute.destination_coordinates,
                                                    ...(selectedRoute.transfer_coordinates ? [selectedRoute.transfer_coordinates] : []),
                                                    ...(Array.isArray(selectedRoute.shape[0][0])
                                                        ? selectedRoute.shape.flat()   // flatten multi-leg route
                                                        : selectedRoute.shape)
                                                ]}
                                            />
                                        )}

                                        {/* Source Marker */}
                                        <Marker position={selectedRoute.source_coordinates} icon = {busStopIcon}>
                                            <Popup>Source: {routeForm.source}</Popup>
                                        </Marker>

                                        {/* Destination Marker */}
                                        <Marker position={selectedRoute.destination_coordinates} icon={busStopIcon}>
                                            <Popup>Destination: {routeForm.destination}</Popup>
                                        </Marker>

                                        {/* ✅ Transfer Marker */}
                                        {selectedRoute?.transfer_coordinates && (
                                            <Marker
                                                position={selectedRoute.transfer_coordinates}
                                                icon={transferIcon}
                                            >
                                                <Popup>
                                                    Changeover: {selectedRoute.transfer_point}
                                                </Popup>
                                            </Marker>
                                        )}

                                        {/* Draw route shape(s) */}
                                        {Array.isArray(selectedRoute.shape[0][0]) ? (
                                            // Case: transferred route (multi-leg)
                                            selectedRoute.shape.map((leg, idx) => (
                                                <Polyline key={idx} positions={leg} color={idx === 0 ? "red" : "green"} />
                                            ))
                                        ) : (
                                            // Case: direct route (single leg)
                                            <Polyline positions={selectedRoute.shape} color="red" />
                                        )}
                                    </MapContainer>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        Route visualization will be displayed here
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default FRoutes
