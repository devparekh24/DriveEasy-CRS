import React, { useState, useRef, useEffect, useContext } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, message } from 'antd';
import type { TableColumnsType, GetRef } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Item {
    key: string;
    name: string;
    age: number;
    address: string;
    // editable: boolean;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
    });
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
    key: React.Key;
    name: string;
    age: string;
    address: string;
}

type ColumnTypes = Exclude<DeletableTableProps['columns'], undefined>;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

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

const FinalTable = ({ headers }: any) => {

    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');


    const handleDelete = (key: React.Key) => {
        const newData = data.filter((item) => item.key !== key);
        message.success('Item Deleted Successfully!');
        setData(newData);
    };

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.key);
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
    console.log(headers)
    const columns: TableColumnsType<Item> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
        // Add any other properties you want for each column
    }));
    // const columns: TableColumnsType<Item> = [
    //     {
    //         title: 'Full Name',
    //         width: 100,
    //         dataIndex: 'name',
    //         key: 'name',
    //         // fixed: 'left',
    //         editable: true
    //     },
    //     {
    //         title: 'Age',
    //         width: 100,
    //         dataIndex: 'age',
    //         key: 'age',
    //         // fixed: 'left',
    //         editable: true
    //     },
    //     {
    //         title: 'Column 1',
    //         dataIndex: 'address',
    //         key: '1',
    //         width: 150,
    //         editable: true
    //     },
    //     {
    //         title: 'Column 2',
    //         dataIndex: 'address',
    //         key: '2',
    //         width: 150,
    //         editable: true

    //     },
    //     {
    //         title: 'Column 3',
    //         dataIndex: 'address',
    //         key: '3',
    //         width: 150,
    //         editable: true

    //     },
    //     {
    //         title: 'Column 4',
    //         dataIndex: 'address',
    //         key: '4',
    //         width: 150,
    //         editable: true

    //     },
    //     {
    //         title: 'Column 5',
    //         dataIndex: 'address',
    //         key: '5',
    //         width: 150,
    //         editable: true

    //     },
    //     {
    //         title: 'Column 6',
    //         dataIndex: 'address',
    //         key: '6',
    //         width: 150,
    //         editable: true

    //     },
    //     {
    //         title: 'Column 7',
    //         dataIndex: 'address',
    //         key: '7',
    //         width: 150,
    //         editable: true

    //     },
    //     {
    //         title: 'Column 8', dataIndex: 'address', key: '8',
    //         editable: true

    //     },
    //     {
    //         title: 'Action',
    //         key: 'operation',
    //         fixed: 'right',
    //         width: 110,
    //         render: (_: any, record: Item) => {
    //             const editable = isEditing(record);
    //             return editable ? (
    //                 <span>
    //                     <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
    //                         {/* <Popconfirm title="Are you sure to Save Changes?" onConfirm={() => confirmSave(record.key)}> */}
    //                         Save
    //                         {/* </Popconfirm> */}
    //                     </Typography.Link>
    //                     <Popconfirm title="Are you sure to cancel, Your Changes cannot be Saved?" onConfirm={cancel}>
    //                         <a>Cancel</a>
    //                     </Popconfirm>
    //                 </span>
    //             ) : (
    //                 // <div style={{ display: 'grid', gridGap: 10 }} >
    //                 <div style={{ display: 'flex', justifyContent: 'space-around' }} >

    //                     {/* <Typography style={{ display: 'flex', justifyContent: 'space-between' }}> */}
    //                     {/* <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}> */}
    //                     {/* < Button type='primary' ghost disabled={editingKey !== ''} onClick={() => edit(record)}> Edit</Button > */}
    //                     <EditOutlined disabled={editingKey !== ''} onClick={() => edit(record)} color='primary' />
    //                     {/* Edit */}
    //                     {/* </Typography.Link> */}
    //                     {/* <Typography.Link > */}
    //                     < Popconfirm
    //                         title="Delete the task"
    //                         description="Are you sure to delete ?"
    //                         icon={< QuestionCircleOutlined style={{ color: 'red' }} />}
    //                         onConfirm={() => handleDelete(record.key)}
    //                         okText="Yes"
    //                         cancelText="No"
    //                     >
    //                         {/* <Button danger disabled={editingKey !== ''}>Delete</Button> */}
    //                         <DeleteOutlined disabled={editingKey !== ''} color='red' />
    //                     </Popconfirm >
    //                     {/* <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.key)}>
    //                                 <a style={{ color: 'red' }} disabled={editingKey !== ''}>Delete</a>
    //                             </Popconfirm> */}
    //                     {/* </Typography.Link> */}
    //                     {/* </Typography> */}
    //                 </div >
    //             );
    //         },
    //     }
    // ];
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
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                scroll={{ x: 1500, y: 470 }}
            />
        </Form>
    )
}
export default FinalTable;