import React, { useEffect, useState } from 'react';
import { isV2Enabled } from '../../utils/featureFlags';
import {
    UsergroupAddOutlined,
    FileTextOutlined,
    UserOutlined,
    CarOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    EnvironmentOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import { Layout, Menu, message, theme, Button } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../slices/authSlice';
import Avatar from '@mui/material/Avatar';
import { MdOutlineContactPhone } from 'react-icons/md';
import { useGetUserMutation } from '../../services/userApi';
import { useLogoutMutation } from '../../services/authApi';
import { setUsers } from '../../slices/userSlice';

const { Header, Content, Footer, Sider } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

const DashBoardLayout = (props: DashboardProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loginUser = useAppSelector(state => state.user.users);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);

    const [collapsed, setCollapsed] = useState<boolean>(window.innerWidth <= 992);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 992);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 992;
            setIsMobile(mobile);
            if (mobile) {
                setCollapsed(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [getUser, { isError, error }] = useGetUserMutation();
    const [logoutApi] = useLogoutMutation();

    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser)?.userId : null;

    const getCurrentUser = async () => {
        try {
            if (userId) {
                await getUser(userId).unwrap();
            }
            if (isError) throw error;
        } catch (err: any) {
            if (err?.data?.message) {
                message.error(err.data.message);
            }
        }
    };

    useEffect(() => {
        if (userId) {
            getCurrentUser();
        }
    }, [isLogin, userId]);

    // Extract user profile image correctly from Redux state or localStorage
    const rawUser: any = loginUser[0];
    const authState = useAppSelector(state => state.auth);
    const authUser = storedUser ? JSON.parse(storedUser)?.user : null;
    const currentUser = (rawUser?.data && typeof rawUser.data === 'object' && !Array.isArray(rawUser.data) ? rawUser.data : rawUser) || authUser;

    let rawImg = currentUser?.image || currentUser?.user?.image;
    if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http://res.cloudinary.com')) {
        rawImg = rawImg.replace('http://res.cloudinary.com', 'https://res.cloudinary.com');
    }
    const avatarSrc = (rawImg && rawImg !== '/broken-image.jpg' && rawImg !== 'undefined' && rawImg !== 'null') ? rawImg : undefined;
    const displayName = currentUser?.name || authState.name || 'Admin';

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = async () => {
        sessionStorage.setItem('isLoggingOut', 'true');
        try {
            await logoutApi().unwrap();
        } catch {
            // proceed even if API call fails
        }
        dispatch(logout());
        dispatch(setUsers([]));
        message.success('Logged out successfully!');
        navigate('/login');
    };

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path === '/admin') return '1';
        if (path === '/cars-list') return '2';
        if (path === '/orders') return '3';
        if (path === '/users') return '4';
        if (path === '/damage-reports') return '5';
        if (path === '/contact-queries') return '6';
        if (path === '/maps') return '7';
        if (path === '/me') return '8';
        return '1';
    };

    return (
        <Layout style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
            {/* Dim Backdrop Overlay for Mobile when Sider is open */}
            {isMobile && !collapsed && (
                <div
                    onClick={() => setCollapsed(true)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        zIndex: 999,
                        transition: 'opacity 0.2s ease',
                    }}
                />
            )}

            {/* Fixed Left Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                collapsedWidth="0"
                width={230}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    height: '100vh',
                    borderStartEndRadius: '24px',
                    borderBottomRightRadius: '24px',
                    zIndex: 1000,
                    boxShadow: collapsed ? 'none' : '4px 0 16px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 0 20px 0' }}>
                    {/* User Profile Avatar Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0 20px' }}>
                        <Avatar
                            src={avatarSrc}
                            sx={{
                                width: 60,
                                height: 60,
                                border: isV2Enabled() ? '2.5px solid #343a40' : '2.5px solid #1890ff',
                                boxShadow: isV2Enabled() ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(24, 144, 255, 0.4)',
                                bgcolor: isV2Enabled() ? '#1e293b' : '#1890ff',
                                color: '#fff',
                                fontSize: '24px',
                                fontWeight: 600,
                            }}
                        >
                            {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <h4 style={{ color: '#fff', marginTop: 10, marginBottom: 2, fontWeight: 600 }}>
                            {displayName}
                        </h4>
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>Admin Dashboard</span>
                    </div>

                    {/* Main Nav Menu */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
                            <Menu.Item key="1" icon={<HomeOutlined />}>
                                <NavLink to='/admin'>Dashboard</NavLink>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<CarOutlined />}>
                                <NavLink to="/cars-list">Cars</NavLink>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
                                <NavLink to="/orders">Orders</NavLink>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<UsergroupAddOutlined />}>
                                <NavLink to="/users">Users</NavLink>
                            </Menu.Item>
                            <Menu.Item key="5" icon={<FileTextOutlined />}>
                                <NavLink to="/damage-reports">Damage Reports</NavLink>
                            </Menu.Item>
                            <Menu.Item key="6" icon={<MdOutlineContactPhone />}>
                                <NavLink to="/contact-queries">Contact Queries</NavLink>
                            </Menu.Item>
                            <Menu.Item key="7" icon={<EnvironmentOutlined />}>
                                <NavLink to="/maps">Map</NavLink>
                            </Menu.Item>
                        </Menu>
                    </div>

                    {/* Bottom Nav Menu */}
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
                        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
                            <Menu.Item key="8" icon={<UserOutlined />}>
                                <NavLink to="/me">My Profile</NavLink>
                            </Menu.Item>
                            <Menu.Item key="9" icon={<LogoutOutlined rotate={180} />} onClick={handleLogout} style={{ color: '#ff4d4f' }}>
                                Logout
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </Sider>

            {/* Main Content Layout Container */}
            <Layout style={{
                marginLeft: isMobile ? 0 : (collapsed ? 0 : 230),
                width: isMobile ? '100%' : (collapsed ? '100%' : 'calc(100% - 230px)'),
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                background: '#f5f7fa'
            }}>
                {/* Top Header Navigation Bar with Toggle Button */}
                <Header style={{
                    padding: '0 16px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    zIndex: 99,
                    height: 56,
                    lineHeight: '56px'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 20 }} /> : <MenuFoldOutlined style={{ fontSize: 20 }} />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>DriveEasy Admin</span>
                    <div style={{ width: 32 }} />
                </Header>

                <Content style={{ margin: isMobile ? '12px 8px 8px' : '24px 16px 16px', flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            padding: isMobile ? 12 : 24,
                            flex: 1,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        {props.children}
                    </div>
                </Content>

                {/* Fixed/Sticky Bottom Right Footer across all Admin Tabs */}
                <Footer
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 10,
                        textAlign: 'center',
                        color: '#8c8c8c',
                        padding: '12px 24px',
                        background: '#ffffff',
                        borderTop: '1px solid #f0f0f0',
                        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)',
                    }}
                >
                    DriveEasy ©{new Date().getFullYear()}. All Rights Reserved.
                </Footer>
            </Layout>
        </Layout>
    );
};

export default DashBoardLayout;
