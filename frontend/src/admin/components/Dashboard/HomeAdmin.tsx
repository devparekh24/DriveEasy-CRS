import { useEffect } from "react"
import { useGetAllCarsQuery } from "../../../services/carApi"
import DashBoardLayout from "../../pages/DashBoardLayout"
import CardCom from "./Card"
import './card.css'
import { message } from "antd"

const Home = () => {
    const { data, isError, error, isSuccess } = useGetAllCarsQuery()
    let totalCars: number = data?.resutls
    let totalOrders: number = data?.resutls
    let totalDamageReports: number = data?.resutls
    let totalUsers: number = data?.resutls

    const getDetails = async () => {
        try {
            if (isError) {
                throw error
            }
            await data
        }
        catch (error: any) {
            message.error(error.data.message)
        }
    }

    useEffect(() => {
        getDetails()
        if (isSuccess) console.log(data)
    }, [isSuccess, data])

    return (
        <DashBoardLayout>
            <div className="cards" >
                <CardCom title={"Total Cars"} totalQty={totalCars} />
                <CardCom title={"Total Orders"} totalQty={totalOrders} />
                <CardCom title={"Total Users"} totalQty={totalUsers} />
                <CardCom title={"Total Damage Reports"} totalQty={totalDamageReports} />
            </div>
        </DashBoardLayout>
    )
}

export default Home
