import DashBoardLayout from "../pages/DashBoardLayout"
import CardCom from "./Card"
import './card.css'
const Home = () => {
    return (
        <DashBoardLayout>
            <div className="cards" >
                <CardCom title={"Total Cars"} />
                <CardCom title={"Total Orders"} />
                <CardCom title={"Total Users"} />
                <CardCom title={"Total Damage Reports"} />
            </div>
        </DashBoardLayout>
    )
}

export default Home
