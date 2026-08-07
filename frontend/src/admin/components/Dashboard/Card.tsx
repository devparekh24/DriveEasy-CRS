import React from 'react';
import { Card } from 'antd';
import './card.css';

interface CardCompProps {
    title: string;
    totalQty: number | string;
    icon?: React.ReactNode;
    subtitle?: string;
    color?: string;
    background?: string;
}

const CardCom: React.FC<CardCompProps> = ({ title, totalQty, icon, subtitle, color = '#1890ff', background }) => (
    <Card
        className="admin-card-hover"
        bordered={false}
        style={{
            minWidth: 200,
            flex: 1,
            cursor: 'pointer',
            background: background || '#ffffff',
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </span>
                <h1 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 700, color: '#212529' }}>
                    {totalQty ?? 0}
                </h1>
            </div>
            {icon && (
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        color: color,
                    }}
                >
                    {icon}
                </div>
            )}
        </div>
        <div style={{ marginTop: 12, fontSize: '12px', color: '#6c757d' }}>
            {subtitle || (
                <>
                    {title === 'Total Cars' && 'Active vehicles in fleet'}
                    {title === 'Total Orders' && 'Successful bookings'}
                    {title === 'Total Users' && 'Registered customer accounts'}
                    {title === 'Total Damage Reports' && 'Reported damage incidents'}
                    {title === 'Total Revenue' && 'Cumulative rental earnings'}
                </>
            )}
        </div>
    </Card>
);

export default CardCom;