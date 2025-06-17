// components/locator/MapView.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library itself for custom icons etc.

// Fix for default Leaflet marker icon issue with Webpack/Next.js
// (This ensures icons are loaded correctly)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Optional: Custom Pin Icon (can be an SVG or an image)
// const customRecycleIcon = new L.Icon({
//   iconUrl: '/icons/recycle-bin.svg', // Ensure this path is correct in your public folder
//   iconSize: [32, 32], // size of the icon
//   iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
// });


// Component to handle map recentering when selectedCenter changes
function ChangeView({ center, zoom }) {
    const map = useMap();
    if (center) {
        map.setView(center, zoom);
    }
    return null;
}

export default function MapView({
                                    centers = [],
                                    initialLatitude = 39.8283, // Approx center of US
                                    initialLongitude = -98.5795,
                                    initialZoom = 4,
                                }) {
    const [mapCenter, setMapCenter] = useState([initialLatitude, initialLongitude]);
    const [currentZoom, setCurrentZoom] = useState(initialZoom);
    const [selectedCenter, setSelectedCenter] = useState(null);

    // Effect to update map center if initial props change (e.g., user location found)
    useEffect(() => {
        setMapCenter([initialLatitude, initialLongitude]);
        setCurrentZoom(initialZoom);
    }, [initialLatitude, initialLongitude, initialZoom]);


    const handleMarkerClick = (center) => {
        setSelectedCenter(center);
        if (center.latitude != null && center.longitude != null) {
            setMapCenter([center.latitude, center.longitude]); // Center map on click
            setCurrentZoom(14); // Zoom in on click
        }
    };

    if (typeof window === 'undefined') {
        // Basic SSR placeholder or null to avoid Leaflet errors on server
        return <div style={{ height: '500px', width: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;
    }

    return (
        <MapContainer
            center={mapCenter}
            zoom={currentZoom}
            scrollWheelZoom={true} // Allow scroll wheel zoom
            style={{ height: '100%', width: '100%' }} // Ensure map has dimensions
            whenCreated={mapInstance => { /* console.log("Map instance created:", mapInstance) */ }}
            onViewportChanged={(viewport) => {
                // Optional: if you need to track viewport changes
                // setMapCenter(viewport.center);
                // setCurrentZoom(viewport.zoom);
            }}
        >
            {/* If selectedCenter changes, ChangeView will update the map's view */}
            {selectedCenter && selectedCenter.latitude != null && selectedCenter.longitude != null && (
                <ChangeView center={[selectedCenter.latitude, selectedCenter.longitude]} zoom={14} />
            )}

            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* You could add a GeolocateControl equivalent using navigator.geolocation and map.setView */}

            {centers.map(center => {
                if (center.latitude == null || center.longitude == null) {
                    return null; // Skip centers without coordinates
                }
                return (
                    <Marker
                        key={center.id}
                        position={[center.latitude, center.longitude]}
                        // icon={customRecycleIcon} // Uncomment to use custom icon
                        eventHandlers={{
                            click: () => {
                                handleMarkerClick(center);
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-1 max-w-xs text-sm">
                                <h3 className="font-semibold mb-1">{center.name}</h3>
                                <p className="text-xs text-gray-700 mb-1">{center.address}</p>
                                {center.operatingHours && <p className="text-xs text-gray-600 mb-1">Hours: {center.operatingHours}</p>}
                                {center.contactNumber && <p className="text-xs text-gray-600 mb-1">Phone: {center.contactNumber}</p>}
                                {center.website && (
                                    <a
                                        href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-green-600 hover:underline block"
                                    >
                                        Visit Website
                                    </a>
                                )}
                                {center.acceptedMaterials && center.acceptedMaterials.length > 0 && (
                                    <div className="mt-2 pt-1 border-t border-gray-200">
                                        <p className="text-xs font-medium text-gray-800">Accepts:</p>
                                        <p className="text-xs text-gray-600">
                                            {center.acceptedMaterials.join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}