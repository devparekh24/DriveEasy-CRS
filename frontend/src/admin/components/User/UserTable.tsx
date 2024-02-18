import React, { useState, useEffect } from 'react';
import { Form, Input, Popconfirm, Table, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLoader from '../adminLoader/adminLoader';
import { User, UserState } from '../../../slices/userSlice';
import { useRemoveUserMutation, useUpdateUserMutation } from '../../../services/userApi';
import UserImageUploader from '../../../components/ImageUploader/UserImageUploader';
const { Search } = Input;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'text' | 'image';
    record: User;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    record,
    inputType,
    children,
    ...restProps
}) => {
    const [form] = Form.useForm();
    const inputNode =
        dataIndex === 'image' && editing ? (
            <UserImageUploader onUpload={(imgUrl) => form.setFieldsValue({ [dataIndex]: imgUrl })} userId={record._id} />
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
            ) : dataIndex === 'image' ? (
                <img src={record[dataIndex]} alt="img" style={{ width: '125px', }} />
            ) : (
                children
            )}
        </td>
    );
};


const UserTable = ({ headers, tableData }: { headers: string[]; tableData: UserState[] }) => {

    const [form] = Form.useForm();
    let [formData, setFormData] = useState<User[]>();
    const [editingKey, setEditingKey] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    // console.log(data)

    const [removeUser, { isError: isErrorOnRemoveUser, isLoading: isLoadingOnRemoveUser, error: errorOnRemoveUser, isSuccess: isSuccessOnRemoveUser }] = useRemoveUserMutation()
    const [updateUser, { isError: isErrorOnUpdateUser, isLoading: isLoadingOnUpdateUser, isSuccess: isSuccessOnUpdateUser, error: errorOnUpdateUser }] = useUpdateUserMutation()

    const handleSearch = (value: string) => {
        setSearchText(value);
    };
    const filteredData = tableData.filter((record) => {
        return headers.some((header) => record[header].toString().toLowerCase().includes(searchText.toLowerCase()));
    });

    const handleDelete = async (_id: string) => {
        try {
            if (_id) {
                await removeUser(_id).unwrap();
            }
            if (isErrorOnRemoveUser) throw errorOnRemoveUser
        }
        catch (error) {
            message.error(error?.data?.message);
        }
    };

    const handleUpdate = async (record: User) => {
        try {
            const updatedUser = await updateUser({ userId: record._id, updatedUser: record }).unwrap();

            const updatedData = formData?.map((item: any) => (item._id === updatedUser._id ? updatedUser : item));
            setFormData(updatedData);
            setEditingKey('');
            setShouldRefresh(true);

            if (isErrorOnUpdateUser) throw errorOnUpdateUser
        } catch (error) {
            message.error(error?.data?.message);
        }
    }

    const isEditing = (record: User) => record._id === editingKey;

    const edit = (record: Partial<User> & { _id: string }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: string) => {
        try {
            const row = await (await form.validateFields()) as User;
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

    const columns: TableColumnsType<User> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        sorter: (a: User, b: User) => {
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
            onCell: (record: User) => ({
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
            render: (_: any, record: User) => {
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
                            title="Delete the User!"
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
            if (isSuccessOnRemoveUser)
                message.success('User Deleted Successfully!');
        }, 1500)
    }, [isSuccessOnRemoveUser])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnUpdateUser)
                message.success('User Updated Successfully!');
        }, 1500)
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [isSuccessOnUpdateUser])

    return (
        <Form form={form} component={false}>
            <Search
                placeholder="Search"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            {
                isLoadingOnRemoveUser || isLoadingOnUpdateUser ? (
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
                        scroll={{ y: 460 }}
                    />
                )
            }
        </Form>
    )
}
export default UserTable;