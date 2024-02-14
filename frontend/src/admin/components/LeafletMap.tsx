import React, { useEffect } from 'react'
import DashBoardLayout from "../pages/DashBoardLayout"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { Button } from 'antd';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface MapProps {
    center: Coordinates;
}

const Map: React.FC<MapProps> = ({ center }) => {

    let startMarker: any, endMarker: any;
    // let map = L.map('map').setView([center.latitude, center.longitude], 13);

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
                            // console.log(center.latitude, center.longitude)
                            // L.marker([latitude, longitude]).addTo(map)
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

        // Trigger getUserLocation when the map is clicked
        // map.on('click', getUserLocation);

        // const onMapClick = (e: any) => {
        //     const { lat, lng } = e.latlng;
        //     // let popup = L.popup();
        //     // popup
        //     //     .setLatLng(e.latlng)
        //     //     .setContent("You clicked the map at " + e.latlng.toString())
        //     //     .openOn(map);

        //     marker.setLatLng([lat, lng])
        //         .addTo(map)

        // }

        // let startMarker: any, endMarker: any;

        function calculateRoute(startLatLng: L.LatLng, endLatLng: L.LatLng) {
            L.Routing.control({
                waypoints: [
                    L.latLng(startLatLng),
                    L.latLng(endLatLng)
                ],
                routeWhileDragging: true
            }).addTo(map);
        }

        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            // Remove existing markers
            if (startMarker) {
                map.removeLayer(startMarker);
            }

            if (endMarker) {
                map.removeLayer(endMarker);
            }
            // Add new marker
            if (!startMarker) {
                startMarker = L.marker([lat, lng]).addTo(map).bindPopup('Your Starting Point!').openPopup();
            } else if (!endMarker) {
                endMarker = L.marker([lat, lng]).addTo(map).bindPopup('Your Ending Point!').openPopup();

                // Calculate and display the route
                calculateRoute(startMarker.getLatLng(), endMarker.getLatLng());
            }
        });

        // Initial call to get user's location
        getUserLocation();
        // map.on('click', onMapClick);
        // map.on('click', getBestRoute);

        // onMapClick();
        return () => {
            map.off('click', getUserLocation);
            map.remove();
        };

    }, [center]);

    return (
        <>
            <div id="map" style={{ height: '550px' }} />
            {/* <div className="clear-btn" style={{ marginTop: 8, display: 'flex', justifyContent: 'end' }}>
                <Button type="primary" onClick={() => console.log('clear')} >Clear Route</Button>
            </div> */}
        </>
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