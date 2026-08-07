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
        setTimeout(() => {
            if (isSuccess && data && (data as any).data) {
                dispatch(setUsers([(data as any).data]))
            }
        }, 1500)

    }, [dispatch, isSuccess, data])

    const loginUser = useAppSelector(state => state.user.users);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
            // Add event listeners to toggle the navigation menu
            const navLinks = document.querySelectorAll('header nav a');
            navLinks.forEach((link: any) => {
                link.addEventListener('click', () => {
                    navRef?.current?.classList.remove("responsive_nav");
                });
            });
        }
    };

    // Auth state is now initialized from localStorage in authSlice,
    // so no delayed restore is needed here.

    const handleLogout = async () => {
        try {
            // Call backend to clear the JWT cookie
            await logoutApi().unwrap()
        } catch {
            // Even if the backend call fails, still clear local state
        }
        dispatch(logout())
        dispatch(setUsers([]))
        navigate('/login')
    }

    return (
        <div>
            <header>
                <div className="title">
                    <SiMediamarkt style={{ fontSize: 40, margin: 5 }} />
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
                                    <Avatar src={loginUser[0]?.image} />
                                </Link>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    <RiLogoutCircleRLine style={{ marginTop: 8, fontSize: 25, color: 'inherit' }} />
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
