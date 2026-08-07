// @ts-nocheck
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import DashBoardLayout from '../../pages/DashBoardLayout';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import AdminLoader from '../AdminLoader/AdminLoader';
import ContactQueryTable from './ContactQueryTable';
import { useGetAllContactQueriesQuery } from '../../../services/contactQueryApi';
import { ContactQueryState, setContactQueries } from '../../../slices/contactQuerySlice';

const ContactQuery = () => {
    const { data, isError, isLoading, error, isSuccess } = useGetAllContactQueriesQuery();
    const dispatch = useAppDispatch();
    const contactQueriesList = useAppSelector(state => state.contactQuery.contactQueries)

    const [headers, setHeaders] = useState<string[]>([])
    const [tableData, setTableData] = useState<ContactQueryState[]>([]);

    const contactQueryData = async () => {
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
    }, [contactQueriesList,])

    useEffect(() => {
        contactQueryData()
        if (isSuccess) {
            setTableData(Object.values(data?.data)[0]!)
            dispatch(setContactQueries(data?.data))
        }

    }, [dispatch, isSuccess, data])
    return (
        <DashBoardLayout>
            <div className="modal-btn" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h2>Contact List</h2>
            </div>
            {isLoading ? (<AdminLoader />) : (
                <ContactQueryTable headers={headers} tableData={tableData} />
            )}
        </DashBoardLayout>

    );
};

export default ContactQuery;
