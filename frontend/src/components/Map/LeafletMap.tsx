import React, { useEffect, useRef } from 'react'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { clearRoute, setDropoffAddress, setPickupAddress, setTotalKm } from '../../slices/addressSlice';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface MapProps {
    center: Coordinates;
}

const Map: React.FC<MapProps> = ({ center }) => {

    let pickupAdd = useAppSelector(state => state.address.pickupAddress)
    let dropoffAdd = useAppSelector(state => state.address.dropoffAddress)
    const dispatch = useAppDispatch()

    const routingControlRef = useRef<any>(null);
    const mapRef = useRef<L.Map | null>(null);
    const startMarkerRef = useRef<any>(null);
    const endMarkerRef = useRef<any>(null);

    useEffect(() => {
        // Create a Leaflet map centered at a default location
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([center.latitude, center.longitude], 13);

        // Add a Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([center.latitude, center.longitude]).addTo(map);

        // Save map reference to the useRef
        mapRef.current = map;

        // Add search control
        const startingPointSearchControl = GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            showMarker: true,
            showPopup: true,
            keepResult: true,
            searchLabel: "Enter Your Pick up Address",
            marker: {
                icon: new L.Icon.Default(),
                draggable: false,
            },
        });

        const destinationPointSearchControl = GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            showMarker: true,
            showPopup: true,
            keepResult: true,
            searchLabel: "Enter Your Drop off Address",
            marker: {
                icon: new L.Icon.Default(),
                draggable: false,
            },
        });

        // Add search control to the map
        map.addControl(startingPointSearchControl);
        map.addControl(destinationPointSearchControl);

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
                    },
                    () => {
                        alert('Could not get your location. Showing default location.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser. Showing default location.');
            }
        };

        //calculate route between two locations 
        function calculateRoute(startLatLng: L.LatLng, endLatLng: L.LatLng) {
            if (routingControlRef.current) {
                mapRef.current!.removeControl(routingControlRef.current);
            }
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(startLatLng),
                    L.latLng(endLatLng)
                ],
                routeWhileDragging: true
            }).addTo(mapRef.current!);

            routingControlRef.current = routingControl;

            // Event listener for route selection
            routingControl.on('routeselected', (event: any) => {
                const selectedRoute = event.route;
                // Access the distance information
                const distance = selectedRoute.summary.totalDistance;
                dispatch(setTotalKm({ totalKm: distance / 1000 }))
            });
        }


        // Event listener for search results
        const handleSelectedLocation = async (event: any) => {
            const { x, y, label } = event.location;
            // Remove existing markers
            if (startMarkerRef.current) {
                mapRef.current!.removeLayer(startMarkerRef.current);
            }

            if (endMarkerRef.current) {
                mapRef.current!.removeLayer(endMarkerRef.current);
            }

            if (routingControlRef.current) {
                mapRef.current!.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }

            // Add new marker
            if (!startMarkerRef.current) {
                startMarkerRef.current = await L.marker([y, x]).addTo(mapRef.current!)
                    .bindPopup(`Pick up Point! ${label}`).openPopup();
                pickupAdd = label;
                dispatch(setPickupAddress({ pickupAddress: pickupAdd }))
            } else if (!endMarkerRef.current) {
                endMarkerRef.current = await L.marker([y, x]).addTo(mapRef.current!)
                    .bindPopup(`Drop off Point! ${label}`).openPopup();
                dropoffAdd = label;
                dispatch(setDropoffAddress({ dropoffAddress: dropoffAdd }))
            }

            // Calculate and display the route
            calculateRoute(startMarkerRef.current!.getLatLng(), endMarkerRef.current!.getLatLng());
        };

        const handleSearchBoxCancel = () => {
            // Clear any existing markers or perform any cleanup logic
            if (startMarkerRef.current) {
                mapRef.current!.removeLayer(startMarkerRef.current);
                startMarkerRef.current = null;
            }

            if (endMarkerRef.current) {
                mapRef.current!.removeLayer(endMarkerRef.current);
                endMarkerRef.current = null;
            }

            if (routingControlRef.current) {
                mapRef.current!.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
            mapRef.current = null;
            routingControlRef.current = null;
        };


        map.on('geosearch/showlocation', handleSelectedLocation);
        map.on('geosearch/cancel', handleSearchBoxCancel);

        // Initial call to get user's location
        getUserLocation();

        return () => {
            map.off('click', getUserLocation);
            map.off('geosearch/showlocation', handleSelectedLocation);
            map.off('geosearch/cancel', handleSearchBoxCancel);
            map.removeControl(startingPointSearchControl);
            map.removeControl(destinationPointSearchControl);
            map.remove();
        };

    }, [center]);

    const handleClearRoute = () => {

        if (mapRef.current) {
            mapRef.current.eachLayer(layer => {
                if (layer instanceof L.Routing.Control) {
                    mapRef!.current!.removeControl(layer);
                }
            });
        }

        // You may also want to remove markers or perform additional cleanup here
        if (startMarkerRef.current) {
            mapRef.current!.removeLayer(startMarkerRef.current);
            startMarkerRef.current = null;
        }

        if (endMarkerRef.current) {
            mapRef.current!.removeLayer(endMarkerRef.current);
            endMarkerRef.current = null;
        }

        if (routingControlRef.current) {
            mapRef.current!.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        dispatch(clearRoute());
    };

    return (
        <>
            <h2 style={{ margin: 5, display: 'flex', justifyContent: 'center' }}>Map for selecting the Pick-Up and Drof-Off Location</h2>
            <div className="clear-btn" style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" onClick={handleClearRoute} style={{ backgroundColor: 'black', fontSize: 15 }}>Clear Route (Enter Location Manually)</Button>
            </div>
            <div id="map" style={{ height: '550px' }} />
        </>
    );
};

const LeafletMap = () => {
    const defaultLocation: Coordinates = { latitude: 21.1453459, longitude: 72.7541851 };

    return (
        <Map center={defaultLocation} />
    )
}

export default LeafletMap