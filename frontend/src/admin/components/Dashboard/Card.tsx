import { Card } from 'antd';
interface CardCompProps {
    title: string;
    totalQty: number;
}
const CardCom = ({ title, totalQty }: CardCompProps) => (
    <Card title={title} bordered={true} style={{ width: 250, border: '1px solid grey' }} hoverable={true} >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>{totalQty}</h1>
        </div>
        {title === 'Total Cars' && <p>Total number of cars in the system.</p>}
        {title === 'Total Orders' && <p>Total number of orders placed.</p>}
        {title === 'Total Users' && <p>Total number of registered users.</p>}
        {title === 'Total Damage Reports' && <p>Total number of damage reports submitted.</p>}
    </Card>
);

export default CardCom;