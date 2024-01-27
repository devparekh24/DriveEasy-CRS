import "../styles/CommonHeader.css";

interface CommonHeaderProps {
  heading: string;
}
const CommonHeader: React.FC<CommonHeaderProps> = ({ heading }) => {
  return (
    <div className="common-header">
      <h1>{heading}</h1>
    </div>
  )
}

export default CommonHeader
