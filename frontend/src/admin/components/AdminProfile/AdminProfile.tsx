import { MyProfile } from "../../../components/MyProfile/MyProfile"
import DashBoardLayout from "../../pages/DashBoardLayout"
import './AdminProfile.css'

const AdminProfile = () => {
    return (
        <DashBoardLayout>
            <div className="admin-profile">
                <MyProfile />
            </div>
        </DashBoardLayout>
    )
}

export default AdminProfile
