import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
// import CarDetails from "./pages/CarDetails"; 
import CarType from "./pages/CarType";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRouting = () => {
    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path="/" element={< Home />} />
                <Route path="/cars" element={< Cars />} />
                <Route path="/:type" element={< CarType />} />
                <Route path="/cars/:carName/:id" element={< Booking />} />
                <Route path="/:type/:carName/:id" element={< Booking />} />
                <Route path="/contact" element={< Contact />} />
                <Route path="/login" element={< Login />} />
                <Route path="/signup" element={< Signup />} />
                <Route path="/forgot-password" element={< ForgotPassword />} />
                {/* <Route path="/cars/:carName/:id" element={<CarDetails />} /> */}
            </Routes>

        </>
    );
};

export default AppRouting;
