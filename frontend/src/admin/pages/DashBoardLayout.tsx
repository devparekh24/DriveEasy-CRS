import React from 'react';
import { FileTextOutlined, UserOutlined, CarOutlined, HomeOutlined, ShoppingCartOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../slices/authSlice';
const { Content, Footer, Sider } = Layout;
import Avatar from '@mui/material/Avatar';
import { MdOutlineContactPhone } from 'react-icons/md';

interface DashboardProps {
    children: React.ReactNode;
}

const DashBoardLayout = (props: DashboardProps) => {
    // const { name, token } = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()
    const loginUser = useAppSelector(state => state.auth.user);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ height: '100%', minHeight: '100vh' }}>
            <Sider
                style={{ borderStartEndRadius: '50px', borderBottomRightRadius: '50px' }}
                breakpoint="lg"
                collapsedWidth="0">
                <div className="demo-logo-vertical" style={{ margin: 55 }} >
                    <Avatar src={loginUser?.image} sx={{ width: 57, height: 57 }} />
                </div>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <NavLink to='/'>Dashboard</NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<CarOutlined />}>
                        <NavLink to="/cars">Cars</NavLink>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
                        <NavLink to="/orders">Orders</NavLink>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}>
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
                <Menu theme="dark" mode="inline" style={{ marginTop: '180px' }}>
                    <Menu.Item key="8" icon={<LogoutOutlined rotate={180} />}>
                        <NavLink to='/login' onClick={() => dispatch(logout())}>Logout</NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div
                        style={{
                            padding: 35,
                            height: '100%',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                        {props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    DriveEasy ©{new Date().getFullYear()}. All Rights Reserved.
                </Footer>
            </Layout>
        </Layout >
    );
};

export default DashBoardLayout;
