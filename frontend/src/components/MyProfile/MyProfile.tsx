import CommonHeader from "../CommonHeader/CommonHeader"
import { MyProfileComponent } from "./MyProfileComponent"

export const MyProfile = () => {
    return (
        <div>
            <CommonHeader heading={'My Profile'} />
            <MyProfileComponent />
        </div>
    )
}