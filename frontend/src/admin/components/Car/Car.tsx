// CarComponent.tsx
import './car.css'
import { FC, useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, InputNumber, Select, ColorPicker, Modal, Space, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DashBoardLayout from '../../pages/DashBoardLayout';
import CarTable from './CarTable';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { useAddCarMutation, useGetAllCarsQuery } from '../../../services/carApi';
import { Car as CarState, setCars } from '../../../slices/carSlice';
import { toast } from 'react-toastify';
import AdminLoader from '../adminLoader/adminLoader';
import type { GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};

const AddCarModal: FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addCar, { data: addCarData, isError: isErrorOnAddCar, isSuccess: isSuccessOnAddCar, error: errorOnAddCar }] = useAddCarMutation()

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
        // values.carImage = fileList[0].thumbUrl
        console.log('Form values:', values);
        try {
            if (values) {
                await addCar(values).unwrap();
            }
            if (isErrorOnAddCar) throw errorOnAddCar
        } catch (error) {
            message.error(error?.data?.message);
        }

        console.log('Uploaded files:', fileList);

        form.resetFields();
        setFileList([]);
    };

    const onFileChange = ({ fileList }: any) => {
        console.log(fileList)
        setFileList(fileList);
    };

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    // const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    //     console.log(date, dateString);
    // };

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnAddCar) {
                console.log(addCarData)
                message.success('Car details submitted successfully!');
            }
        }, 2000)
    }, [isSuccessOnAddCar])

    return (
        <>
            <div className="modal-btn" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h2>Cars List</h2>
                <Button type="primary" onClick={showModal} >Add Car</Button>
            </div>
            <Modal title="Car Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={750} >
                <div className="form-container" style={{ padding: 18, borderRadius: 10 }}>
                    <Form form={form} onFinish={onFinish} layout="vertical" >

                        <Form.Item label="Car Name" name="carName" rules={[{ required: true, message: 'Please enter the car name' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Company Name / Brand Name" name="companyName" rules={[{ required: true, message: "Please enter the car's company name" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Car Number Plate" name="carNumberPlate" rules={[{ required: true, message: "Please enter the car's number plate" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="When Will Car Available?" name="whenWillCarAvailable" rules={[{ required: true, message: "Please enter that when will car available" }]}>
                            <DatePicker
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                            />
                        </Form.Item>

                        <Form.Item label="Year" name="year" rules={[{ required: true, message: "Please enter the car's manufacturing year" }]}>
                            {/* <Space direction="vertical">
                                <DatePicker onChange={onDateChange} picker="year" />
                            </Space> */}
                            <InputNumber type='number' min={new Date().getFullYear() - 50} max={new Date().getFullYear() + 10} defaultValue={new Date().getFullYear()} />
                        </Form.Item>

                        <Form.Item label="Rent Price Per Day" name="rentPricePerDay" rules={[{ required: true, message: 'Please enter the rent price per day of car' }]}>
                            <InputNumber type='number' min={0} />
                        </Form.Item>

                        <Form.Item label="Rent Price Per Hour" name="rentPricePerHour" rules={[{ required: true, message: 'Please enter the rent price per hour of car' }]}>
                            <InputNumber type='number' min={0} />
                        </Form.Item>

                        <Form.Item label="Rent Price Per Km" name="rentPricePerKm" rules={[{ required: true, message: 'Please enter the rent price per km of car' }]}>
                            <InputNumber type='number' min={0} />
                        </Form.Item>

                        <Form.Item label="Mileage (in Kmpl)" name="mileage" rules={[{ required: true, message: 'Please enter the car mileage' }]}>
                            <InputNumber type='number' min={0} />
                        </Form.Item>

                        <Form.Item label="Transmission" name="transmission" rules={[{ required: true, message: 'Please enter the car transmission' }]}>
                            <Select showSearch
                                placeholder="Select a transmission"
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
                                        value: 'AM',
                                        label: 'Automated Manual Transmission (AM)',
                                    },
                                    {
                                        value: 'CV',
                                        label: 'Continuously Variable Transmission (CVT)',
                                    },
                                ]} />
                        </Form.Item>

                        <Form.Item label="Seating Capacity" name="capacity" rules={[{ required: true, message: 'Please enter the seating capacity of car' }]}>
                            <InputNumber type='number' min={0} max={15} />
                        </Form.Item>

                        <Form.Item label="Color" name="color" >
                            <ColorPicker allowClear />
                        </Form.Item>

                        <Form.Item label="Fule Type" name="fuleType" rules={[{ required: true, message: 'Please enter the fule Type of car' }]}>
                            <Select showSearch
                                placeholder="Select a fule type"
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

                        <Form.Item label="Car Image" name="carImage" valuePropName="fileList" getValueFromEvent={onFileChange}>
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
                </div>
            </Modal>
        </>
    );
};


const Car: FC = () => {
    const { data, isError, isLoading, error, isSuccess } = useGetAllCarsQuery();
    const dispatch = useAppDispatch();
    const carsList = useAppSelector(state => state.car.cars)
    // console.log(carsList)
    const [headers, setHeaders] = useState<string[]>([])
    const [tableData, setTableData] = useState<CarState[]>([]);

    const carData = async () => {
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
        const columns = await Object.keys(carsList[0]!);
        const sortedHeaders = columns
            .filter((header) => (header !== '_id' && header !== 'carName' && header !== 'image' && header !== 'availability'))
            .sort(); // Sort headers alphabetically

        const finalHeaders = ['carName', 'image', ...sortedHeaders];
        setHeaders(finalHeaders);
    }


    useEffect(() => {
        getHeaders()
    }, [carsList])

    useEffect(() => {
        carData()
        if (isSuccess) {
            setTableData(Object.values(data?.data)[0]!)
            // console.log()
            dispatch(setCars(data?.data))
        }

    }, [dispatch, isSuccess, data])

    return (
        <DashBoardLayout>
            <AddCarModal />
            {isLoading ? (<AdminLoader />) : (
                <CarTable headers={headers} tableData={tableData} />
            )}
        </DashBoardLayout>
    );
};

export default Car;