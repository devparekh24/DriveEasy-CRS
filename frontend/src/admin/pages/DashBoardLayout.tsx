import React, { useEffect } from 'react';
import { UsergroupAddOutlined, FileTextOutlined, UserOutlined, CarOutlined, HomeOutlined, ShoppingCartOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, message, theme } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../slices/authSlice';
import Avatar from '@mui/material/Avatar';
import { MdOutlineContactPhone } from 'react-icons/md';
import { useGetUserMutation } from '../../services/userApi';
import { useLogoutMutation } from '../../services/authApi';
import { setUsers } from '../../slices/userSlice';

const { Content, Footer, Sider } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

const DashBoardLayout = (props: DashboardProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loginUser = useAppSelector(state => state.user.users);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
    
    const [getUser, { data, isError, error, isSuccess }] = useGetUserMutation();
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

    useEffect(() => {
        if (isSuccess && data) {
            const userObj = (data as any)?.data?.data || (data as any)?.data;
            if (userObj) {
                dispatch(setUsers([userObj]));
            }
        }
    }, [dispatch, isSuccess, data]);

    const authState = useAppSelector(state => state.auth);

    const rawUser: any = loginUser[0];
    const currentUser = (rawUser?.data && typeof rawUser.data === 'object' && !Array.isArray(rawUser.data) ? rawUser.data : rawUser) || authState.user || (storedUser ? JSON.parse(storedUser)?.user : null);
    let rawImg = currentUser?.image || (currentUser as any)?.user?.image;
    if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http://res.cloudinary.com')) {
        rawImg = rawImg.replace('http://res.cloudinary.com', 'https://res.cloudinary.com');
    }
    const avatarSrc = (rawImg && rawImg !== '/broken-image.jpg' && rawImg !== 'undefined' && rawImg !== 'null') ? rawImg : undefined;
    const displayName = currentUser?.name || authState.name || 'Admin';

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch {
            // proceed even if API call fails
        }
        dispatch(logout());
        dispatch(setUsers([]));
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
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Fixed Left Sidebar */}
            <Sider
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    height: '100vh',
                    borderStartEndRadius: '24px',
                    borderBottomRightRadius: '24px',
                    zIndex: 100,
                    boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
                }}
                breakpoint="lg"
                collapsedWidth="0"
                width={230}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 0 20px 0' }}>
                    {/* User Profile Avatar Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0 20px' }}>
                        <Avatar
                            src={avatarSrc}
                            sx={{
                                width: 60,
                                height: 60,
                                border: '2.5px solid #1890ff',
                                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
                                bgcolor: '#1890ff',
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

                    {/* Main Nav Menu (Scrollable if screen height is small) */}
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

                    {/* Bottom Nav Menu (Fixed at the end of sidebar) */}
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

            {/* Right Side Content Container with Independent Scrollbar */}
            <Layout style={{ marginLeft: 230, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
                <Content style={{ margin: '24px 16px 16px', flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            padding: 24,
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
