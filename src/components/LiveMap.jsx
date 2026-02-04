import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for React Leaflet missing icon assets
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const LiveMap = ({ zones, onZoneSelect, selectedZone }) => {

    // Custom "Cyber" Icon Renderer
    const createCustomIcon = (status, isSelected) => {
        const colorClass = status === 'WARNING' ? 'bg-red-500' : 'bg-[#00FFA3]';
        // We use a divIcon to render Tailwind classes directly into the map marker
        return L.divIcon({
            className: 'custom-leaflet-icon', // We'll add a tiny utility class if needed, or rely on internal HTML
            html: `
                <div class="relative flex items-center justify-center w-8 h-8 transform -translate-x-1/2 -translate-y-1/2">
                    <div class="absolute inset-0 rounded-full ${colorClass} opacity-40 ${isSelected || status === 'WARNING' ? 'animate-ping' : ''}"></div>
                    <div class="relative w-3 h-3 rounded-full ${colorClass} border border-white shadow-[0_0_15px_currentColor] z-10"></div>
                </div>
            `,
            iconSize: [32, 32], // Size of the container
            iconAnchor: [16, 16] // Center it
        });
    };

    // Component to auto-center map
    const MapUpdater = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.flyTo(center, 14, { duration: 2 });
            }
        }, [center, map]);
        return null;
    };

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={[40.7308, -73.9973]}
                zoom={13}
                className="w-full h-full bg-[#0a0a15]"
                zoomControl={false}
                scrollWheelZoom={true}
            >
                {/* Dark Matter Tiles for Cyberpunk Look */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {zones.map(zone => (
                    <Marker
                        key={zone.id}
                        position={[zone.lat, zone.lng]}
                        icon={createCustomIcon(zone.status, selectedZone?.id === zone.id)}
                        eventHandlers={{
                            click: () => onZoneSelect(zone),
                        }}
                    >
                        {/* We don't use Popup here, strictly the side drawer pattern */}
                    </Marker>
                ))}

                <MapUpdater center={selectedZone ? [selectedZone.lat, selectedZone.lng] : null} />
            </MapContainer>

            {/* Overlay Grid Effect */}
            <div className="absolute inset-0 pointer-events-none z-[400]" style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: '80px 80px',
                opacity: 0.3
            }}></div>
        </div>
    );
};

export default LiveMap;
