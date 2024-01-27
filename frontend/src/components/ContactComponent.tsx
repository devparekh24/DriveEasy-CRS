import "../styles/ContactComponent.css";
import { IoCall, IoLocation } from "react-icons/io5";
import { RiHomeOfficeFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

interface Office {
  title: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
}

const offices: Office[] = [
  {
    title: "Karachi Office",
    phoneNumber: "1234567890",
    emailAddress: "smshoaib2001@gmail.com",
    address: "Block-14, Gulistan-e-Johar, Karachi",
  },
  {
    title: "Islamabad Office",
    phoneNumber: "1234567890",
    emailAddress: "smshoaib2001@gmail.com",
    address: "Block-14, Gulistan-e-Johar, Karachi",
  },
  {
    title: "Lahore Office",
    phoneNumber: "1234567890",
    emailAddress: "smshoaib2001@gmail.com",
    address: "Block-14, Gulistan-e-Johar, Karachi",
  },
];

export default function ContactComponent() {
  return (
    <div className="contact-component">
      {offices.map((office, index) => (
        <div key={index} className="contact-box">
          <h4>
            <RiHomeOfficeFill className="icon" />
            {office.title}
          </h4>
          <p className="number">
            <IoCall className="icon" />
            {office.phoneNumber}
          </p>
          <p className="number">
            <MdEmail className="icon" />
            {office.emailAddress}
          </p>
          <p>
            <IoLocation className="icon" />
            {office.address}
          </p>
        </div>
      ))}
    </div>
  );
}
