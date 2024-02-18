import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Car } from '../../../slices/carSlice';
import { useRemoveCarMutation, useUpdateCarMutation } from '../../../services/carApi';
import AdminLoader from '../adminLoader/adminLoader';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';

interface Item {
    _id: string;
    carName: string;
    carType: string;
    companyName: string;
    mileage: number;
    year: string;
    capacity: number;
    color: string;
    availability: boolean;
    rentPrice: number;
    image: string;
    fule: string;
    transmission: string;
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
                        value: 'Automated Manual',
                        label: 'Automated Manual Transmission (AM)',
                    },
                    {
                        value: 'Continuously Variable',
                        label: 'Continuously Variable Transmission (CVT)',
                    },
                ]} />
            // <ImageUploader onUpload={(imgUrl) => form.setFieldsValue({ [dataIndex]: imgUrl })} />
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

    // console.log(data)

    const [removeCar, { isError: isErrorOnRemoveCar, isLoading: isLoadingOnRemoveCar, error: errorOnRemoveCar, isSuccess: isSuccessOnRemoveCar }] = useRemoveCarMutation()
    const [updateCar, { isError: isErrorOnUpdateCar, isLoading: isLoadingOnUpdateCar, isSuccess: isSuccessOnUpdateCar, error: errorOnUpdateCar }] = useUpdateCarMutation()

    const handleDelete = async (_id: string) => {
        try {
            if (_id) {
                await removeCar(_id).unwrap();
            }
            if (isErrorOnRemoveCar) throw errorOnRemoveCar
        }
        catch (error) {
            message.error(error?.data?.message);
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
            message.error(error?.data?.message);
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
            const updatedData = formData?.map((item: any) => (item._id === key ? { ...item, ...row } : item));

            setFormData(updatedData);
            setEditingKey('');
            // Call the update function here
            const updatedRow = { ...row, _id: key };
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
                    col.dataIndex === 'rentPrice' ||
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
            width: 80,
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
                message.success('Car Deleted Successfully!');
        }, 1500)
    }, [isSuccessOnRemoveCar])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnUpdateCar)
                message.success('Car Updated Successfully!');
        }, 1500)
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [isSuccessOnUpdateCar])

    return (
        <Form form={form} component={false}>
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
                        dataSource={tableData}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 1500, y: 460 }}
                    />
                )
            }
        </Form>
    )
}
export default CarTable;