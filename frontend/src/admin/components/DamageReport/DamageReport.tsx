import { FC, useEffect, useState } from 'react';
import { Form, Input, Button, message, Modal, Select } from 'antd';
import DashBoardLayout from '../../pages/DashBoardLayout';
import { useAddDamageReportMutation, useGetAllDamageReportsQuery } from '../../../services/damageReportApi';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { DamageReportState, setDamageReports } from '../../../slices/damageReportSlice';
import AdminLoader from '../adminLoader/adminLoader';
import DamageReportTable from './DamageReportTable';
import { useGetAllCarsQuery } from '../../../services/carApi';
import { useGetAllUsersQuery } from '../../../services/userApi';
import { setCars } from '../../../slices/carSlice';
import { setUsers } from '../../../slices/userSlice';

const AddDamageReportModal: FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addDamageReport, { data: addDamageReportData, isError: isErrorOnAddDamageReport, isSuccess: isSuccessOnAddDamageReport, error: errorOnAddDamageReport }] = useAddDamageReportMutation()
    const dispatch = useAppDispatch()
    const { data: carsData, isError: isErrorOnGetAllCars, isSuccess: isSuccessOnGetAllCars, error: errorOnGetAllCars } = useGetAllCarsQuery();
    const { data: usersData, isError: isErrorOnGetAllUsers, isSuccess: isSuccessOnGetAllUsers, error: errorOnGetAllUsers } = useGetAllUsersQuery();
    const carsList = useAppSelector(state => state.car.cars)
    const usersList = useAppSelector(state => state.user.users)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const onFinish = async (values: any) => {
        // Perform CRUD operation (e.g., send data to server)
        console.log('Form values:', values);

        try {
            if (values) {
                await addDamageReport(values).unwrap();
            }
            if (isErrorOnAddDamageReport) throw errorOnAddDamageReport
        } catch (error) {
            message.error(error?.data?.message);
        }
        console.log('Uploaded files:', fileList);
        form.resetFields();
        setFileList([]);
    };

    const getData = async () => {
        try {
            if (isErrorOnGetAllCars || isErrorOnGetAllUsers) {
                throw (errorOnGetAllCars || errorOnGetAllUsers)
            }
            await (carsData || usersData)
        }
        catch (error: any) {
            message.error(error.data.message)
        }
    }


    useEffect(() => {
        getData()
        if (isSuccessOnGetAllCars || isSuccessOnGetAllUsers) {
            // console.log()
            dispatch(setCars(carsData!.data))
            dispatch(setUsers(usersData!.data))
        }

    }, [dispatch, isSuccessOnGetAllCars, isSuccessOnGetAllUsers, carsData, usersData])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnAddDamageReport) {
                console.log(addDamageReportData)
                message.success('Damage Report submitted successfully!');
            }
        }, 2000)
    }, [isSuccessOnAddDamageReport])

    return (
        <>
            <div className="modal-btn" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h2>Damage Reports</h2>
                <Button type="primary" onClick={showModal} >Add Damage Report</Button>
            </div>
            <Modal title="Damage Report Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={750}>
                <Form form={form} onFinish={onFinish} layout="vertical">

                    <Form.Item label="Select Car" name="car" rules={[{ required: true, message: 'Please select a car' }]}>
                        <Select placeholder="Select a car">
                            {
                                isSuccessOnGetAllCars && Array.isArray(carsList) ? (
                                    carsList.map((car) => (
                                        <Select.Option key={car._id} value={car._id}>
                                            {car.carName}
                                        </Select.Option>
                                    ))
                                ) : (<AdminLoader />)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Select User" name="user" rules={[{ required: true, message: 'Please select a user' }]}>
                        <Select placeholder="Select a user">
                            {
                                isSuccessOnGetAllUsers && Array.isArray(usersList) ? (
                                    usersList?.map((user) => (
                                        <Select.Option key={user._id} value={user._id}>
                                            {user.name} - {user.email}
                                        </Select.Option>
                                    ))
                                ) : (<AdminLoader />)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter the location' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter the damage description' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Damage Report
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};


const DamageReportingComponent = () => {

    const { data, isError, isLoading, error, isSuccess } = useGetAllDamageReportsQuery();
    const dispatch = useAppDispatch();
    const damageReportsList = useAppSelector(state => state.damageReport.damageReports)
    console.log(damageReportsList)

    const [headers, setHeaders] = useState<string[]>([])
    const [tableData, setTableData] = useState<DamageReportState[]>([]);

    const damageReportsData = async () => {
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
        // console.log(damageReportsList.data.data)
        const columns = await Object.keys(data!.data!.data[0]!);
        const sortedHeaders = columns
            .filter((header) => (header !== '_id' && header !== 'description' && header !== 'id'))
            .sort(); // Sort headers alphabetically

        const finalHeaders = ['description', ...sortedHeaders];
        setHeaders(finalHeaders);
    }


    useEffect(() => {
        getHeaders()
    }, [damageReportsList])

    useEffect(() => {
        damageReportsData()
        if (isSuccess) {
            setTableData(Object.values(data?.data)[0]!)
            // console.log()
            dispatch(setDamageReports({ data: data }))
        }

    }, [dispatch, isSuccess, data])
    return (
        <DashBoardLayout>
            <AddDamageReportModal />
            {isLoading ? (<AdminLoader />) : (
                <DamageReportTable headers={headers} tableData={tableData} />
            )}
        </DashBoardLayout>
    );
};

export default DamageReportingComponent;
