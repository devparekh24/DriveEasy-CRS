// UsersComponent.tsx
import { FC, useState } from 'react';
import { Form, Input, Button, Upload, message, InputNumber, Select, ColorPicker, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DashBoardLayout from '../../pages/DashBoardLayout';
// import TableList from '../TableList';

// interface User {
//     id: number;
//     name: string;
//     email: string;
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
        message.success('Car details submitted successfully!');
        form.resetFields();
        setFileList([]);
    };

    const onFileChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


    return (
        <>
            <div className="modal-btn" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h2>Users List</h2>
                <Button type="primary" onClick={showModal} >Add Car</Button>
            </div>
            <Modal title="Car Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={750}>
                <Form form={form} onFinish={onFinish} layout="vertical">

                    <Form.Item label="Car Name" name="carName" rules={[{ required: true, message: 'Please enter the car name' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: "Please enter the car's company name" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Year" name="year" rules={[{ required: true, message: "Please enter the car's manufacturing year" }]}>
                        <InputNumber type='number' min={new Date().getFullYear() - 50} max={new Date().getFullYear() + 10} defaultValue={new Date().getFullYear()} />
                    </Form.Item>

                    <Form.Item label="Rent Price" name="rentPrice" rules={[{ required: true, message: 'Please enter the rent price of car' }]}>
                        <InputNumber type='number' min={0} />
                    </Form.Item>

                    <Form.Item label="Mileage (in Kmpl)" name="mileage" rules={[{ required: true, message: 'Please enter the car mileage' }]}>
                        <InputNumber type='number' min={0} />
                    </Form.Item>

                    <Form.Item label="Transmission" name="transmission" rules={[{ required: true, message: 'Please enter the car transmission' }]}>
                        <Select showSearch
                            placeholder="Select a transmission"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'Manual',
                                    label: 'Manual Transmission (MT)',
                                },
                                {
                                    value: 'Automatic',
                                    label: 'Automatic Transmission (AT)',
                                },
                                {
                                    value: 'Automated Manual ',
                                    label: 'Automated Manual Transmission (AM)',
                                },
                                {
                                    value: 'Continuously Variable',
                                    label: 'Continuously Variable Transmission (CVT)',
                                },
                            ]} />
                    </Form.Item>

                    <Form.Item label="Seating Capacity" name="capacity" rules={[{ required: true, message: 'Please enter the seating capacity of car' }]}>
                        <InputNumber type='number' min={0} max={15} />
                    </Form.Item>

                    <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please enter the car color' }]}>
                        <ColorPicker allowClear />
                    </Form.Item>

                    <Form.Item label="Fule Type" name="fuleType" rules={[{ required: true, message: 'Please enter the fule Type of car' }]}>
                        <Select showSearch
                            placeholder="Select a fule type"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'Petrol',
                                    label: 'Petrol',
                                },
                                {
                                    value: 'Diesel',
                                    label: 'Diesel',
                                },
                                {
                                    value: 'CNG',
                                    label: 'CNG',
                                },
                                {
                                    value: 'EV',
                                    label: 'EV',
                                }
                            ]} />
                    </Form.Item>

                    <Form.Item label="Car Image" name="carImage" valuePropName="fileList" getValueFromEvent={onFileChange} rules={[{ required: true, message: 'Please upload the car image' }]}>
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            showUploadList={{ showRemoveIcon: true }}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};


const UsersComponent = () => {
    // // Static list of users (replace with actual data fetched from a server)
    // const users: User[] = [
    //     { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    //     { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    //     // Add more users as needed
    // ];

    return (
        <DashBoardLayout>
            <App />
            {/* <TableList /> */}
        </DashBoardLayout>

    );
};

export default UsersComponent;
