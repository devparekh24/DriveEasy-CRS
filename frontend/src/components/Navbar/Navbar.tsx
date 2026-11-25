import { useEffect, useRef, useState } from "react";
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
    const [scrolled, setScrolled] = useState(false);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [getUser, { data, isSuccess }] = useGetUserMutation();
    const [logoutApi] = useLogoutMutation();
    const v2Active = isV2Enabled();

    const getCurrentUser = async () => {
        try {
            const userStorage = localStorage.getItem('user');
            if (!userStorage) return;
            const userId = JSON.parse(userStorage)?.userId;
            if (userId) {
                await getUser(userId).unwrap();
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to fetch user data';
            message.error(errorMessage);
        }
    };

    useEffect(() => {
        if (isLogin) {
            getCurrentUser();
        }
    }, [isLogin]);

    useEffect(() => {
        if (isSuccess && data) {
            const userObj = (data as any)?.data?.data || (data as any)?.data;
            if (userObj) {
                dispatch(setUsers([userObj]));
            }
        }
    }, [dispatch, isSuccess, data]);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.scrollY > 450) {
    //             setScrolled(true);
    //         } else {
    //             setScrolled(false);
    //         }
    //     };
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);


    const loginUser = useAppSelector(state => state.user.users);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
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

    const getUserDisplayEmail = () => {
        const storedUser = localStorage.getItem('user');
        const authUser = storedUser ? JSON.parse(storedUser) : null;
        const rawUser: any = loginUser[0];
        const email = rawUser?.email || rawUser?.data?.email || authUser?.email || authUser?.user?.email;
        if (email) return email;
        return "DriveEasy@luxury.com";
    };

    // V2 FLOATING GLASS CAPSULE NAVBAR
    if (v2Active) {
        return (
            <div className={`floating-nav-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
                <header className="floating-navbar">
                    {/* Left Brand Badge */}
                    <Link to="/" className="brand-badge-link">
                        <div className="logo-badge-circle">
                            <SiMediamarkt className="badge-icon" />
                        </div>
                        <span className="brand-text">Drive<span className="brand-text-gold">Easy</span></span>
                    </Link>

                    {/* Center Navigation Links */}
                    <nav ref={navRef} className="nav-center-menu">
                        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                            Home
                        </NavLink>
                        <NavLink to="/cars" className={({ isActive }) => (isActive ? "active" : "")}>
                            Cars
                        </NavLink>
                        <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
                            Booking
                        </NavLink>
                        <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                            Contact
                        </NavLink>

                        {/* Mobile Only Auth Links */}
                        <div className="mobile-only-auth">
                            {isLogin ? (
                                <>
                                    <Link to="/my-profile" className="mobile-profile-link">
                                        My Profile ({getUserDisplayEmail()})
                                    </Link>
                                    <button onClick={handleLogout} className="mobile-logout-btn">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink to="/login" className="mobile-login-link">
                                    Login / Register
                                </NavLink>
                            )}
                        </div>

                        <button className="nav-btn nav-close-btn" onClick={showNavbar} aria-label="Close menu">
                            <GrFormClose className="close-btn-icon" />
                        </button>
                    </nav>

                    {/* Right Oval Pill Button (matching reference image) */}
                    <div className="nav-right-capsule-container">
                        {isLogin ? (
                            <div className="nav-user-capsule">
                                {/* <Link to="/my-profile" className="user-email-pill" title={getUserDisplayEmail()}> */}
                                <Avatar
                                    src={
                                        (() => {
                                            const storedUser = localStorage.getItem('user');
                                            const authUser = storedUser ? JSON.parse(storedUser)?.user : null;
                                            const rawUser: any = loginUser[0];
                                            const currentUser = (rawUser?.data && typeof rawUser.data === 'object' && !Array.isArray(rawUser.data) ? rawUser.data : rawUser) || authUser;
                                            let rawImg = currentUser?.image || currentUser?.user?.image;
                                            if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http://res.cloudinary.com')) {
                                                rawImg = rawImg.replace('http://res.cloudinary.com', 'https://res.cloudinary.com');
                                            }
                                            return (rawImg && rawImg !== '/broken-image.jpg' && rawImg !== 'undefined' && rawImg !== 'null') ? rawImg : undefined;
                                        })()
                                    }
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        border: '2px solid #ffffff',
                                        bgcolor: '#1e293b',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 600
                                    }}
                                >
                                    {(((loginUser[0] as any)?.data ? (loginUser[0] as any)?.data?.name : loginUser[0]?.name) || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)?.name : 'U'))?.charAt(0).toUpperCase()}
                                </Avatar>
                                <button
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="capsule-logout-btn"
                                    aria-label="Logout"
                                >
                                    <RiLogoutCircleRLine className="logout-icon" style={{ fontSize: 20, width: 20, height: 20 }} />
                                </button>
                            </div>

                        ) : (
                            <Link to="/login" className="nav-guest-capsule">
                                <span className="pill-email-text">Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button className="nav-btn nav-open-btn" onClick={showNavbar} aria-label="Open menu">
                        <IoMenu />
                    </button>
                </header>
            </div>
        );
    }

    // V1 CLASSIC NAVBAR (when V2 feature flag is disabled)
    return (
        <div className="v1-navbar-wrapper">
            <header className="v1-header">
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <SiMediamarkt style={{ fontSize: 40, color: '#ffffff' }} />
                    <div data-aos="fade-right">
                        <h3>DriveEasy</h3>
                    </div>
                </div>
                <nav ref={navRef} className="v1-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/cars">Cars</NavLink>
                    <NavLink to="/booking">Booking</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    {
                        isLogin ? (
                            <>
                                <Link to="/my-profile">
                                    <Avatar
                                        src={
                                            (() => {
                                                const storedUser = localStorage.getItem('user');
                                                const authUser = storedUser ? JSON.parse(storedUser)?.user : null;
                                                const rawUser: any = loginUser[0];
                                                const currentUser = (rawUser?.data && typeof rawUser.data === 'object' && !Array.isArray(rawUser.data) ? rawUser.data : rawUser) || authUser;
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
                                            border: '2px solid #1890ff',
                                            bgcolor: '#1890ff',
                                            color: '#fff',
                                            fontSize: '16px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {(((loginUser[0] as any)?.data ? (loginUser[0] as any)?.data?.name : loginUser[0]?.name) || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)?.name : 'U'))?.charAt(0).toUpperCase()}
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
                </nav>
                <button className="nav-btn" onClick={showNavbar}>
                    <IoMenu />
                </button>
            </header>
        </div>
    );
};

export default Navbar;


