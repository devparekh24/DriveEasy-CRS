import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { useGetAllUsersQuery } from '../../../services/userApi';
import { UserState, setUsers } from '../../../slices/userSlice';
import DashBoardLayout from '../../pages/DashBoardLayout';
import UserTable from './UserTable';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import AdminLoader from '../AdminLoader/AdminLoader';

const UsersComponent = () => {
    const { data, isError, isLoading, error, isSuccess } = useGetAllUsersQuery();
    const dispatch = useAppDispatch();
    const usersList = useAppSelector(state => state.user.users)

    const [headers, setHeaders] = useState<string[]>([])
    const [tableData, setTableData] = useState<UserState[]>([]);

    const userData = async () => {
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


    const getHeaders = async () => {
        const columns = await Object.keys(data!.data.data[0]!);
        const sortedHeaders = columns
            .filter((header) => (header !== 'name' && header !== '__v' && header !== 'id' && header !== '_id'))
            .sort(); // Sort headers alphabetically

        const finalHeaders = ['name', ...sortedHeaders];
        setHeaders(finalHeaders);
    }


    useEffect(() => {
        getHeaders()
    }, [usersList])

    useEffect(() => {
        userData()
        if (isSuccess) {
            setTableData(Object.values(data?.data)[0]!)
            dispatch(setUsers(data?.data))
        }

    }, [dispatch, isSuccess, data])
    return (
        <DashBoardLayout>
            <div className="modal-btn" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h2>Users List</h2>
            </div>
            {isLoading ? (<AdminLoader />) : (
                <UserTable headers={headers} tableData={tableData} />
            )}
        </DashBoardLayout>

    );
};

export default UsersComponent;
