import React, { FC, useEffect, useState } from 'react';
import { FileTextOutlined, UserOutlined, CarOutlined, HomeOutlined, ShoppingCartOutlined, MessageOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../slices/authSlice';
const { Header, Content, Footer, Sider } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

// const items = [
//     { key: '1', icon: <HomeOutlined />, label: <NavLink to="/">Dashboard</NavLink> },
//     { key: '2', icon: <CarOutlined />, label: <NavLink to="/cars">Cars</NavLink> },
//     { key: '3', icon: <ShoppingCartOutlined />, label: <NavLink to="/orders">Orders</NavLink> },
//     { key: '4', icon: <UserOutlined />, label: <NavLink to="/users">Users</NavLink> },
//     { key: '5', icon: <FileTextOutlined />, label: <NavLink to="/damage-reports">Damage Reports</NavLink> },
//     { key: '6', icon: <MessageOutlined />, label: <NavLink to="/chat">Chat</NavLink> },
// ];


const DashBoardLayout = (props: DashboardProps) => {
    // const { name, token } = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ height: '100%', minHeight: '100vh' }}>
            <Sider
                style={{ borderStartEndRadius: '50px', borderBottomRightRadius: '50px' }}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    // console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    // console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" style={{ height: '100px' }} />
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
                    <Menu.Item key="6" icon={<MessageOutlined />}>
                        <NavLink to="/chats">Chat</NavLink>
                    </Menu.Item>
                    <Menu.Item key="7" icon={<EnvironmentOutlined />}>
                        <NavLink to="/maps">Map</NavLink>
                    </Menu.Item>
                </Menu>
                <Menu theme="dark" mode="inline" style={{ marginTop: '250px' }}>
                    <Menu.Item key="8" icon={<LogoutOutlined rotate={180} />}>
                        <NavLink to='/login' onClick={() => dispatch(logout())}>Logout</NavLink>
                    </Menu.Item>
                </Menu>
                {/* <Menu theme="dark" mode="inline" selectedKeys={[activeKey]}>
                    {
                        items.map((item) => (
                            <Menu.Item key={item.key} icon={item.icon} onClick={() => handleMenuClick(item.key)}>
                                {item.label}
                            </Menu.Item>
                        ))
                    }
                </Menu> */}
            </Sider>
            <Layout>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: '24px 16px 0' }}>
                    <div
                        style={{
                            padding: 35,
                            height: '100%',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout >
    );
};

export default DashBoardLayout;
