import React, { useState, useEffect } from 'react';
import { Form, Input, Popconfirm, Table, Typography, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLoader from '../adminLoader/adminLoader';
import { DamageReport, DamageReportState } from '../../../slices/damageReportSlice';
import { useRemoveDamageReportMutation, useUpdateDamageReportMutation } from '../../../services/damageReportApi';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'text';
    record: DamageReport;
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
    const inputNode = (<Input />);

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


const DamageReportTable = ({ headers, tableData }: { headers: string[]; tableData: DamageReportState[] }) => {

    const [form] = Form.useForm();
    let [formData, setFormData] = useState<DamageReport[]>();
    const [editingKey, setEditingKey] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

    // console.log(data)

    const [removeDamageReport, { isError: isErrorOnRemoveDamageReport, isLoading: isLoadingOnRemoveDamageReport, error: errorOnRemoveDamageReport, isSuccess: isSuccessOnRemoveDamageReport }] = useRemoveDamageReportMutation()
    const [updateDamageReport, { isError: isErrorOnUpdateDamageReport, isLoading: isLoadingOnUpdateDamageReport, isSuccess: isSuccessOnUpdateDamageReport, error: errorOnUpdateDamageReport }] = useUpdateDamageReportMutation()

    const handleDelete = async (_id: string) => {
        try {
            if (_id) {
                await removeDamageReport(_id).unwrap();
            }
            if (isErrorOnRemoveDamageReport) throw errorOnRemoveDamageReport
        }
        catch (error) {
            message.error(error?.data?.message);
        }
    };

    const handleUpdate = async (record: DamageReport) => {
        try {
            const updatedDamageReport = await updateDamageReport({ drId: record._id, updatedDamageReport: record }).unwrap();

            const updatedData = formData?.map((item: any) => (item._id === updatedDamageReport._id ? updatedDamageReport : item));
            setFormData(updatedData);
            setEditingKey('');
            setShouldRefresh(true);

            if (isErrorOnUpdateDamageReport) throw errorOnUpdateDamageReport
        } catch (error) {
            message.error(error?.data?.message);
        }
    }

    const isEditing = (record: DamageReport) => record._id === editingKey;

    const edit = (record: Partial<DamageReport> & { _id: string }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: string) => {
        try {
            const row = await (await form.validateFields()) as DamageReport;
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

    const columns: TableColumnsType<DamageReport> = headers.map((header: any) => ({
        title: header,
        dataIndex: header,
        key: header,
        editable: true,
    }));

    const mergedColumns = columns.map((col) => {
        if (!col.editable || col.dataIndex === '_id' || col.dataIndex === 'user' || col.dataIndex === 'car') {
            return col;
        }
        return {
            ...col,
            onCell: (record: DamageReport) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
            fixed: col.dataIndex === 'description' ? 'left' : undefined,
        };
    });

    // Add an additional column for Edit and Delete actions
    mergedColumns.push(
        {
            title: 'Action',
            key: 'action',
            fixed: 'right', // Fix the Action column to the right
            width: 75,
            render: (_: any, record: DamageReport) => {
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
                            title="Delete the DamageReport!"
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
            if (isSuccessOnRemoveDamageReport)
                message.success('DamageReport Deleted Successfully!');
        }, 1500)
    }, [isSuccessOnRemoveDamageReport])

    useEffect(() => {
        setTimeout(() => {
            if (isSuccessOnUpdateDamageReport)
                message.success('DamageReport Updated Successfully!');
        }, 1500)
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [isSuccessOnUpdateDamageReport])

    return (
        <Form form={form} component={false}>
            {
                isLoadingOnRemoveDamageReport || isLoadingOnUpdateDamageReport ? (
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
                        scroll={{ y: 460 }}
                    />
                )
            }
        </Form>
    )
}
export default DamageReportTable;