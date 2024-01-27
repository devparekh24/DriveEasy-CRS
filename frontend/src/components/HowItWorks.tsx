import React from 'react';
import InfoCard from './InfoCard';
import '../styles/HowItWorks.css';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import EditNoteIcon from '@mui/icons-material/EditNote';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import AddCardIcon from '@mui/icons-material/AddCard';
// import PaymentIcon from '@mui/icons-material/Payment';
// import 'ionicons';
const HowItWorks: React.FC = () => {
    return (
        <div className='step-list'>
            <h1><strong>How it works?</strong></h1>
            <h5>Easy steps to get you started</h5>
            <div className="card-container">
                <InfoCard stepNumber={1} image={<PersonAddIcon style={{ fontSize: 42 }} />} type='free' heading='Create a Profile' description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, laboriosam!' />
                <InfoCard stepNumber={2} image={<DirectionsCarIcon style={{ fontSize: 42 }} />} type='basic' heading='Select a car' description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, laboriosam!' />
                <InfoCard stepNumber={3} image={<TextSnippetIcon style={{ fontSize: 42 }} />} type='medium' heading='Fill up Booking form' description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, laboriosam!' />
                <InfoCard stepNumber={4} image={<AccountBalanceWalletIcon style={{ fontSize: 42 }} />} type='pro' heading='Payment' description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, laboriosam!' />
            </div>
        </div>
    );
};

export default HowItWorks;
