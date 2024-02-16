import { FC, useEffect, useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import DashBoardLayout from '../../pages/DashBoardLayout';
import { useAddDamageReportMutation, useGetAllDamageReportsQuery } from '../../../services/damageReportApi';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { DamageReportState, setDamageReports } from '../../../slices/damageReportSlice';
import { toast } from 'react-toastify';
import AdminLoader from '../adminLoader/adminLoader';
import DamageReportTable from './DamageReportTable';

const AddDamageReportModal: FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addDamageReport, { data: addDamageReportData, isError: isErrorOnAddDamageReport, isSuccess: isSuccessOnAddDamageReport, error: errorOnAddDamageReport }] = useAddDamageReportMutation()

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
        const columns = await Object.keys(damageReportsList[0]!);
        const sortedHeaders = columns
            .filter((header) => (header !== '_id' && header !== 'message' && header !== 'id'))
            .sort(); // Sort headers alphabetically

        const finalHeaders = ['message', ...sortedHeaders];
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
            dispatch(setDamageReports(data?.data))
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
