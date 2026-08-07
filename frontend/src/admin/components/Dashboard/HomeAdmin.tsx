import { useEffect, useMemo, useState } from "react";
import { useGetAllCarsQuery } from "../../../services/carApi";
import DashBoardLayout from "../../pages/DashBoardLayout";
import CardCom from "./Card";
import RevenueChart from "./RevenueChart";
import FleetDistributionChart from "./FleetDistributionChart";
import './card.css';
import { Card, Table, Tag, Input, Button, Space, Typography } from "antd";
import { useGetAllUsersQuery } from "../../../services/userApi";
import { useGetAllOrdersQuery } from "../../../services/orderApi";
import { useGetAllDamageReportsQuery } from "../../../services/damageReportApi";
import {
    CarOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    WarningOutlined,
    DollarOutlined,
    SearchOutlined,
    EyeOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Home = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    const {
        data: carData,
        isError: isErrorOnCar,
        error: errorOnCar,
        refetch: refetchCars,
        isLoading: isLoadingCars
    } = useGetAllCarsQuery();

    const {
        data: userData,
        isError: isErrorOnUser,
        error: errorOnUser,
        refetch: refetchUsers,
        isLoading: isLoadingUsers
    } = useGetAllUsersQuery();

    const {
        data: orderData,
        isError: isErrorOnOrder,
        error: errorOnOrder,
        refetch: refetchOrders,
        isLoading: isLoadingOrders
    } = useGetAllOrdersQuery();

    const {
        data: damageReportData,
        isError: isErrorOnDamageReport,
        error: errorOnDamageReport,
        refetch: refetchDamageReports,
        isLoading: isLoadingDamageReports
    } = useGetAllDamageReportsQuery();

    // Safely extract arrays from backend nested response structure { data: { data: [...] } } or direct array
    const carsList = useMemo(() => {
        if (!carData) return [];
        if (Array.isArray(carData)) return carData;
        if (Array.isArray((carData as any)?.data?.data)) return (carData as any).data.data;
        if (Array.isArray((carData as any)?.data)) return (carData as any).data;
        return [];
    }, [carData]);

    const usersList = useMemo(() => {
        if (!userData) return [];
        if (Array.isArray(userData)) return userData;
        if (Array.isArray((userData as any)?.data?.data)) return (userData as any).data.data;
        if (Array.isArray((userData as any)?.data)) return (userData as any).data;
        return [];
    }, [userData]);

    const ordersList = useMemo(() => {
        if (!orderData) return [];
        if (Array.isArray(orderData)) return orderData;
        if (Array.isArray((orderData as any)?.data?.data)) return (orderData as any).data.data;
        if (Array.isArray((orderData as any)?.data)) return (orderData as any).data;
        return [];
    }, [orderData]);

    const damageReportsList = useMemo(() => {
        if (!damageReportData) return [];
        if (Array.isArray(damageReportData)) return damageReportData;
        if (Array.isArray((damageReportData as any)?.data?.data)) return (damageReportData as any).data.data;
        if (Array.isArray((damageReportData as any)?.data)) return (damageReportData as any).data;
        return [];
    }, [damageReportData]);

    // Calculate metrics
    const totalCarsCount = carsList.length || (carData as any)?.resutls || 0;
    const totalUsersCount = usersList.length || (userData as any)?.resutls || 0;
    const totalOrdersCount = ordersList.length || (orderData as any)?.resutls || 0;
    const totalDamageReportsCount = damageReportsList.length || (damageReportData as any)?.resutls || 0;

    const totalRevenue = useMemo(() => {
        return ordersList.reduce((sum: number, item: any) => sum + (Number(item?.totalAmount) || 0), 0);
    }, [ordersList]);

    const handleRefreshAll = () => {
        refetchCars();
        refetchUsers();
        refetchOrders();
        refetchDamageReports();
    };

    // Filtered Recent Orders for Table
    const filteredOrders = useMemo(() => {
        if (!searchText.trim()) return ordersList;
        const q = searchText.toLowerCase();
        return ordersList.filter(
            (o: any) =>
                o?.fullName?.toLowerCase().includes(q) ||
                o?.emailAddress?.toLowerCase().includes(q) ||
                o?.phoneNo?.toLowerCase().includes(q) ||
                o?.pickupAddress?.toLowerCase().includes(q)
        );
    }, [ordersList, searchText]);

    const columns = [
        {
            title: "Customer Name",
            dataIndex: "fullName",
            key: "fullName",
            render: (text: string, record: any) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{text || "N/A"}</div>
                    <div style={{ fontSize: "11px", color: "#8c8c8c" }}>{record.emailAddress || ""}</div>
                </div>
            ),
        },
        {
            title: "Pickup Address",
            dataIndex: "pickupAddress",
            key: "pickupAddress",
            render: (text: string) => text || "N/A",
        },
        {
            title: "Total Km",
            dataIndex: "totalKm",
            key: "totalKm",
            render: (km: number) => (km ? `${Number(km).toFixed(1)} km` : "N/A"),
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
                <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                    <CardCom
                        title="Total Revenue"
                        totalQty={`₹${totalRevenue.toLocaleString("en-IN")}`}
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

export default Home;
