import React, { useEffect, useRef } from 'react'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { clearRoute, setDropoffAddress, setPickupAddress } from '../../slices/addressSlice';

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

    const mapRef = useRef<L.Map | null>(null);
    let startMarker: any, endMarker: any;
    // let map = L.map('map').setView([center.latitude, center.longitude], 13);

    // const buildMap = (center) => {
    //     // Create a Leaflet map centered at a default location
    //     map = L.map('map').setView([center.latitude, center.longitude], 13);

    //     // Add a Tile Layer
    //     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    //         attribution: '© OpenStreetMap contributors',
    //     }).addTo(map);

    //     const marker = L.marker([center.latitude, center.longitude]).addTo(map);

    //     // Save map reference to the useRef
    //     mapRef.current = map;

    //     //calculate route between two locations 
    //     function calculateRoute(startLatLng: L.LatLng, endLatLng: L.LatLng) {
    //         L.Routing.control({
    //             waypoints: [
    //                 L.latLng(startLatLng),
    //                 L.latLng(endLatLng)
    //             ],
    //             routeWhileDragging: true
    //         }).addTo(map);
    //     }
    //     // Event listener for search results
    //     const handleSelectedLocation = (event: any) => {
    //         const { x, y, label } = event.location;
    //         // const selectedLocation = L.latLng(y, x);

    //         // Create a marker for the selected location
    //         // const selectedMarker = L.marker(selectedLocation).addTo(map).bindPopup(label).openPopup();

    //         // You can save the selectedLocation and selectedMarker in your state or perform any other logic here
    //         // For example, you can use the useState hook to manage the state.

    //         // console.log(`Location found at (${x}, ${y})`);

    //         // Remove existing markers
    //         if (startMarker) {
    //             map.removeLayer(startMarker);
    //         }

    //         if (endMarker) {
    //             map.removeLayer(endMarker);
    //         }
    //         // Add new marker
    //         if (!startMarker) {
    //             startMarker = L.marker([y, x]).addTo(map).bindPopup(`Pick up Point! ${label}`).openPopup();
    //         } else if (!endMarker) {
    //             endMarker = L.marker([y, x]).addTo(map).bindPopup(`Drop off Point! ${label}`).openPopup();

    //             // Calculate and display the route
    //             calculateRoute(startMarker.getLatLng(), endMarker.getLatLng());
    //         }
    //     };
    //     // Get the user's current location using the browser's geolocation API
    //     const getUserLocation = () => {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(
    //                 (position) => {
    //                     // On success, update the map to the user's location
    //                     const { latitude, longitude } = position.coords;
    //                     map.setView([latitude, longitude], 13);

    //                     // Add a marker at the user's location
    //                     marker.setLatLng([latitude, longitude])
    //                     // console.log(center.latitude, center.longitude)
    //                     // L.marker([latitude, longitude]).addTo(map)
    //                     // .bindPopup('Admin - You are here!')
    //                     // .openPopup();

    //                 },
    //                 () => {
    //                     alert('Could not get your location. Showing default location.');
    //                 }
    //             );
    //         } else {
    //             alert('Geolocation is not supported by your browser. Showing default location.');
    //         }
    //     };
    //     // Add search control to the map
    //     map.addControl(startingPointSearchControl);
    //     map.addControl(destinationPointSearchControl);
    //     map.on('geosearch/showlocation', handleSelectedLocation);

    //     // Initial call to get user's location
    //     getUserLocation();


    //     return () => {
    //         map.off('click', getUserLocation);
    //         map.off('geosearch/showlocation', handleSelectedLocation);
    //         map.removeControl(startingPointSearchControl);
    //         map.removeControl(destinationPointSearchControl);
    //         map.remove();
    //     };
    // }

    // // Add search control
    // const startingPointSearchControl = GeoSearchControl({
    //     provider: new OpenStreetMapProvider(),
    //     showMarker: true,
    //     showPopup: true,
    //     marker: {
    //         icon: new L.Icon.Default(),
    //         draggable: false,
    //     },
    // });

    // const destinationPointSearchControl = GeoSearchControl({
    //     provider: new OpenStreetMapProvider(),
    //     showMarker: true,
    //     showPopup: true,
    //     marker: {
    //         icon: new L.Icon.Default(),
    //         draggable: false,
    //     },
    // });

    // useEffect(() => {
    //     buildMap(center)
    // }, [buildMap, center]);

    useEffect(() => {
        console.log('useEffect....')
        // Create a Leaflet map centered at a default location
        let map = L.map('map',{
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
                        // console.log(center.latitude, center.longitude)
                        // L.marker([latitude, longitude]).addTo(map)
                        // .bindPopup('Admin - You are here!')
                        // .openPopup();

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
            L.Routing.control({
                waypoints: [
                    L.latLng(startLatLng),
                    L.latLng(endLatLng)
                ],
                routeWhileDragging: true
            }).addTo(map);
        }


        // Event listener for search results
        const handleSelectedLocation = (event: any) => {
            const { x, y, label } = event.location;
            // const selectedLocation = L.latLng(y, x);

            // Create a marker for the selected location
            // const selectedMarker = L.marker(selectedLocation).addTo(map).bindPopup(label).openPopup();

            // You can save the selectedLocation and selectedMarker in your state or perform any other logic here
            // For example, you can use the useState hook to manage the state.

            // console.log(`Location found at (${x}, ${y})`);

            // Remove existing markers
            if (startMarker) {
                map.removeLayer(startMarker);
            }

            if (endMarker) {
                map.removeLayer(endMarker);
            }
            // Add new marker
            if (!startMarker) {
                startMarker = L.marker([y, x]).addTo(map).bindPopup(`Pick up Point! ${label}`).openPopup();
                pickupAdd = label;
                dispatch(setPickupAddress({ pickupAddress: pickupAdd }))
            } else if (!endMarker) {
                endMarker = L.marker([y, x]).addTo(map).bindPopup(`Drop off Point! ${label}`).openPopup();
                dropoffAdd = label;
                dispatch(setDropoffAddress({ dropoffAddress: dropoffAdd }))
            }

            // Calculate and display the route
            calculateRoute(startMarker.getLatLng(), endMarker.getLatLng());
        };

        const handleSearchBoxCancel = () => {
            // Clear any existing markers or perform any cleanup logic
            if (startMarker) {
                map.removeLayer(startMarker);
                startMarker = null;
            }

            if (endMarker) {
                map.removeLayer(endMarker);
                endMarker = null;
            }
        };


        // map.on('click', (e: L.LeafletMouseEvent) => {
        //     const { lat, lng } = e.latlng;
        //     // Remove existing markers
        //     if (startMarker) {
        //         map.removeLayer(startMarker);
        //     }

        //     if (endMarker) {
        //         map.removeLayer(endMarker);
        //     }
        //     // Add new marker
        //     if (!startMarker) {
        //         startMarker = L.marker([lat, lng]).addTo(map).bindPopup('Your Starting Point!').openPopup();
        //     } else if (!endMarker) {
        //         endMarker = L.marker([lat, lng]).addTo(map).bindPopup('Your Ending Point!').openPopup();

        //         // Calculate and display the route
        //         calculateRoute(startMarker.getLatLng(), endMarker.getLatLng());
        //     }
        // });

        map.on('geosearch/showlocation', handleSelectedLocation);
        map.on('geosearch/cancel', handleSearchBoxCancel);

        // Initial call to get user's location
        getUserLocation();
        // map.on('click', onMapClick);
        // map.on('click', getBestRoute);

        // onMapClick();
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
        dispatch(clearRoute())
        // map.removeLayer(startMarker)
        // map.removeLayer(endMarker)
        startMarker = null
        endMarker = null
    }

    return (
        <>
            <div id="map" style={{ height: '550px' }} />
            <div className="clear-btn" style={{ marginTop: 8, display: 'flex', justifyContent: 'end' }}>
                <Button type="primary" onClick={handleClearRoute} >Clear Route (Enter Location Manually)</Button>
            </div>
        </>
    );
};

const LeafletMap = () => {
    console.log("object")
    const defaultLocation: Coordinates = { latitude: 21.1453459, longitude: 72.7541851 };

    return (
        <Map center={defaultLocation} />
    )
}

export default LeafletMap