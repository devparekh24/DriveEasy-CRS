import { Card } from 'antd';
interface CardCompProps {
    title: string;
    totalQty: number;
}
const CardCom = ({ title, totalQty }: CardCompProps) => (
    <Card title={title} bordered={true} style={{ width: 250, border: '1px solid grey' }} hoverable={true} >
        <h1>{totalQty}</h1>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
    </Card>
);

export default CardCom;