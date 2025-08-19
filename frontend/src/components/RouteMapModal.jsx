import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';

Modal.setAppElement('#root');

// 🔹 Helper component to adjust map view
const FitRouteBounds = ({ positions }) => {
    const map = useMap();

    useEffect(() => {
        if (positions.length > 0) {
            map.fitBounds(positions, { padding: [50, 50] }); // smooth zoom/pan
        }
    }, [positions, map]);

    return null;
};

// 🔹 New helper to smoothly fly to a stop
const FlyToStop = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, { duration: 1 });
        }
    }, [position, map]);
    return null;
};

const RouteMapModal = ({ routeId, isOpen, onClose }) => {
    const [stops, setStops] = useState([]);
    const [shapeCoords, setShapeCoords] = useState([]);
    const [selectedStop, setSelectedStop] = useState(null);

    useEffect(() => {
        if (isOpen && routeId) {
            axios.get(`http://localhost:8000/api/bus-routes/${routeId}/`)
                .then(res => {
                    const data = res.data;

                    const patternStops = data.trip_patterns?.[0]?.stops || [];
                    setStops(patternStops.map(ps => ({
                        name: ps.stop.name,
                        lat: ps.stop.latitude,
                        lng: ps.stop.longitude,
                    })));

                    if (data.shape?.coordinates?.length) {
                        setShapeCoords(data.shape.coordinates.map(([lat, lng]) => [lat, lng]));
                    } else {
                        setShapeCoords(patternStops.map(ps => [ps.stop.latitude, ps.stop.longitude]));
                    }
                })
                .catch(err => {
                    console.error("Failed to load route:", err);
                    setStops([]);
                    setShapeCoords([]);
                });
        }
    }, [isOpen, routeId]);

    const defaultCenter = [23.0225, 72.5714]; // Ahmedabad fallback

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Route Map"
            style={{
                overlay: {
                    backgroundColor: 'hsla(0, 22%, 8%, 0.00)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vh',
                    padding: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                }
            }}
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 z-[1000] bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1.5 font-semibold transition-colors duration-200"
            >
                Close
            </button>

            <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Auto-fit map to shape */}
                <FitRouteBounds positions={shapeCoords} />

                {shapeCoords.length > 0 && (
                    <Polyline positions={shapeCoords} color="red" weight={4} />
                )}

                {stops.map((stop, idx) => (
                    <Marker
                        key={idx}
                        position={[stop.lat, stop.lng]}
                        eventHandlers={{
                            click: () => setSelectedStop([stop.lat, stop.lng]), // fly to stop on click
                        }}
                    >
                        <Popup>
                            <div className="text-sm font-semibold text-blue-600 bg-white p-2 rounded-lg shadow-md">
                                {stop.name}
                            </div>
                        </Popup>7
                    </Marker>
                ))}

                {selectedStop && <FlyToStop position={selectedStop} />}
            </MapContainer>
        </Modal>
    );
};

export default RouteMapModal;
