import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

Modal.setAppElement('#root'); // Important for accessibility

const RouteMapModal = ({ routeId, isOpen, onClose }) => {
    const [stops, setStops] = useState([]);

    useEffect(() => {
        if (isOpen && routeId) {
            axios.get(`http://localhost:8000/api/bus-routes/${routeId}/`)
                .then(res => {
                    const patternStops = res.data.trip_patterns?.[0]?.stops || [];
                    setStops(patternStops.map(ps => ({
                        name: ps.stop.name,
                        lat: ps.stop.latitude,
                        lng: ps.stop.longitude,
                    })));
                })
                .catch(err => {
                    console.error("Failed to load route stops:", err);
                    setStops([]);
                });
        }
    }, [isOpen, routeId]);

    const polylinePositions = stops.map(stop => [stop.lat, stop.lng]);
    const center = polylinePositions.length > 0 ? polylinePositions[0] : [23.0225, 72.5714]; // Ahmedabad coords

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Route Map"
            style={{
                overlay: {
                    backgroundColor: 'hsla(0, 22%, 8%, 0.00)', // example: red with 50% opacity
                    backdropFilter: 'blur(4px)', // optional blur effect
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
            {/* Close Button with Tailwind */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 z-[1000] bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1.5 font-semibold transition-colors duration-200"
            >
                Close
            </button>

            {/* Map Container */}
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {polylinePositions.length > 0 && (
                    <>
                        <Polyline positions={polylinePositions} color="red" />
                        {stops.map((stop, idx) => (
                            <Marker key={idx} position={[stop.lat, stop.lng]}>
                                <Popup>{stop.name}</Popup>
                            </Marker>
                        ))}
                    </>
                )}
            </MapContainer>
        </Modal>
    );
};

export default RouteMapModal;
