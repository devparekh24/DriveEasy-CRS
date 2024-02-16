import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./Footer.css";
import { SiMediamarkt } from "react-icons/si";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-row">
                <div className="footer-col">
                    <h3>About Us</h3>
                    <p>
                        Getting dressed up and traveling with good friends makes for a
                        shared, unforgettable experience.
                    </p>
                    <div style={{ display: 'flex' }}>
                        <SiMediamarkt style={{ fontSize: 40, margin: 5 }} />
                        <h2>DriveEasy</h2>
                    </div>
                    <h1>Drive Easy</h1>
                </div>
                <div className="footer-col">
                    <h3>Contact Info</h3>
                    <p>
                        <HiOutlineDevicePhoneMobile className="footer-icon" /> +91-123-456-7890
                    </p>
                    <p>
                        <IoLocationOutline className="footer-icon" />
                        Luxuria Business Hub, Dumas Rd, Surat
                    </p>
                    {/* <p>
                        <GiAlarmClock className="footer-icon" />
                        Mon - Sat 8.00 - 18.00 Sunday CLOSED
                    </p> */}
                    {/* <p className="social-icons">
                        <span className="social-media-icon facebook">
                            <GrFacebookOption />
                        </span>
                        <span className="social-media-icon twitter">
                            <AiOutlineTwitter />
                        </span>
                        <span className="social-media-icon youtube">
                            <BsYoutube />
                        </span>
                        <span className="social-media-icon pinterest">
                            <BiLogoPinterest />
                        </span>
                        <span className="social-media-icon instagram">
                            <AiOutlineInstagram />
                        </span>
                    </p> */}
                </div>
                {/* <div className="footer-col">
                    <h3>Newsletter</h3>
                    <p>
                        Don't miss a thing! Sign up to receive daily <br />
                        deals
                    </p>
                    <div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Your Email Address"
                        />
                        <button className="subscribe-btn">Subscribe</button>
                    </div>
                    <p></p>
                </div> */}
            </div>
            <div className="footer-row-2">
                <div style={{ display: 'flex' }}>
                    <SiMediamarkt style={{ fontSize: 20, margin: 1 }} />
                    <p> DriveEasy ©{new Date().getFullYear()}. All Rights Reserved.</p>
                </div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">Cars</Link>
                    </li>
                    <li>
                        <Link to="/booking">Booking</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Footer;
