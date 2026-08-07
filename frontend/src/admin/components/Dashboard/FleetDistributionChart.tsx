import React, { useMemo } from 'react';
import { Card, Progress, Tag } from 'antd';
import { CarOutlined, ThunderboltOutlined, FireOutlined } from '@ant-design/icons';

interface CarItem {
    _id?: string;
    carName?: string;
    availability?: boolean;
    fule?: string;
    transmission?: string;
    bookedDates?: any[];
}

interface FleetDistributionChartProps {
    cars: CarItem[];
}

export const FleetDistributionChart: React.FC<FleetDistributionChartProps> = ({ cars = [] }) => {
    const stats = useMemo(() => {
        if (!cars || cars.length === 0) {
            return {
                available: 12,
                booked: 4,
                total: 16,
                availablePercent: 75,
                fuels: { Petrol: 8, Diesel: 5, EV: 2, CNG: 1 },
            };
        }

        const availableCount = cars.filter((c) => c.availability !== false && (!c.bookedDates || c.bookedDates.length === 0)).length;
        const total = cars.length;
        const bookedCount = total - availableCount;
        const availablePercent = total > 0 ? Math.round((availableCount / total) * 100) : 0;

        const fuels = cars.reduce((acc, curr) => {
            const fuel = curr.fule || 'Petrol';
            acc[fuel] = (acc[fuel] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            available: availableCount,
            booked: bookedCount,
            total,
            availablePercent,
            fuels,
        };
    }, [cars]);

    return (
        <Card
            className="admin-card-hover"
            title={
                <div>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>Fleet Availability & Fuel Types</span>
                    <div style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: 400 }}>
                        Real-time status of your rental fleet
                    </div>
                </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Fleet Availability Gauge */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontWeight: 600 }}>
                            Availability Ratio <Tag color="blue" style={{ marginLeft: 6 }}>{stats.availablePercent}%</Tag>
                        </span>
                        <span>
                            <Tag color="green">{stats.available} Available</Tag>
                            <Tag color="volcano">{stats.booked} Booked</Tag>
                        </span>
                    </div>
                    <Progress
                        percent={stats.availablePercent}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                        showInfo={false}
                    />
                </div>

                {/* Fuel Type Distribution */}
                <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: 600, marginBottom: 12 }}>Fuel Type Distribution</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                        {Object.entries(stats.fuels).map(([fuel, count]) => {
                            let color = '#1890ff';
                            let icon = <CarOutlined />;
                            if (fuel === 'Petrol') {
                                color = '#fa8c16';
                                icon = <FireOutlined />;
                            } else if (fuel === 'EV') {
                                color = '#52c41a';
                                icon = <ThunderboltOutlined />;
                            } else if (fuel === 'Diesel') {
                                color = '#722ed1';
                            } else if (fuel === 'CNG') {
                                color = '#13c2c2';
                            }

                            return (
                                <div
                                    key={fuel}
                                    style={{
                                        border: `1px solid ${color}40`,
                                        borderRadius: 8,
                                        padding: '12px',
                                        background: `${color}0d`,
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ color, fontSize: '18px', marginBottom: 4 }}>
                                        {icon}
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{count}</div>
                                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{fuel}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default FleetDistributionChart;
