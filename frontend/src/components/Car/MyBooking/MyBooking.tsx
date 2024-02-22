import { useGetUserOrdersQuery, useRemoveOrderMutation } from "../../../services/orderApi";
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import { Form, Popconfirm, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, } from '@ant-design/icons';
import { BookingState, setBookingData } from "../../../slices/bookingSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import AdminLoader from "../../../admin/components/AdminLoader/AdminLoader";

const MyBookingTable = ({ headers, tableData }: { headers: string[]; tableData: BookingState[] }) => {


  const [removeOrder, { isError: isErrorOnRemoveOrder, isLoading: isLoadingOnRemoveOrder, error: errorOnRemoveOrder, isSuccess: isSuccessOnRemoveOrder }] = useRemoveOrderMutation()

  const handleDelete = async (_id: string) => {
    try {
      if (_id) {
        await removeOrder(_id).unwrap();
      }
      if (isErrorOnRemoveOrder) throw errorOnRemoveOrder
    }
    catch (error) {
      message.error(error?.data?.message);
    }
  };

  const columns: TableColumnsType<BookingState> = headers.map((header: any) => ({
    title: header,
    dataIndex: header,
    key: header,
  }));

  const mergedColumns = columns.map((col) => col);

  // Add an additional column for Delete actions
  mergedColumns.push(
    {
      title: 'Delete',
      key: 'delete',
      fixed: 'right', // Fix the Action column to the right
      width: 80,
      render: (_: any, record: BookingState) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Popconfirm
              title="Delete the booking!"
              description="Are you sure to delete?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: 'red' }} />
            </Popconfirm>
          </div>
        );
      },
    }
  );

  useEffect(() => {
    setTimeout(() => {
      if (isSuccessOnRemoveOrder)
        message.success('Order Deleted Successfully!');
    }, 1500)
  }, [isSuccessOnRemoveOrder])

  return (
    <Form component={false}>
      {
        isLoadingOnRemoveOrder ? (
          <AdminLoader />
        ) : (
          <Table
            bordered
            dataSource={tableData}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1550, y: 460 }}
          />
        )
      }
    </Form>
  )
}

const MyBooking = () => {

  const { data, isLoading, isError, error, isSuccess } = useGetUserOrdersQuery()
  const [headers, setHeaders] = useState<string[]>([])
  const [tableData, setTableData] = useState<BookingState[]>([]);
  const bookingList = useAppSelector(state => state.booking.bookings)
  const dispatch = useAppDispatch()

  const getUserOrders = async () => {
    try {
      if (isError) {
        throw error
      }
      await data
    }
    catch (error: any) {
      toast.error(error?.data?.message, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const getHeaders = async () => {
    const columns = await Object.keys(bookingList[0]!);
    const sortedHeaders = columns.filter((header) => (header !== '_id' && header !== 'car' && header !== 'user' && header !== '__v'))
    const finalHeaders = [...sortedHeaders];
    setHeaders(finalHeaders);
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  useEffect(() => {
    getHeaders()
  }, [bookingList])

  useEffect(() => {
    if (isSuccess) {
      const ordersData = data?.data?.orders || [];
      setTableData(ordersData);
      dispatch(setBookingData({ data: ordersData }));
    }
  }, [isSuccess, dispatch, data])

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          < div className="cars-showcase" >
            <div className="list-row">
              {
                tableData.length > 0 ? (
                  <MyBookingTable headers={headers} tableData={tableData} />
                ) : (
                  <h3>You haven't booked any car, yet!</h3>
                )
              }
            </div >
          </div >
        )
      }
    </>
  )
}

export default MyBooking
