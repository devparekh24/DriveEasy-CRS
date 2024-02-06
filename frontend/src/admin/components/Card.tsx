import { Card } from 'antd';
interface CardCompProps {
    title: string
}
const CardCom = ({ title }: CardCompProps) => (
    <Card title={title} bordered={true} style={{ width: 250, border: '1px solid grey' }} hoverable={true} >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
    </Card>
);

export default CardCom;