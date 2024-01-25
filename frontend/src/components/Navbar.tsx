import { useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
        }
    };

    return (
        <div>
            <header>
                <h3>CarRental</h3>
                <nav ref={navRef}>
                    <Link to="/">Home</Link>
                    <Link to="/cars">Cars</Link>
                    {/* <Link to="/Booking">Booking</Link> */}
                    <Link to="/contact">Contact</Link>
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
