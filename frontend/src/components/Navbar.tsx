import { useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { logout, setUserLogin } from "../slices/authSlice";

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
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
            dispatch(setUserLogin({ name: user.name, token: user.token, role: user.role }));
        }
    }, [dispatch]);
    
    return (
        <div>
            <header>
                <h3>CarRental</h3>
                <nav ref={navRef}>
                    <Link to="/">Home</Link>
                    <Link to="/cars">Cars</Link>
                    {/* <Link to="/Booking">Booking</Link> */}
                    <Link to="/contact">Contact</Link>
                    {
                        isLogin ? <Link to="/" onClick={() => dispatch(logout())}>Logout</Link> : <Link to="/login">Login</Link>
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
