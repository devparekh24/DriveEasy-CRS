import DashBoardLayout from "./DashBoardLayout";
import admin404 from '../../assets/admin404.svg';

const PageNotFoundOnAdmin = () => {
    return (
        <DashBoardLayout>
            <img src={admin404} height={620} width='100%' />
        </DashBoardLayout>
    )
}

export default PageNotFoundOnAdmin
