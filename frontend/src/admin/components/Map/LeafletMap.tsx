import React, { useEffect, useMemo, useRef, useState } from 'react';
import DashBoardLayout from "../../pages/DashBoardLayout";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Tag, Input, Segmented, Button, Switch, Tooltip } from 'antd';
import {
    CarOutlined,
    EnvironmentOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ToolOutlined,
    AimOutlined,
    WifiOutlined
} from '@ant-design/icons';
import { useGetAllCarsQuery } from '../../../services/carApi';
import { isV2Enabled } from '../../../utils/featureFlags';

// Fix Leaflet default marker icon paths for production bundler builds (Vite / Vercel)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface CarFleetMarker {
    id: string;
    carName: string;
    model: string;
    plateNumber: string;
    lat: number;
    lng: number;
    status: 'Available' | 'On Trip' | 'Maintenance';
    speed: string;
    fuelLevel: string;
    driverName: string;
    locationName: string;
    image?: string;
    isLiveFeed?: boolean;
}

// Fallback realistic GPS fleet coordinates around Surat / Gujarat region
const DUMMY_FLEET: CarFleetMarker[] = [
    {
        id: 'fleet-1',
        carName: 'BMW M4 Coupe',
        model: '2024 Sports Edition',
        plateNumber: 'GJ-05-BM-1001',
        lat: 21.1702,
        lng: 72.8311,
        status: 'On Trip',
        speed: '58 km/h',
        fuelLevel: '78% Fuel',
        driverName: 'Rahul Sharma',
        locationName: 'Station Road, Surat',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&auto=format&fit=crop'
    },
    {
        id: 'fleet-2',
        carName: 'Audi Q7 SUV',
        model: 'Quattro 3.0 TDI',
        plateNumber: 'GJ-05-AQ-5002',
        lat: 21.1453,
        lng: 72.7542,
        status: 'Available',
        speed: '0 km/h (Parked)',
        fuelLevel: '92% Fuel',
        driverName: 'Unassigned (Parked)',
        locationName: 'Dumas Road, Surat',
        image: 'https://images.unsplash.com/photo-1541348263662-e08266f92f0a?w=500&auto=format&fit=crop'
    },
    {
        id: 'fleet-3',
        carName: 'Mercedes-Benz C-Class',
        model: 'C200 AMG Line',
        plateNumber: 'GJ-05-MB-9003',
        lat: 21.2035,
        lng: 72.8463,
        status: 'On Trip',
        speed: '42 km/h',
        fuelLevel: '65% Fuel',
        driverName: 'Priya Patel',
        locationName: 'Katargam Hub, Surat',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&auto=format&fit=crop'
    },
    {
        id: 'fleet-4',
        carName: 'Tesla Model 3',
        model: 'Long Range EV',
        plateNumber: 'GJ-05-TS-3004',
        lat: 21.1324,
        lng: 72.7214,
        status: 'Available',
        speed: '0 km/h (Charging)',
        fuelLevel: '88% EV Charge',
        driverName: 'Unassigned (Charging)',
        locationName: 'Magdalla Port EV Station',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&auto=format&fit=crop'
    },
    {
        id: 'fleet-5',
        carName: 'Mahindra Thar 4x4',
        model: 'LX Hard Top Diesel',
        plateNumber: 'GJ-05-TH-7005',
        lat: 21.2300,
        lng: 72.8900,
        status: 'On Trip',
        speed: '72 km/h',
        fuelLevel: '54% Fuel',
        driverName: 'Amit Verma',
        locationName: 'Kamrej Expressway',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop'
    },
    {
        id: 'fleet-6',
        carName: 'Hyundai Creta SX',
        model: '1.5 Petrol Automatic',
        plateNumber: 'GJ-05-HC-2006',
        lat: 21.1550,
        lng: 72.7850,
        status: 'Maintenance',
        speed: '0 km/h (In Service)',
        fuelLevel: '30% Fuel',
        driverName: 'Surat Service Hub',
        locationName: 'Vesu Service Station',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop'
    },
    {
        id: 'fleet-7',
        carName: 'Toyota Fortuner',
        model: 'Legender 4x4 Diesel',
        plateNumber: 'GJ-05-TF-6007',
        lat: 21.1850,
        lng: 72.8100,
        status: 'On Trip',
        speed: '35 km/h',
        fuelLevel: '82% Fuel',
        driverName: 'Sneha Desai',
        locationName: 'Adajan Ring Road',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&auto=format&fit=crop'
    }
];

// Original Baseline Simple Map (Rendered when v2_features_enabled cookie is OFF)
const SimpleBaselineMap: React.FC<{ center: Coordinates }> = ({ center }) => {
    useEffect(() => {
        let map = L.map('simple-map').setView([center.latitude, center.longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 250);

        const marker = L.marker([center.latitude, center.longitude]).addTo(map);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13);
                    marker.setLatLng([latitude, longitude])
                        .bindPopup('Admin - You are here!')
                        .openPopup();
                }
            );
        }

        return () => {
            clearTimeout(timer);
            map.remove();
        };
    }, [center]);

    return <div id="simple-map" style={{ height: '550px' }} />;
};

// V2 Interactive Live Fleet GPS Map Component (Rendered when v2_features_enabled cookie is ON)
const V2FleetMap: React.FC<{ defaultCenter: Coordinates }> = ({ defaultCenter }) => {
    const [isLivePolling, setIsLivePolling] = useState<boolean>(false);

    const { data: carsData } = useGetAllCarsQuery(undefined, {
        pollingInterval: isLivePolling ? 5000 : 0,
    });

    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});

    const fleetList = useMemo(() => {
        const backendCars = (carsData as any)?.data?.data || (carsData as any)?.data || [];
        if (!backendCars || backendCars.length === 0) {
            return DUMMY_FLEET;
        }

        return backendCars.map((car: any, index: number) => {
            const preset = DUMMY_FLEET[index % DUMMY_FLEET.length];

            const liveLat = car.currentLocation?.lat ?? car.latitude ?? car.lat;
            const liveLng = car.currentLocation?.lng ?? car.longitude ?? car.lng;
            const liveSpeed = car.currentLocation?.speed ?? car.speed;
            const liveLocation = car.currentLocation?.address ?? car.locationName ?? car.address;
            const hasRealGps = typeof liveLat === 'number' && typeof liveLng === 'number';
            const isBooked = car.bookedDates && car.bookedDates.length > 0;
            const isAvail = car.availability !== false && !isBooked;

            let rawImg = car.image || car.carImage || preset.image;
            if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http://res.cloudinary.com')) {
                rawImg = rawImg.replace('http://res.cloudinary.com', 'https://res.cloudinary.com');
            }
            const carImage = (rawImg && rawImg !== '/broken-image.jpg' && rawImg !== 'undefined' && rawImg !== 'null') ? rawImg : preset.image;

            return {
                id: car._id || `car-${index}`,
                carName: car.carName || preset.carName,
                model: `${car.model || car.year || '2024'} (${car.transmission || 'Automatic'})`,
                plateNumber: car.carNumberPlate || car.plateNumber || preset.plateNumber,
                lat: hasRealGps ? liveLat : preset.lat,
                lng: hasRealGps ? liveLng : preset.lng,
                status: isBooked ? 'On Trip' : (isAvail ? 'Available' : 'Maintenance'),
                speed: liveSpeed || (isBooked ? '55 km/h' : '0 km/h (Parked)'),
                fuelLevel: car.fule ? `${car.fule} (85%)` : preset.fuelLevel,
                driverName: isBooked ? 'Active Renter' : 'Parked / Unassigned',
                locationName: liveLocation || preset.locationName,
                image: carImage,
                isLiveFeed: hasRealGps || isLivePolling
            } as CarFleetMarker;
        });
    }, [carsData, isLivePolling]);

    const filteredFleet = useMemo(() => {
        return fleetList.filter((car) => {
            const matchesStatus = statusFilter === 'All' || car.status === statusFilter;
            const matchesSearch =
                car.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.locationName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [fleetList, statusFilter, searchQuery]);

    const stats = useMemo(() => {
        const total = fleetList.length;
        const available = fleetList.filter((c) => c.status === 'Available').length;
        const onTrip = fleetList.filter((c) => c.status === 'On Trip').length;
        const maintenance = fleetList.filter((c) => c.status === 'Maintenance').length;
        return { total, available, onTrip, maintenance };
    }, [fleetList]);

    useEffect(() => {
        const mapContainer = document.getElementById('fleet-map');
        if (!mapContainer) return;

        if (!mapRef.current) {
            const map = L.map('fleet-map', {
                center: [defaultCenter.latitude, defaultCenter.longitude],
                zoom: 12,
                zoomControl: true
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            setTimeout(() => {
                map.invalidateSize();
            }, 250);

            mapRef.current = map;
        }

        const map = mapRef.current;

        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};

        filteredFleet.forEach((car) => {
            let badgeBg = '#1890ff';
            if (car.status === 'Available') badgeBg = '#52c41a';
            if (car.status === 'Maintenance') badgeBg = '#ff4d4f';

            const customIcon = L.divIcon({
                className: 'custom-fleet-pin',
                html: `
                    <div style="
                        background-color: ${badgeBg};
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        border: 3px solid #ffffff;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #ffffff;
                        font-size: 14px;
                        cursor: pointer;
                        position: relative;
                    ">
                        🚗
                    </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const popupContent = `
                <div style="font-family: sans-serif; width: 220px; padding: 4px;">
                    ${car.image ? `
                        <div style="width: 100%; height: 60px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
                            <img src="${car.image}" alt="${car.carName}" style="width: 100%; height: 100%; object-fit: cover;" onError="this.style.display='none'" />
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <strong style="font-size: 15px; color: #1e293b;">${car.carName}</strong>
                        <span style="
                            background: ${badgeBg};
                            color: #fff;
                            font-size: 10px;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-weight: 600;
                        ">${car.status}</span>
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                        🏷️ Plate: <strong>${car.plateNumber}</strong>
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                        📍 ${car.locationName}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                        ⚡ Speed: <strong>${car.speed}</strong>
                    </div>
                    <div style="font-size: 12px; color: #64748b;">
                        ⛽ Fuel/Battery: <strong>${car.fuelLevel}</strong>
                    </div>
                </div>
            `;

            const marker = L.marker([car.lat, car.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(popupContent);

            marker.on('click', () => {
                setSelectedCarId(car.id);
            });

            markersRef.current[car.id] = marker;
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const adminLat = pos.coords.latitude;
                const adminLng = pos.coords.longitude;

                const adminIcon = L.divIcon({
                    className: 'admin-location-pin',
                    html: `
                        <div style="
                            background: #722ed1;
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            border: 3px solid #fff;
                            box-shadow: 0 4px 12px rgba(114,46,209,0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #fff;
                            font-size: 16px;
                        ">
                            👑
                        </div>
                    `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                });

                L.marker([adminLat, adminLng], { icon: adminIcon })
                    .addTo(map)
                    .bindPopup('<b>Admin Control Station</b><br/>You are located here.');
            });
        }
    }, [filteredFleet]);

    const handleSelectCar = (car: CarFleetMarker) => {
        setSelectedCarId(car.id);
        if (mapRef.current) {
            mapRef.current.flyTo([car.lat, car.lng], 15, { duration: 1.2 });
            const marker = markersRef.current[car.id];
            if (marker) {
                marker.openPopup();
            }
        }
    };

    return (
        <DashBoardLayout>
            <div style={{ paddingBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h2 style={{ margin: 0, fontWeight: 700 }}>Live Fleet GPS Tracker</h2>
                        <span style={{ color: '#8c8c8c', fontSize: '13px' }}>Real-time location monitoring of active and available rental vehicles</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <Tooltip title="Auto-refetches live GPS coordinates from backend every 5 seconds">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', padding: '6px 12px', borderRadius: 8 }}>
                                <WifiOutlined style={{ color: isLivePolling ? '#52c41a' : '#8c8c8c' }} />
                                <span style={{ fontSize: 13, fontWeight: 500 }}>Live Telemetry (5s):</span>
                                <Switch
                                    checked={isLivePolling}
                                    onChange={(checked) => setIsLivePolling(checked)}
                                    size="small"
                                />
                            </div>
                        </Tooltip>

                        <Button
                            type="primary"
                            icon={<AimOutlined />}
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current.flyTo([defaultCenter.latitude, defaultCenter.longitude], 13);
                                }
                            }}
                        >
                            Center Fleet
                        </Button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
                    <Card size="small" className="admin-card-hover" style={{ borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ background: '#e6f7ff', color: '#1890ff', padding: 10, borderRadius: 8, fontSize: 20 }}>
                                <CarOutlined />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Total Fleet</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.total} Vehicles</div>
                            </div>
                        </div>
                    </Card>

                    <Card size="small" className="admin-card-hover" style={{ borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ background: '#f6ffed', color: '#52c41a', padding: 10, borderRadius: 8, fontSize: 20 }}>
                                <CheckCircleOutlined />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Available</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>{stats.available} Parked</div>
                            </div>
                        </div>
                    </Card>

                    <Card size="small" className="admin-card-hover" style={{ borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ background: '#e6f7ff', color: '#1890ff', padding: 10, borderRadius: 8, fontSize: 20 }}>
                                <SyncOutlined spin />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Active Trips</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>{stats.onTrip} On Road</div>
                            </div>
                        </div>
                    </Card>

                    <Card size="small" className="admin-card-hover" style={{ borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ background: '#fff1f0', color: '#ff4d4f', padding: 10, borderRadius: 8, fontSize: 20 }}>
                                <ToolOutlined />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Service/Maintenance</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#ff4d4f' }}>{stats.maintenance} In Shop</div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                    <Card
                        className="admin-card-hover"
                        bordered={false}
                        bodyStyle={{ padding: 0 }}
                        style={{ borderRadius: 12, overflow: 'hidden', minHeight: 520, position: 'relative', zIndex: 1 }}
                    >
                        <div id="fleet-map" style={{ height: '540px', width: '100%', borderRadius: 12, overflow: 'hidden' }} />
                    </Card>

                    <Card
                        className="admin-card-hover"
                        title={
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
                                <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Tracked Vehicles ({filteredFleet.length})</span>
                                <Input
                                    placeholder="Search by car name, plate or location..."
                                    prefix={<SearchOutlined />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    allowClear
                                />
                                <Segmented
                                    options={['All', 'On Trip', 'Available', 'Maintenance']}
                                    value={statusFilter}
                                    onChange={(val) => setStatusFilter(val as string)}
                                    block
                                />
                            </div>
                        }
                        bordered={false}
                        headStyle={{ padding: '16px 20px 12px 20px', borderBottom: '1px solid #f1f5f9' }}
                        style={{ borderRadius: 12, height: 540, overflow: 'hidden' }}
                        bodyStyle={{ height: '375px', overflowY: 'auto', padding: '16px 20px' }}
                    >
                        {filteredFleet.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 30, color: '#8c8c8c' }}>
                                No vehicles found matching your criteria.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {filteredFleet.map((car) => {
                                    const isSelected = car.id === selectedCarId;
                                    let tagColor = 'blue';
                                    if (car.status === 'Available') tagColor = 'green';
                                    if (car.status === 'Maintenance') tagColor = 'red';

                                    return (
                                        <div
                                            key={car.id}
                                            onClick={() => handleSelectCar(car)}
                                            style={{
                                                padding: '12px 14px',
                                                borderRadius: 8,
                                                border: `1.5px solid ${isSelected ? '#1890ff' : '#e2e8f0'}`,
                                                background: isSelected ? '#e0f2fe' : '#f8fafc',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                gap: 12,
                                                alignItems: 'center'
                                            }}
                                        >
                                            {/* {car.image && (
                                                <img
                                                    src={car.image}
                                                    alt={car.carName}
                                                    style={{
                                                        width: 52,
                                                        height: 52,
                                                        borderRadius: 6,
                                                        objectFit: 'cover',
                                                        border: '1px solid #cbd5e1',
                                                        flexShrink: 0
                                                    }}
                                                    onError={(e: any) => { e.target.style.display = 'none'; }}
                                                />
                                            )} */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.carName}</span>
                                                    <Tag color={tagColor} style={{ margin: 0 }}>{car.status}</Tag>
                                                </div>
                                                <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                                    <span>🏷️ {car.plateNumber}</span>
                                                    <span>⚡ {car.speed}</span>
                                                </div>
                                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <EnvironmentOutlined /> {car.locationName}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </DashBoardLayout>
    );
};

const LeafletMap = () => {
    const defaultCenter: Coordinates = { latitude: 21.1702, longitude: 72.8311 };

    if (!isV2Enabled()) {
        return (
            <DashBoardLayout>
                <h2 style={{ marginBottom: 15 }}>Map</h2>
                <SimpleBaselineMap center={defaultCenter} />
            </DashBoardLayout>
        );
    }

    return <V2FleetMap defaultCenter={defaultCenter} />;
};

export default LeafletMap;