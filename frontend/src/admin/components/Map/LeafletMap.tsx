import React, { useEffect } from 'react'
import DashBoardLayout from "../../pages/DashBoardLayout"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface MapProps {
    center: Coordinates;
}

const Map: React.FC<MapProps> = ({ center }) => {

    useEffect(() => {

        // Create a Leaflet map centered at a default location
        let map = L.map('map').setView([center.latitude, center.longitude], 13);

        // Add a Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([center.latitude, center.longitude]).addTo(map);

        // Get the user's current location using the browser's geolocation API
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // On success, update the map to the user's location
                        const { latitude, longitude } = position.coords;
                        map.setView([latitude, longitude], 13);

                        // Add a marker at the user's location
                        marker.setLatLng([latitude, longitude])
                            .bindPopup('Admin - You are here!')
                            .openPopup();

                    },
                    () => {
                        alert('Could not get your location. Showing default location.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser. Showing default location.');
            }
        };


        // Initial call to get user's location
        getUserLocation();

        return () => {
            map.off('click', getUserLocation);
            map.remove();
        };

    }, [center]);

    return (
        <div id="map" style={{ height: '550px' }} />
    );
};

const LeafletMap = () => {

    const defaultLocation: Coordinates = { latitude: 21.1453459, longitude: 72.7541851 };

    return (
        <DashBoardLayout>
            <h2 style={{ marginBottom: 15 }}>Map</h2>
            <Map center={defaultLocation} />
        </DashBoardLayout>
    )
}

export default LeafletMap