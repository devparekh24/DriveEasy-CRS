import React, { useEffect } from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
import ContactComponent from '../components/ContactComponent/ContactComponent';

const Contact: React.FC = () => {
    
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

  return (
    <div>
      <CommonHeader heading={'Contact'} />
      <ContactComponent />
    </div>
  );
};

export default Contact;
