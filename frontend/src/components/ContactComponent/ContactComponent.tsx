import "./ContactComponent.css";
import { IoCall, IoLocation } from "react-icons/io5";
import { RiHomeOfficeFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

interface Office {
  title: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
}

const offices: Office[] = [{
  title: "Surat Office",
  phoneNumber: "1234567890",
  emailAddress: "driveeasy@gmail.com",
  address: "Luxuria Business Hub, Dumas Rd, Surat",
}];

interface initialState {
  name: string;
  contactNo: string;
  email: string;
  message: string;
}
const initialState: initialState = {
  name: '',
  contactNo: '',
  email: '',
  message: ''
}

export default function ContactComponent() {

  const [formData, setFormData] = useState<initialState>(initialState)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <>
      <div className="contact-header">
        <div>
          <h1>Contact Us Or Use This Form To Rent A Car</h1>
          <p>
            Get in touch with us to rent a car! Whether you have questions, need assistance, we're here to help.
            <p>
              Reach out to us using the form below, and we'll get back to you as soon as possible. Your satisfaction is our priority.
            </p>
            <p>
              Feel free to contact us regarding any inquiries about our car rental services. Thank you for considering us for your next journey.</p>
          </p>
        </div>
      </div>
      <div className="contact-component">
        <div className="contact-form-container">
          <form className="contact-form">
            <div className="input-group">
              <input type="text" id="name" name="name" placeholder="Enter Name" required />
              <input type="Number" id="contactNo" name="contactNo" placeholder="Enter Contact Number" minLength={10} maxLength={10} required />
            </div>
            <div className="input-group">
              <input type="email" id="email" name="email" placeholder="Enter Email" required />
            </div>
            <div className="input-group">
              <textarea id="message" name="message" placeholder="Write Your Message" cols={30} rows={5} style={{ width: '100%', border: '1px solid rgb(207, 204, 204)', fontSize: '16px' }} required />
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>

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
    </>

  );
}
