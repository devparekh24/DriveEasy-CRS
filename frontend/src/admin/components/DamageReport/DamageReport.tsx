import { FC, useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import DashBoardLayout from '../../pages/DashBoardLayout';
// import TableList from './TableList';

// interface DamageReport {
//     id: number;
//     location: string;
//     description: string;
// }

const App: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const onFinish = (values: any) => {
        // Perform CRUD operation (e.g., send data to server)
        console.log('Form values:', values);
        console.log('Uploaded files:', fileList);
        message.success('Damage Report submitted successfully!');
        form.resetFields();
        setFileList([]);
    };

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
    // const [form] = Form.useForm();
    // const [damageReports, setDamageReports] = useState<DamageReport[]>([]);

    // const onFinish = (values: any) => {
    //     const newDamageReport: DamageReport = {
    //         id: idCounter,
    //         location: values.location,
    //         description: values.description,
    //     };

    //     setDamageReports([...damageReports, newDamageReport]);
    //     setIdCounter(idCounter + 1);

    //     message.success('Damage report submitted successfully!');
    //     form.resetFields();
    // };

    return (
        <DashBoardLayout>
            <App />
            {/* <TableList /> */}
        </DashBoardLayout>
    );
};

export default DamageReportingComponent;
