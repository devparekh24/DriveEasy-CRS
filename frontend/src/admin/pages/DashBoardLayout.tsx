import React, { useEffect } from 'react';
import { FileTextOutlined, UserOutlined, CarOutlined, HomeOutlined, ShoppingCartOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, message, theme } from 'antd';
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../slices/authSlice';
const { Content, Footer, Sider } = Layout;
import Avatar from '@mui/material/Avatar';
import { MdOutlineContactPhone } from 'react-icons/md';
import { useGetUserMutation } from '../../services/userApi';
import { setUsers } from '../../slices/userSlice';
import AdminLoader from '../components/adminLoader/adminLoader';

interface DashboardProps {
    children: React.ReactNode;
}

//custom hook
// const useCurrentUser = () => {
//     const [getUser, { data, isError, error, isSuccess, isLoading }] = useGetUserMutation();
//     const userId = JSON.parse(localStorage.getItem('user')!).userId
//     const handleCurrentUser = async () => {
//         try {
//             if (isError) throw error
//             await getUser(userId).unwrap();
//         } catch (error: any) {
//             console.error(error);
//         }
//     };
//     useEffect(() => {
//         handleCurrentUser();
//     }, []);

//     return { data, isSuccess, isLoading };
// };


const DashBoardLayout = (props: DashboardProps) => {

    const loginUser = useAppSelector(state => state.user.users);
    const [getUser, { data, isError, error, isSuccess, isLoading }] = useGetUserMutation()
    const dispatch = useAppDispatch()
    const userId = JSON.parse(localStorage.getItem('user')!).userId

    const getCurrentUser = async () => {
        try {
            if (userId) {
                await getUser(userId).unwrap()
            }
            if (isError) throw error
        }
        catch (error: any) {
            message.error(error.data.message)
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccess) {
                dispatch(setUsers(data!.data))
            }
        }, 100)

    }, [dispatch, isSuccess, data])

    //use of custom hook
    // const dispatch = useAppDispatch();

    // const { data, isLoading, isSuccess } = useCurrentUser()
    // useEffect(() => {
    //     if (isSuccess) {
    //         dispatch(setUsers(data!.data))
    //     }
    // }, [dispatch, isSuccess, data])

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Layout style={{ height: '100%', minHeight: '100vh' }}>
                <Sider
                    style={{ borderStartEndRadius: '50px', borderBottomRightRadius: '50px' }}
                    breakpoint="lg"
                    collapsedWidth="0">
                    <div className="demo-logo-vertical" style={{ margin: 55 }} >
                        <Avatar src={loginUser!.image} sx={{ width: 57, height: 57 }} />
                    </div>
                    <Menu theme="dark" mode="inline">
                        <Menu.Item key="1" icon={<HomeOutlined />}>
                            <NavLink to='/admin'>Dashboard</NavLink>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<CarOutlined />}>
                            <NavLink to="/cars-list">Cars</NavLink>
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
                    <Menu theme="dark" mode="inline" style={{ marginTop: '150px' }}>
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
                            {isLoading ? (<AdminLoader />) :
                                (<>
                                    {props.children}
                                </>)
                            }
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        DriveEasy ©{new Date().getFullYear()}. All Rights Reserved.
                    </Footer>
                </Layout>
            </Layout >

        </>

    );
};

export default DashBoardLayout;
