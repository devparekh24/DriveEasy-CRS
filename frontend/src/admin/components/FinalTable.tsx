import React, { useState, useRef, useEffect, useContext } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, message } from 'antd';
import type { TableColumnsType, GetRef } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Car } from '../../slices/carSlice';

interface Item {
    // key: string;
    // name: string;
    // age: number;
    // address: string;
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

type InputRef = GetRef<typeof Input> | any;
type FormInstance<T> = GetRef<typeof Form<T>>;

const DeletableContext = React.createContext<FormInstance<any> | null>(null);

interface DeletableRowProps {
    index: number;
}

const DeletableRow: React.FC<DeletableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <DeletableContext.Provider value={form}>
                <tr {...props} />
            </DeletableContext.Provider>
        </Form>
    );
};

interface DeletableCellProps {
    title: React.ReactNode;
    Deletable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}
const DeletableCell: React.FC<DeletableCellProps> = ({
    title,
    Deletable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [deleting, setdeleting] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(DeletableContext)!;

    useEffect(() => {
        if (deleting) {
            inputRef.current!.focus();
        }
    }, [deleting]);

    const toggleEdit = () => {
        setdeleting(!deleting);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (Deletable) {
        childNode = deleting ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="Deletable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type DeletableTableProps = Parameters<typeof Table>[0];

interface DataType {
    // key: React.Key;
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
}

type ColumnTypes = Exclude<DeletableTableProps['columns'], undefined>;

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
    const inputNode =
        inputType === 'number' ? (
            <InputNumber />
        ) : inputType === 'image' ? (
            <Input type="file" /> // If you want to allow updating the image via file input
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


const FinalTable = ({ headers, tableData }: { headers: string[]; tableData: Car[] }) => {

    const [form] = Form.useForm();
    // let [data, setData] = useState(tableData);
    const [editingKey, setEditingKey] = useState('');
    // console.log(data)

    const handleDelete = (key: React.Key) => {
        // const newData = data.filter((item) => item.key !== key);
        message.success('Item Deleted Successfully!');
        // setData(newData);
    };

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
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                // confirmSave(key)
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                // confirmSave(key)
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // const confirmSave = (key: React.Key) => {
    //     // You can customize the confirmation message here
    //     Modal.confirm({
    //         title: 'Confirm Save',
    //         content: 'Are you sure you want to save changes?',
    //         okText: 'Yes',
    //         cancelText: 'No',
    //         onOk: () => save(key),
    //     });
    // };

    // const confirm = (e: React.MouseEvent<HTMLElement>) => {
    //     console.log(e);
    //     message.success('Click on Yes');
    // };
    // console.log(headers)

    const columns: TableColumnsType<Item> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        // Add any other properties you want for each column
    }));

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
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
                            title="Delete the task"
                            description="Are you sure to delete?"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined disabled={editingKey !== ''} color='red' />
                        </Popconfirm>
                    </div>
                );
            },
        }
    );

    return (
        <Form form={form} component={false}>
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
        </Form>
    )
}
export default FinalTable;