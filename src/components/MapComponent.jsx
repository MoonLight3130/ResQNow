import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet marker icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to recenter map
const RecenterMap = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 15, {
                animate: true,
                duration: 1.5
            });
        }
    }, [location, map]);
    return null;
};

const MapComponent = ({ userLocation, vehicleLocation, className }) => {
    const defaultPosition = [40.7128, -74.0060]; // Fallback
    const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultPosition;

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            className={`w-full h-full rounded-2xl z-0 ${className}`}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {userLocation && (
                <>
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>Your Location</Popup>
                    </Marker>
                    <RecenterMap location={userLocation} />
                </>
            )}

            {vehicleLocation && (
                <Marker position={[vehicleLocation.lat, vehicleLocation.lng]} icon={new L.Icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Generic ambulance/vehicle icon
                    iconSize: [35, 35],
                    iconAnchor: [17, 35]
                })}>
                    <Popup>Emergency Vehicle</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MapComponent;
