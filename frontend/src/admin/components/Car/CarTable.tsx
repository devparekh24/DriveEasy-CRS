import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Input, InputNumber, Popconfirm, Select, Space, Table, Typography, message } from 'antd';
import type { DatePickerProps, TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Car } from '../../../slices/carSlice';
import { useRemoveCarMutation, useUpdateCarMutation } from '../../../services/carApi';
import AdminLoader from '../AdminLoader/AdminLoader';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
const { Search } = Input;
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

interface Item {
    _id: string;
    carName: string;
    companyName: string;
    mileage: number;
    year: string;
    capacity: number;
    color: string;
    availability: boolean;
    rentPricePerDay: number;
    rentPricePerHour: number;
    rentPricePerKm: number;
    carNumberPlate: string;
    image: string;
    fule: string;
    transmission: string;
    whenWillCarAvailable: string;
    editable: boolean;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'image';
    record: Item;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const [form] = Form.useForm();

    const onChange = (
        value: DatePickerProps['value'],
        dateString: string,
    ) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };

    const inputNode =
        inputType === 'number' ? (
            <InputNumber />
        ) : dataIndex === 'image' && editing ? (
            <ImageUploader onUpload={(imgUrl) => form.setFieldsValue({ [dataIndex]: imgUrl })} carId={record._id} />
        ) : dataIndex === 'fule' && editing ? (
            <Select showSearch
                placeholder="Select a fule type"
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
            // <ImageUploader onUpload={(imgUrl) => form.setFieldsValue({ [dataIndex]: imgUrl })} />
        ) : dataIndex === 'transmission' && editing ? (
            <Select showSearch
                placeholder="Select a transmission"
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
            // <ImageUploader onUpload={(imgUrl) => form.setFieldsValue({ [dataIndex]: imgUrl })} />
        ) : dataIndex === 'whenWillCarAvailable' && editing ? (
            <Form.Item>
                <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    onChange={onChange}
                />
            </Form.Item>
        ) : (
            <Input />
        );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : dataIndex === 'image' ? (
                <img src={record[dataIndex]} alt="img" style={{ width: '125px', }} />
            ) : (
                children
            )}
        </td>
    );
};


const CarTable = ({ headers, tableData }: { headers: string[]; tableData: Car[] }) => {

    const [form] = Form.useForm();
    let [formData, setFormData] = useState<Car[]>();
    const [editingKey, setEditingKey] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    // console.log(data)

    const [removeCar, { isError: isErrorOnRemoveCar, isLoading: isLoadingOnRemoveCar, error: errorOnRemoveCar, isSuccess: isSuccessOnRemoveCar }] = useRemoveCarMutation()
    const [updateCar, { isError: isErrorOnUpdateCar, isLoading: isLoadingOnUpdateCar, isSuccess: isSuccessOnUpdateCar, error: errorOnUpdateCar }] = useUpdateCarMutation()

    const handleSearch = (value: string) => {
        setSearchText(value);
    };
    const filteredData = tableData.filter((record) => {
        return headers.some((header) => record[header]?.toString().toLowerCase().includes(searchText.toLowerCase()));
    });

    const handleDelete = async (_id: string) => {
        try {
            if (_id) {
                await removeCar(_id).unwrap();
            }
            if (isErrorOnRemoveCar) throw errorOnRemoveCar
        }
        catch (error) {
            message.error(error?.data?.message, 2);
        }
    };

    const handleUpdate = async (record: Item) => {
        try {
            const updatedCar = await updateCar({ carId: record._id, updatedCar: record }).unwrap();
            // Update the table data with the new car information

            const updatedData = formData?.map((item: any) => (item._id === updatedCar._id ? updatedCar : item));
            setFormData(updatedData);
            setEditingKey('');
            setShouldRefresh(true);

            if (isErrorOnUpdateCar) throw errorOnUpdateCar
        } catch (error) {
            message.error(error?.data?.message, 2);
        }
    }

    const isEditing = (record: Item) => record._id === editingKey;

    const edit = (record: Partial<Item> & { _id: string }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = await (await form.validateFields()) as Item;
            // console.log(row.whenWillCarAvailable)
            // Convert the 'whenWillCarAvailable' date to a string format
            if (row.whenWillCarAvailable instanceof Date) {
                row.whenWillCarAvailable = dayjs(row.whenWillCarAvailable).format('YYYY-MM-DD');
            }

            const updatedData = formData?.map((item: any) => (item._id === key ? { ...item, ...row } : item));

            setFormData(updatedData);
            setEditingKey('');
            // Call the update function here
            const updatedRow = { ...row, _id: key, whenWillCarAvailable: row.whenWillCarAvailable };

            handleUpdate(updatedRow);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns: TableColumnsType<Item> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        sorter: (a: Car, b: Car) => {
            const aValue = a[header];
            const bValue = b[header];
            // Handle sorting based on the data type of the column
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            } else {
                return 0;
            }
        },
        sortDirections: ['ascend', 'descend'],
    }));

    const mergedColumns = columns.map((col) => {
        if (!col.editable || col.dataIndex === '_id') {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: (col.dataIndex === 'mileage' ||
                    col.dataIndex === 'capacity' ||
                    col.dataIndex === 'rentPricePerDay' ||
                    col.dataIndex === 'rentPricePerHour' ||
                    col.dataIndex === 'rentPricePerKm' ||
                    col.dataIndex === 'year') ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
            // Set 'left' for carName and image columns
            fixed: col.dataIndex === 'carName' || col.dataIndex === 'image' ? 'left' : undefined,
        };
    });

    // Add an additional column for Edit and Delete actions
    mergedColumns.push(
        {
            title: 'Action',
            key: 'action',
            fixed: 'right', // Fix the Action column to the right
            width: 75,
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record._id)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Are you sure to cancel? Your changes cannot be saved." onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <EditOutlined disabled={editingKey !== ''} onClick={() => edit(record)} color='primary' />
                        <Popconfirm
                            title="Delete the Car!"
                            description="Are you sure to delete?"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined disabled={editingKey !== ''} style={{ color: 'red' }} />
                        </Popconfirm>
                    </div>
                );
            },
        }
    );

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnRemoveCar)
                message.success('Car Deleted Successfully!', 2);
        }, 1500)
    }, [isSuccessOnRemoveCar])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnUpdateCar)
                message.success('Car Updated Successfully!', 2);
        }, 1500)
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [isSuccessOnUpdateCar])

    return (
        <Form form={form} component={false}>
            <Search
                placeholder="Search"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            {
                isLoadingOnRemoveCar || isLoadingOnUpdateCar ? (
                    <AdminLoader />
                ) : (
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={filteredData}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 2000, y: 460 }}
                    />
                )
            }
        </Form>
    )
}
export default CarTable;