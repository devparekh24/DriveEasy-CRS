import React from 'react';
import CommonHeader from '../components/CommonHeader';
import ContactComponent from '../components/ContactComponent';

const Contact: React.FC = () => {
  return (
    <div>
      <CommonHeader heading={'Contact'} />
      <ContactComponent />
    </div>
  );
};

export default Contact;
