import React from 'react';
import InfoCard from '../InfoCard/InfoCard';
import './HowItWorks.css';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            stepNumber: 1,
            icon: <PersonAddIcon style={{ fontSize: 42 }} />,
            type: 'free',
            heading: 'Create a Profile',
            description: 'Begin your journey by setting up a personalized profile. Your profile helps us tailor our services.',
        },
        {
            stepNumber: 2,
            icon: <DirectionsCarIcon style={{ fontSize: 42 }} />,
            type: 'basic',
            heading: 'Select a Car',
            description: 'Explore our diverse fleet of vehicles and choose the one that suits your style and needs. find the perfect ride for your journey.',
        },
        {
            stepNumber: 3,
            icon: <TextSnippetIcon style={{ fontSize: 42 }} />,
            type: 'medium',
            heading: 'Fill up Booking Form',
            description: 'Complete a simple booking form to provide us the details of your travel dates, pickup location, and any additional preferences.',
        },
        {
            stepNumber: 4,
            icon: <AccountBalanceWalletIcon style={{ fontSize: 42 }} />,
            type: 'pro',
            heading: 'Payment',
            description: 'Finalize your booking by securely making the payment. We offer flexible payment options to accommodate your preferences.',
        },
    ];
    return (
        <div className='step-list'>
            <h1><strong>How it works?</strong></h1>
            <h5>Easy steps to get you started</h5>
            <div className="card-container">
                {steps.map((step, index) => (
                    <InfoCard
                        key={index}
                        stepNumber={step.stepNumber}
                        image={step.icon}
                        type={step.type}
                        heading={step.heading}
                        description={step.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
