import { useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout } from "../../slices/authSlice";
import Avatar from '@mui/material/Avatar';
import { SiMediamarkt } from "react-icons/si";
import { useGetUserMutation } from "../../services/userApi";
import { useLogoutMutation } from "../../services/authApi";
import { message } from "antd";
import { setUsers } from "../../slices/userSlice";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { isV2Enabled } from '../../utils/featureFlags';

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [getUser, { data, isSuccess }] = useGetUserMutation()
    const [logoutApi] = useLogoutMutation()

    const authUserId = useAppSelector(state => state.auth.userId);
    const authToken = useAppSelector(state => state.auth.token);
    const authState = useAppSelector(state => state.auth);
    const loginUser = useAppSelector(state => state.user.users);

    const getCurrentUser = async () => {
        try {
            const userStorage = localStorage.getItem('user');
            if (!userStorage) return;
            const parsed = JSON.parse(userStorage);
            const targetId = authUserId || parsed?.userId;
            if (targetId) {
                await getUser(targetId).unwrap();
            }
        }
        catch (error: any) {
            // fail silently
        }
    }

    useEffect(() => {
        if (isLogin && authUserId) {
            getCurrentUser();
        }
    }, [isLogin, authUserId, authToken]);

    useEffect(() => {
        if (isSuccess && data) {
            const userObj = (data as any)?.data?.data || (data as any)?.data;
            if (userObj) {
                dispatch(setUsers([userObj]));
            }
        }
    }, [dispatch, isSuccess, data]);

    const activeUserObj: any = loginUser.find((u: any) => (u._id || u.id) === authUserId) || (loginUser[0] && (loginUser[0]._id === authUserId || (loginUser[0] as any).id === authUserId) ? loginUser[0] : null);
    const currentUser = (activeUserObj?.data && typeof activeUserObj.data === 'object' && !Array.isArray(activeUserObj.data) ? activeUserObj.data : activeUserObj) || authState.user || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)?.user : null);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
            // Add event listeners to toggle the navigation menu
            const navLinks = navRef.current.querySelectorAll("a");
            navLinks.forEach((link) => {
                link.addEventListener("click", () => {
                    navRef.current?.classList.remove("responsive_nav");
                });
            });
        }
    };

    const handleLogout = async () => {
        sessionStorage.setItem('isLoggingOut', 'true');
        try {
            await logoutApi().unwrap();
        } catch {
            // proceed even if API fails
        }
        dispatch(logout());
        dispatch(setUsers([]));
        message.success('Logged out successfully!');
        navigate("/login");
    };

    return (
        <div>
            <header>
                <Link to='/' className="logo">
                    Drive<span className="logo-easy">Easy</span>
                </Link>

                <nav ref={navRef}>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='/cars'>Cars</NavLink>
                    <NavLink to='/about'>About Us</NavLink>
                    <NavLink to='/contact'>Contact Us</NavLink>
                    {
                        isLogin && (
                            <NavLink to='/mybookings'>My Bookings</NavLink>
                        )
                    }

                    <button
                        className="nav-btn nav-close-btn"
                        onClick={showNavbar}>
                        <GrFormClose className="close-btn-icon" />
                    </button>
                </nav>
                <div className="login-reg">
                    {
                        isLogin ? (
                            <>
                                <Link to="/my-profile">
                                    <Avatar
                                        src={
                                            (() => {
                                                let rawImg = currentUser?.image || currentUser?.user?.image;
                                                if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http://res.cloudinary.com')) {
                                                    rawImg = rawImg.replace('http://res.cloudinary.com', 'https://res.cloudinary.com');
                                                }
                                                return (rawImg && rawImg !== '/broken-image.jpg' && rawImg !== 'undefined' && rawImg !== 'null') ? rawImg : undefined;
                                            })()
                                        }
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            border: isV2Enabled() ? '2px solid #343a40' : '2px solid #1890ff',
                                            bgcolor: isV2Enabled() ? '#1e293b' : '#1890ff',
                                            color: '#fff',
                                            fontSize: '16px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {(currentUser?.name || authState.name || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)?.name : 'U'))?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="nav-logout-btn"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '6px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: '12px',
                                        color: '#ffffff',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <RiLogoutCircleRLine style={{ fontSize: 26 }} />
                                </button>
                            </>
                        ) : (<NavLink to="/login">Login</NavLink>)
                    }
                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <GrFormClose className="close-btn-icon" />
                    </button>
                </div>
                <button className="nav-btn" onClick={showNavbar}>
                    <IoMenu />
                </button>
            </header>
        </div>
    );
};

export default Navbar;
