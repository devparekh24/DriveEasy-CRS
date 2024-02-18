import React, { useState, useEffect } from 'react';
import { Form, Input, Popconfirm, Select, Table, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLoader from '../adminLoader/adminLoader';
import { ContactQuery, ContactQueryState } from '../../../slices/contactQuerySlice';
import { useRemoveContactQueryMutation, useUpdateContactQueryMutation } from '../../../services/contactQueryApi';
const { Search } = Input;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'text';
    record: ContactQuery;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    children,
    ...restProps
}) => {
    // const [form] = Form.useForm();
    const inputNode =
        dataIndex === 'meeting' && editing ? (
            <Select showSearch
                placeholder="Select Status"
                options={[
                    {
                        value: 'pending',
                        label: 'Pending',
                    },
                    {
                        value: 'Done',
                        label: 'Done',
                    }
                ]} />
        ) : (<Input />);

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


const ContactQueryTable = ({ headers, tableData }: { headers: string[]; tableData: ContactQueryState[] }) => {

    const [form] = Form.useForm();
    let [formData, setFormData] = useState<ContactQuery[]>();
    const [editingKey, setEditingKey] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    // console.log(data)

    const [removeContactQuery, { isError: isErrorOnRemoveContactQuery, isLoading: isLoadingOnRemoveContactQuery, error: errorOnRemoveContactQuery, isSuccess: isSuccessOnRemoveContactQuery }] = useRemoveContactQueryMutation()
    const [updateContactQuery, { isError: isErrorOnUpdateContactQuery, isLoading: isLoadingOnUpdateContactQuery, isSuccess: isSuccessOnUpdateContactQuery, error: errorOnUpdateContactQuery }] = useUpdateContactQueryMutation()

    const handleSearch = (value: string) => {
        setSearchText(value);
    };
    const filteredData = tableData.filter((record) => {
        return headers.some((header) => record[header].toString().toLowerCase().includes(searchText.toLowerCase()));
    });

    const handleDelete = async (_id: string) => {
        try {
            if (_id) {
                await removeContactQuery(_id).unwrap();
            }
            if (isErrorOnRemoveContactQuery) throw errorOnRemoveContactQuery
        }
        catch (error) {
            message.error(error?.data?.message);
        }
    };

    const handleUpdate = async (record: ContactQuery) => {
        try {
            const updatedContactQuery = await updateContactQuery({ cqId: record._id, updatedContactQuery: record }).unwrap();

            const updatedData = formData?.map((item: any) => (item._id === updatedContactQuery._id ? updatedContactQuery : item));
            setFormData(updatedData);
            setEditingKey('');
            setShouldRefresh(true);

            if (isErrorOnUpdateContactQuery) throw errorOnUpdateContactQuery
        } catch (error) {
            message.error(error?.data?.message);
        }
    }

    const isEditing = (record: ContactQuery) => record._id === editingKey;

    const edit = (record: Partial<ContactQuery> & { _id: string }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: string) => {
        try {
            const row = await (await form.validateFields()) as ContactQuery;
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

    const columns: TableColumnsType<ContactQuery> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        sorter: (a: ContactQuery, b: ContactQuery) => {
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
            onCell: (record: ContactQuery) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
            fixed: col.dataIndex === 'name' ? 'left' : undefined,
        };
    });

    // Add an additional column for Edit and Delete actions
    mergedColumns.push(
        {
            title: 'Action',
            key: 'action',
            fixed: 'right', // Fix the Action column to the right
            width: 75,
            render: (_: any, record: ContactQuery) => {
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
                            title="Delete the ContactQuery!"
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
            if (isSuccessOnRemoveContactQuery)
                message.success('ContactQuery Deleted Successfully!');
        }, 1500)
    }, [isSuccessOnRemoveContactQuery])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnUpdateContactQuery)
                message.success('ContactQuery Updated Successfully!');
        }, 1500)
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [isSuccessOnUpdateContactQuery])

    return (
        <Form form={form} component={false}>
            <Search
                placeholder="Search"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            {
                isLoadingOnRemoveContactQuery || isLoadingOnUpdateContactQuery ? (
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
                        pagination={{ pageSize: 10 }}
                        scroll={{ y: 460 }}
                    />
                )
            }
        </Form>
    )
}
export default ContactQueryTable;