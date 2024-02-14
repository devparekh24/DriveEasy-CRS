import { useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout, setUserLogin } from "../../slices/authSlice";
import Avatar from '@mui/material/Avatar';

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
    const loginUser = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch(setUserLogin({ name: user.name, token: user.token, role: user.role, userId: user.userId, user: loginUser! }));
        }
    }, [dispatch]);

    return (
        <div>
            <header>
                <h3>DriveEasy</h3>
                <nav ref={navRef}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/cars">Cars</NavLink>
                    <NavLink to="/booking">Booking</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    {
                        isLogin ? (
                            <>
                                <NavLink to="/logout" onClick={() => dispatch(logout())}>Logout</NavLink>
                                <Link to="/my-profile">
                                    <Avatar src={loginUser?.image} />
                                </Link>
                            </>
                        ) : (<NavLink to="/login">Login</NavLink>)
                    }
                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        {/* <i className="bi bi-x"></i> */}
                        <GrFormClose className="close-btn-icon" />
                    </button>
                </nav>
                <button className="nav-btn" onClick={showNavbar}>
                    {/* <i class="bi bi-list"></i> */}
                    <IoMenu />
                </button>
            </header>
        </div>
    );
};

export default Navbar;
