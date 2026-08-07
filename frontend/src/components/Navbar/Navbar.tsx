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

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [getUser, { data, isError, error, isSuccess }] = useGetUserMutation()
    const [logoutApi] = useLogoutMutation()

    const getCurrentUser = async () => {
        try {
            const userStorage = localStorage.getItem('user');
            if (!userStorage) return;
            const userId = JSON.parse(userStorage)?.userId;
            if (userId) {
                await getUser(userId).unwrap()
            }
        }
        catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to fetch user data';
            message.error(errorMessage)
        }
    }

    useEffect(() => {
        if (isLogin) {
            getCurrentUser()
        }
    }, [isLogin])

    useEffect(() => {
        if (isSuccess && data) {
            const userObj = (data as any)?.data?.data || (data as any)?.data;
            if (userObj) {
                dispatch(setUsers([userObj]));
            }
        }
    }, [dispatch, isSuccess, data]);

    const loginUser = useAppSelector(state => state.user.users);

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
        try {
            await logoutApi().unwrap();
        } catch {
            // proceed even if API fails
        }
        dispatch(logout());
        dispatch(setUsers([]));
        navigate("/login");
    };

    return (
        <div>
            <header>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <SiMediamarkt style={{ fontSize: 40, color: '#ffffff' }} />
                    <div data-aos="fade-right">
                        <h3>DriveEasy</h3>
                    </div>
                </div>
                <nav ref={navRef}>
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
