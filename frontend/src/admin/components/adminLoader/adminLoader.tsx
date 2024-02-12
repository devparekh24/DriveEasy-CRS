import React from 'react';
import { Flex, Spin } from 'antd';

const AdminLoader: React.FC = () => (
    <Flex style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}>
        <Spin size="large" />
    </Flex>
);

export default AdminLoader;