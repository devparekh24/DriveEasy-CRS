import { useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout, setUserLogin } from "../../slices/authSlice";
import Avatar from '@mui/material/Avatar';
import { SiMediamarkt } from "react-icons/si";
import { useGetUserMutation } from "../../services/userApi";
import { message } from "antd";
import { setUsers } from "../../slices/userSlice";

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const isLogin = useAppSelector(state => state.auth.isLoggedIn);
    // const authUser = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();
    // const storedUser = localStorage.getItem('user');

    const [getUser, { data, isError, error, isSuccess }] = useGetUserMutation()
    const getCurrentUser = async () => {
        const userId = JSON.parse(localStorage.getItem('user')!).userId

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
    }, [isLogin])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccess) {
                dispatch(setUsers(data!.data))
            }
        }, 1500)

    }, [dispatch, isSuccess, data])

    let loginUser = useAppSelector(state => state.user.users);
    console.log(loginUser)
    // const sr = JSON.parse(localStorage.getItem('user')!);
    // console.log(sr.user)

    // const user = Object.keys(loginUser).map(key => ({ id: Number(key), name: loginUser[key] }))
    // console.log(Array.isArray(user))

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
        }
    };

    useEffect(() => {
        setTimeout(() => {

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log(user)
                dispatch(setUserLogin({ name: user.name, token: user.token, role: user.role, userId: user.userId, user: loginUser! }));
            }
        }, 1500)
    }, [dispatch, setUserLogin]);
    
    const handleLogout = () => {
        dispatch(logout())
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
                                <NavLink to="/login" onClick={handleLogout}>Logout</NavLink>
                                <Link to="/my-profile">
                                    <Avatar src={loginUser.data?.image} />
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
