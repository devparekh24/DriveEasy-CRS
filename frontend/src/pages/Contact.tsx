import React, { useEffect } from 'react';
import CommonHeader from '../components/CommonHeader/CommonHeader';
import ContactComponent from '../components/ContactComponent/ContactComponent';
import { isV2Enabled } from '../utils/featureFlags';

const Contact: React.FC = () => {
  const v2Active = isV2Enabled();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={v2Active ? "v2-contact-theme" : ""}>
      <CommonHeader heading={'Contact'} subtitle={v2Active ? "24/7 VIP Concierge & Booking Inquiries" : undefined} />
      <ContactComponent />
    </div>
  );
};

export default Contact;

