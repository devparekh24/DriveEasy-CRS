// OrdersComponent.tsx
import { useEffect, useState } from 'react';
import DashBoardLayout from '../../pages/DashBoardLayout';
import { useGetAllOrdersQuery } from '../../../services/orderApi';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { OrderState, setOrders } from '../../../slices/orderSlice';
import { toast } from 'react-toastify';
import OrderTable from './OrderTable';
import AdminLoader from '../AdminLoader/AdminLoader';

const OrdersComponent = () => {

    const { data, isError, isLoading, error, isSuccess } = useGetAllOrdersQuery();
    const dispatch = useAppDispatch();
    const ordersList = useAppSelector(state => state.order.orders)

    const [headers, setHeaders] = useState<string[]>([])
    const [tableData, setTableData] = useState<OrderState[]>([]);

    const orderData = async () => {
        try {
            if (isError) {
                throw error
            }
            await data
        }
        catch (error: any) {
            toast.error(error.data.message, {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }


    const getHeaders = async () => {
        const columns = await Object.keys(data!.data.data[0]!);
        const sortedHeaders = columns
            .filter((header) => (header !== 'fullName' && header !== 'emailAddress' && header !== '__v' && header !== '_id'))
        // .sort(); // Sort headers alphabetically

        const finalHeaders = ['fullName', 'emailAddress', ...sortedHeaders];
        setHeaders(finalHeaders);
    }


    useEffect(() => {
        getHeaders()
    }, [ordersList])

    useEffect(() => {
        orderData()
        if (isSuccess) {
            console.log(data)
            setTableData(Object.values(data?.data)[0]!)
            // console.log()
            dispatch(setOrders(data?.data))
        }

    }, [dispatch, isSuccess, data])

    return (
        <DashBoardLayout>
            <div className="modal-btn" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h2>Orders List</h2>
            </div>
            {isLoading ? (<AdminLoader />) : (
                <OrderTable headers={headers} tableData={tableData} />
            )}
        </DashBoardLayout>
    );
};

export default OrdersComponent;
