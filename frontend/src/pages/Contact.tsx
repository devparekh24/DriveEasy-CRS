import React from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
import ContactComponent from '../components/ContactComponent/ContactComponent';

const Contact: React.FC = () => {
  return (
    <div>
      <CommonHeader heading={'Contact'} />
      <ContactComponent />
    </div>
  );
};

export default Contact;
