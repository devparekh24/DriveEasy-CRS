import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLoader from '../adminLoader/adminLoader';
import { Order, OrderState } from '../../../slices/orderSlice';
import { useRemoveOrderMutation, useUpdateOrderMutation } from '../../../services/orderApi';
const { Search } = Input;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'number' | 'text';
    record: Order;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
}) => {
    const inputNode =
        inputType === 'number' ? (
            <InputNumber />
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
            ) : (
                children
            )}
        </td>
    );
};


const OrderTable = ({ headers, tableData }: { headers: string[]; tableData: OrderState[] }) => {

    const [form] = Form.useForm();
    let [formData, setFormData] = useState<Order[]>();
    const [editingKey, setEditingKey] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    // console.log(data)

    const [removeOrder, { isError: isErrorOnRemoveOrder, isLoading: isLoadingOnRemoveOrder, error: errorOnRemoveOrder, isSuccess: isSuccessOnRemoveOrder }] = useRemoveOrderMutation()
    const [updateOrder, { isError: isErrorOnUpdateOrder, isLoading: isLoadingOnUpdateOrder, isSuccess: isSuccessOnUpdateOrder, error: errorOnUpdateOrder }] = useUpdateOrderMutation()

    const handleSearch = (value: string) => {
        setSearchText(value);
    };
    const filteredData = tableData.filter((record) => {
        return headers.some((header) => record[header].toString().toLowerCase().includes(searchText.toLowerCase()));
    });

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

    const handleUpdate = async (record: Order) => {
        try {
            const updatedOrder = await updateOrder({ orderId: record._id, updatedOrder: record }).unwrap();
            // Update the table data with the new car information

            const updatedData = formData?.map((item: any) => (item._id === updatedOrder._id ? updatedOrder : item));
            setFormData(updatedData);
            setEditingKey('');
            setShouldRefresh(true);

            if (isErrorOnUpdateOrder) throw errorOnUpdateOrder
        } catch (error) {
            message.error(error?.data?.message);
        }
    }

    const isEditing = (record: Order) => record._id === editingKey;

    const edit = (record: Partial<Order> & { _id: string }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: string) => {
        try {
            const row = await (await form.validateFields()) as Order;
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

    const columns: TableColumnsType<Order> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        sorter: (a: Order, b: Order) => {
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
        if (!col.editable || col.dataIndex === '_id' || col.dataIndex === 'user' || col.dataIndex === 'car') {
            return col;
        }
        return {
            ...col,
            onCell: (record: Order) => ({
                record,
                inputType: (col.dataIndex === 'totalAmount') ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
            fixed: col.dataIndex === 'fullName' || col.dataIndex === 'emailAddress' ? 'left' : undefined,
        };
    });

    // Add an additional column for Edit and Delete actions
    mergedColumns.push(
        {
            title: 'Action',
            key: 'action',
            fixed: 'right', // Fix the Action column to the right
            width: 75,
            render: (_: any, record: Order) => {
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
                            title="Delete the Order!"
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
            if (isSuccessOnRemoveOrder)
                message.success('Order Deleted Successfully!');
        }, 1500)
    }, [isSuccessOnRemoveOrder])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnUpdateOrder)
                message.success('Order Updated Successfully!');
        }, 1500)
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [isSuccessOnUpdateOrder])

    return (
        <Form form={form} component={false}>
            <Search
                placeholder="Search"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            {
                isLoadingOnRemoveOrder || isLoadingOnUpdateOrder ? (
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
                        scroll={{ x: 1900, y: 460 }}
                    />
                )
            }
        </Form>
    )
}
export default OrderTable;