import React, { useState, useMemo } from 'react';
import { Card, Segmented, Tag, Tooltip } from 'antd';
import { RiseOutlined, FallOutlined, DollarOutlined } from '@ant-design/icons';

interface OrderItem {
    _id?: string;
    totalAmount?: number;
    createdAt?: string;
    pickupDateAndTime?: string;
    fullName?: string;
}

interface RevenueChartProps {
    orders: OrderItem[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ orders = [] }) => {
    const [period, setPeriod] = useState<string>('30days');
    const [hoveredData, setHoveredData] = useState<{ date: string; amount: number; count: number } | null>(null);

    // Group and aggregate orders by date according to period
    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) {
            // Generate dummy fallback data for illustration if no orders exist yet
            const days = period === '7days' ? 7 : period === '30days' ? 14 : 12;
            return Array.from({ length: days }).map((_, i) => {
                const d = new Date();
                if (period === 'all') {
                    d.setMonth(d.getMonth() - (11 - i));
                    return {
                        date: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                        amount: Math.floor(Math.random() * 25000) + 12000,
                        count: Math.floor(Math.random() * 8) + 3,
                    };
                }
                d.setDate(d.getDate() - (days - 1 - i));
                return {
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    amount: Math.floor(Math.random() * 8000) + 2000,
                    count: Math.floor(Math.random() * 5) + 1,
                };
            });
        }

        // Process real order data
        const map = new Map<string, { amount: number; count: number }>();
        const now = new Date();

        orders.forEach((order) => {
            const dateStr = order.createdAt || order.pickupDateAndTime;
            if (!dateStr) return;
            const orderDate = new Date(dateStr);

            let key = '';
            if (period === '7days') {
                const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
                if (diffDays > 7) return;
                key = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else if (period === '30days') {
                const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
                if (diffDays > 30) return;
                key = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else {
                key = orderDate.toLocaleString('default', { month: 'short', year: '2-digit' });
            }

            const current = map.get(key) || { amount: 0, count: 0 };
            map.set(key, {
                amount: current.amount + (order.totalAmount || 0),
                count: current.count + 1,
            });
        });

        // Convert map to array
        const result = Array.from(map.entries()).map(([date, val]) => ({
            date,
            amount: val.amount,
            count: val.count,
        }));

        if (result.length === 0) {
            // Fallback if no orders fit the filter
            return [
                { date: 'No Data', amount: 0, count: 0 }
            ];
        }

        return result;
    }, [orders, period]);

    const maxAmount = useMemo(() => {
        const max = Math.max(...chartData.map((d) => d.amount), 1);
        return Math.ceil(max * 1.15); // Add padding
    }, [chartData]);

    const totalPeriodRevenue = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.amount, 0);
    }, [chartData]);

    const averageOrderValue = useMemo(() => {
        const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0);
        return totalOrders > 0 ? Math.round(totalPeriodRevenue / totalOrders) : 0;
    }, [chartData, totalPeriodRevenue]);

    // SVG Graph parameters
    const svgWidth = 700;
    const svgHeight = 240;
    const padding = 40;
    const graphWidth = svgWidth - padding * 2;
    const graphHeight = svgHeight - padding * 2;

    const points = useMemo(() => {
        if (chartData.length === 0) return [];
        return chartData.map((d, index) => {
            const x = padding + (index / Math.max(chartData.length - 1, 1)) * graphWidth;
            const y = padding + graphHeight - (d.amount / maxAmount) * graphHeight;
            return { x, y, data: d };
        });
    }, [chartData, maxAmount, graphWidth, graphHeight, padding]);

    // Create smooth area path
    const pathD = useMemo(() => {
        if (points.length === 0) return '';
        if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${svgHeight - padding}`;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cpX = (curr.x + next.x) / 2;
            d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
        }
        return d;
    }, [points, svgHeight, padding]);

    const areaD = useMemo(() => {
        if (!pathD || points.length === 0) return '';
        const firstX = points[0].x;
        const lastX = points[points.length - 1].x;
        const bottomY = svgHeight - padding;
        return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    }, [pathD, points, svgHeight, padding]);

    return (
        <Card
            className="admin-card-hover"
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>Revenue Analytics</span>
                        <div style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: 400 }}>
                            Track earnings and booking performance
                        </div>
                    </div>
                    <Segmented
                        options={[
                            { label: '7 Days', value: '7days' },
                            { label: '30 Days', value: '30days' },
                            { label: 'All Time', value: 'all' },
                        ]}
                        value={period}
                        onChange={(val) => setPeriod(val as string)}
                    />
                </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}
        >
            {/* Top metrics header */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ background: '#f6ffed', padding: '12px 20px', borderRadius: 8, border: '1px solid #b7eb8f', flex: 1, minWidth: 160 }}>
                    <div style={{ color: '#52c41a', fontSize: '12px', fontWeight: 500 }}>
                        <DollarOutlined /> Period Revenue
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#274916', marginTop: 4 }}>
                        ₹{totalPeriodRevenue.toLocaleString('en-IN')}
                    </div>
                </div>
                <div style={{ background: '#e6f7ff', padding: '12px 20px', borderRadius: 8, border: '1px solid #91d5ff', flex: 1, minWidth: 160 }}>
                    <div style={{ color: '#1890ff', fontSize: '12px', fontWeight: 500 }}>
                        <RiseOutlined /> Avg Order Value
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#002c6c', marginTop: 4 }}>
                        ₹{averageOrderValue.toLocaleString('en-IN')}
                    </div>
                </div>
                <div style={{ background: '#fff7e6', padding: '12px 20px', borderRadius: 8, border: '1px solid #ffd591', flex: 1, minWidth: 160 }}>
                    <div style={{ color: '#fa8c16', fontSize: '12px', fontWeight: 500 }}>
                        <FallOutlined /> Hover Info
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#612500', marginTop: 4 }}>
                        {hoveredData ? `₹${hoveredData.amount.toLocaleString('en-IN')} (${hoveredData.count} orders)` : 'Hover graph nodes'}
                    </div>
                </div>
            </div>

            {/* Interactive SVG Chart */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', minWidth: 500 }}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1890ff" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#1890ff" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Y-axis gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const y = padding + graphHeight * (1 - ratio);
                        const val = Math.round(maxAmount * ratio);
                        return (
                            <g key={idx}>
                                <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} stroke="#f0f0f0" strokeDasharray="4 4" />
                                <text x={padding - 8} y={y + 4} textAnchor="end" fill="#bfbfbf" fontSize="10">
                                    ₹{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Gradient Area Fill */}
                    {areaD && <path d={areaD} fill="url(#revenueGradient)" />}

                    {/* Smooth Line */}
                    {pathD && <path d={pathD} fill="none" stroke="#1890ff" strokeWidth="3" strokeLinecap="round" />}

                    {/* Data Points & X Labels */}
                    {points.map((pt, idx) => (
                        <g key={idx}>
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={hoveredData?.date === pt.data.date ? 7 : 4}
                                fill={hoveredData?.date === pt.data.date ? '#096dd9' : '#1890ff'}
                                stroke="#fff"
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={() => setHoveredData(pt.data)}
                                onMouseLeave={() => setHoveredData(null)}
                            />
                            <text
                                x={pt.x}
                                y={svgHeight - padding + 18}
                                textAnchor="middle"
                                fill="#8c8c8c"
                                fontSize="11"
                            >
                                {pt.data.date}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </Card>
    );
};

export default RevenueChart;
