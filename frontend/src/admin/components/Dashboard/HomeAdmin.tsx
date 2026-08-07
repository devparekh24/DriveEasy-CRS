import React, { useState } from 'react';
import DashBoardLayout from "../../pages/DashBoardLayout";
import CardCom from "./Card";
import RevenueChart from "./RevenueChart";
import FleetDistributionChart from "./FleetDistributionChart";
import {
    DollarOutlined,
    ShoppingCartOutlined,
    CarOutlined,
    UserOutlined,
    WarningOutlined,
    ReloadOutlined,
    SearchOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { useGetAllCarsQuery } from "../../../services/carApi";
import { useGetAllOrdersQuery } from "../../../services/orderApi";
import { useGetAllUsersQuery } from "../../../services/userApi";
import { useGetAllDamageReportsQuery } from "../../../services/damageReportApi";
import { Table, Button, Input, Tag, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { isV2Enabled } from '../../../utils/featureFlags';

const { Title, Text } = Typography;

const HomeAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    const { data: carsData, refetch: refetchCars } = useGetAllCarsQuery();
    const { data: ordersData, refetch: refetchOrders, isLoading: isLoadingOrders } = useGetAllOrdersQuery();
    const { data: usersData, refetch: refetchUsers } = useGetAllUsersQuery();
    const { data: damageData, refetch: refetchDamage } = useGetAllDamageReportsQuery();

    const handleRefreshAll = () => {
        refetchCars();
        refetchOrders();
        refetchUsers();
        refetchDamage();
    };

    const carsList = (carsData as any)?.data?.data || (carsData as any)?.data || [];
    const ordersList = (ordersData as any)?.data?.data || (ordersData as any)?.data || [];
    const usersList = (usersData as any)?.data?.data || (usersData as any)?.data || [];
    const damageList = (damageData as any)?.data?.data || (damageData as any)?.data || [];

    const totalCarsCount = Array.isArray(carsList) ? carsList.length : 0;
    const totalOrdersCount = Array.isArray(ordersList) ? ordersList.length : 0;
    const totalUsersCount = Array.isArray(usersList) ? usersList.length : 0;
    const totalDamageReportsCount = Array.isArray(damageList) ? damageList.length : 0;

    const totalRevenue = Array.isArray(ordersList)
        ? ordersList.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0)
        : 0;

    const filteredOrders = Array.isArray(ordersList)
        ? ordersList.filter((o: any) => {
            const query = searchText.toLowerCase();
            const customerName = o.user?.name || o.name || "";
            const customerEmail = o.user?.email || o.email || "";
            const carName = o.car?.carName || o.carName || "";
            return (
                customerName.toLowerCase().includes(query) ||
                customerEmail.toLowerCase().includes(query) ||
                carName.toLowerCase().includes(query)
            );
        })
        : [];

    const columns = [
        {
            title: "Customer",
            dataIndex: "user",
            key: "user",
            render: (userObj: any, record: any) => (
                <div style={{ fontWeight: 600, color: "#1e293b" }}>
                    {userObj?.name || record.name || "N/A"}
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>
                        {userObj?.email || record.email || ""}
                    </div>
                </div>
            ),
        },
        {
            title: "Vehicle",
            dataIndex: "car",
            key: "car",
            render: (carObj: any, record: any) => (
                <span>{carObj?.carName || record.carName || "N/A"}</span>
            ),
        },
        {
            title: "Trip Distance",
            dataIndex: "totalKm",
            key: "totalKm",
            render: (km: number) => <span>{km ? `${Number(km).toFixed(1)} km` : "N/A"}</span>,
        },
        {
            title: "Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amt: number) => (
                <Tag color="green" style={{ fontSize: "13px", padding: "2px 8px", fontWeight: 600 }}>
                    ₹{Math.round(amt || 0).toLocaleString("en-IN")}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate("/orders")}
                >
                    View Orders
                </Button>
            ),
        },
    ];

    // Standard Baseline View when v2_features_enabled cookie is OFF
    if (!isV2Enabled()) {
        return (
            <DashBoardLayout>
                <div style={{ paddingBottom: 24 }}>
                    <Title level={3} style={{ marginBottom: 20 }}>Dashboard Overview</Title>
                    
                    {/* Baseline Stat Cards */}
                    <div className="cards-grid" style={{ marginBottom: 24 }}>
                        <CardCom title="Total Cars" totalQty={totalCarsCount} icon={<CarOutlined />} color="#722ed1" />
                        <CardCom title="Total Orders" totalQty={totalOrdersCount} icon={<ShoppingCartOutlined />} color="#1890ff" />
                        <CardCom title="Total Users" totalQty={totalUsersCount} icon={<UserOutlined />} color="#fa8c16" />
                        <CardCom title="Total Damage Reports" totalQty={totalDamageReportsCount} icon={<WarningOutlined />} color="#f5222d" />
                    </div>

                    {/* Baseline Orders Table */}
                    <Card title="Recent Orders" bordered={false}>
                        <Table
                            dataSource={filteredOrders}
                            columns={columns}
                            rowKey={(rec) => rec._id || Math.random().toString()}
                            pagination={{ pageSize: 5 }}
                            loading={isLoadingOrders}
                        />
                    </Card>
                </div>
            </DashBoardLayout>
        );
    }

    // V2 Feature View when v2_features_enabled cookie is ON
    return (
        <DashBoardLayout>
            <div style={{ paddingBottom: 24 }}>
                {/* Header Title & Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>Dashboard Overview</Title>
                        <Text type="secondary">Real-time statistics, revenue analytics, and fleet health</Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleRefreshAll}
                        style={{
                            background: '#1890ff',
                            color: '#ffffff',
                            fontWeight: 500,
                            borderRadius: 8,
                            height: 38,
                            display: 'inline-flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 6px rgba(24, 144, 255, 0.3)',
                        }}
                    >
                        Refresh Data
                    </Button>
                </div>

                {/* Top Stat Cards Grid */}
                <div className="cards-grid" style={{ marginBottom: 24 }}>
                    <CardCom
                        title="Total Revenue"
                        totalQty={`₹${Math.round(totalRevenue || 0).toLocaleString("en-IN")}`}
                        icon={<DollarOutlined />}
                        color="#52c41a"
                    />
                    <CardCom
                        title="Total Orders"
                        totalQty={totalOrdersCount}
                        icon={<ShoppingCartOutlined />}
                        color="#1890ff"
                    />
                    <CardCom
                        title="Total Cars"
                        totalQty={totalCarsCount}
                        icon={<CarOutlined />}
                        color="#722ed1"
                    />
                    <CardCom
                        title="Total Users"
                        totalQty={totalUsersCount}
                        icon={<UserOutlined />}
                        color="#fa8c16"
                    />
                    <CardCom
                        title="Total Damage Reports"
                        totalQty={totalDamageReportsCount}
                        icon={<WarningOutlined />}
                        color="#f5222d"
                    />
                </div>

                {/* Interactive Revenue & Fleet Distribution Charts */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 24 }}>
                    <RevenueChart orders={ordersList} />
                    <FleetDistributionChart cars={carsList} />
                </div>

                {/* Recent Bookings Interactive Table */}
                <Card
                    className="admin-card-hover"
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                            <span>Recent Booking Orders</span>
                            <Input
                                placeholder="Search customer, email..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 220 }}
                                allowClear
                            />
                        </div>
                    }
                    bordered={false}
                    style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                    <Table
                        className="admin-table-styled"
                        dataSource={filteredOrders}
                        columns={columns}
                        rowKey={(rec) => rec._id || Math.random().toString()}
                        rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
                        }}
                        loading={isLoadingOrders}
                    />
                </Card>
            </div>
        </DashBoardLayout>
    );
};

export default HomeAdmin;
