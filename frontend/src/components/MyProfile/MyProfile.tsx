import { MyProfileComponent } from "./MyProfileComponent"
import './MyProfile.css'
import { useEffect } from "react";

export const MyProfile = () => {

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <MyProfileComponent />
        </div>
    )
}
