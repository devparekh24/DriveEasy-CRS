import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarInfoPage from "./pages/CarInfoPage";
import Contact from "./pages/Contact";
// import CarDetails from "./pages/CarDetails"; 
import MyBookingPage from "./pages/MyBookingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MyProfile } from "./components/MyProfile/MyProfile";
import { useAppSelector } from "./hooks/hooks";
import { useEffect } from "react";

import HomeAdmin from './admin/components/Dashboard/HomeAdmin';
import Car from "./admin/components/Car/Car";
import OrdersComponent from "./admin/components/Order/Order";
import UsersComponent from "./admin/components/User/User";
import DamageReportingComponent from "./admin/components/DamageReport/DamageReport";
import LeafletMap from "./admin/components/Map/LeafletMap";
import PageNotFound from "./pages/PageNotFound";
import PageNotFoundOnAdmin from "./admin/pages/PageNotFoundOnAdmin";

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {

    const navigate = useNavigate()
    const isAuthenticated = useAppSelector(state => state.auth.isLoggedIn);
    const userId = useAppSelector(state => state.auth.userId)

    useEffect(() => {

        const checkAuthentication = async () => {
            try {
                const storedUserIdToken = await JSON.parse(localStorage.getItem('user')!).userId;
                if (storedUserIdToken && storedUserIdToken !== userId) { }

                else if (!isAuthenticated) {
                    toast.error('You have to Login First!', {
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            }
        }
        checkAuthentication();
    }, [isAuthenticated, userId])

    return isAuthenticated ? (
        <>{element}</>
    ) : (< Navigate to="/login" replace={true} />);
};

const AppRouting = () => {
    const isAdmin = useAppSelector(state => state.auth.isAdmin)
    console.log(isAdmin)
    return (
        <>
            <ToastContainer />
            <Routes>
                {isAdmin ?
                    (<>
                        <Route path='/' element={<Navigate to='/admin' replace={true} />} />
                        <Route path='/admin' element={<HomeAdmin />} />
                        <Route path='/cars' element={<Car />} />
                        <Route path='/orders' element={<OrdersComponent />} />
                        <Route path='/users' element={<UsersComponent />} />
                        <Route path='/damage-reports' element={<DamageReportingComponent />} />
                        <Route path='/maps' element={<LeafletMap />} />
                        <Route path='*' element={<PageNotFoundOnAdmin />} />
                    </>) :
                    (<>
                        <Route path="/" element={< Home />} />
                        <Route path="/cars" element={<ProtectedRoute element={< Cars />} />} />
                        <Route path="/booking" element={<ProtectedRoute element={< MyBookingPage />} />} />
                        <Route path="/cars/:id" element={<ProtectedRoute element={< CarInfoPage />} />} />
                        <Route path="/:type/:carName/:id" element={<ProtectedRoute element={< CarInfoPage />} />} />
                        <Route path="/contact" element={< Contact />} />
                        <Route path="/my-profile" element={<ProtectedRoute element={< MyProfile />} />} />
                        <Route path="/login" element={< Login />} />
                        <Route path="/signup" element={< Signup />} />
                        <Route path="/forgot-password" element={< ForgotPassword />} />
                        {/* <Route path="/cars/:carName/:id" element={<CarDetails />} /> */}
                        <Route path='*' element={<PageNotFound />} />
                    </>)}

            </Routes>

        </>
    );
};

export default AppRouting;
