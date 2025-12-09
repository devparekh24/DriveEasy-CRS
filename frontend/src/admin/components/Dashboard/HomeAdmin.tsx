// @ts-nocheck
import { useEffect } from "react"
import { useGetAllCarsQuery } from "../../../services/carApi"
import DashBoardLayout from "../../pages/DashBoardLayout"
import CardCom from "./Card"
import './card.css'
import { message } from "antd"
import { useGetAllUsersQuery } from "../../../services/userApi"
import { useGetAllOrdersQuery } from "../../../services/orderApi"
import { useGetAllDamageReportsQuery } from "../../../services/damageReportApi"

const Home = () => {
    const { data: carData, isError: isErrorOnCar, error: errorOnCar, isSuccess: isSuccessOnCar } = useGetAllCarsQuery()
    const { data: userData, isError: isErrorOnUser, error: errorOnUser, isSuccess: isSuccessOnUser } = useGetAllUsersQuery()
    const { data: orderData, isError: isErrorOnOrder, error: errorOnOrder, isSuccess: isSuccessOnOrder } = useGetAllOrdersQuery()
    const { data: damageReportData, isError: isErrorOnDamageReport, error: errorOnDamageReport, isSuccess: isSuccessOnDamageReport } = useGetAllDamageReportsQuery()

    let totalCars: number = carData?.resutls
    let totalUsers: number = userData?.resutls
    let totalOrders: number = orderData?.resutls
    let totalDamageReports: number = damageReportData?.resutls

    const getDetails = async () => {
        try {
            if (isErrorOnCar || isErrorOnUser || isErrorOnOrder || isErrorOnDamageReport) {
                throw (errorOnCar || errorOnUser || errorOnOrder || errorOnDamageReport)
            }
            await carData
            await userData
            await orderData
            await damageReportData
        }
        catch (error: any) {
            message.error(error.data.message)
        }
    }
    useEffect(() => {
        getDetails()
    }, [])

    useEffect(() => {
        if (isSuccessOnCar || isSuccessOnUser || isSuccessOnOrder || isSuccessOnDamageReport) console.log(carData, userData, orderData, damageReportData)
    }, [isSuccessOnCar, carData, isSuccessOnUser, userData, isSuccessOnOrder, orderData, isSuccessOnDamageReport, damageReportData])

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
