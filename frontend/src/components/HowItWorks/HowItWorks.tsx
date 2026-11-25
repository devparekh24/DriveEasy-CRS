import React from 'react';
import InfoCard from '../InfoCard/InfoCard';
import './HowItWorks.css';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { isV2Enabled } from '../../utils/featureFlags';

const HowItWorks: React.FC = () => {
    const v2Active = isV2Enabled();

    const steps = [
        {
            stepNumber: 1,
            icon: <PersonAddIcon style={{ fontSize: 36 }} />,
            type: 'free',
            heading: v2Active ? 'Create VIP Account' : 'Create a Profile',
            description: v2Active ? 'Register your profile in seconds to unlock exclusive supercar access, instant booking privileges, and priority delivery.' : 'Begin your journey by setting up a personalized profile. Your profile helps us tailor our services.',
        },
        {
            stepNumber: 2,
            icon: <DirectionsCarIcon style={{ fontSize: 36 }} />,
            type: 'basic',
            heading: v2Active ? 'Select Your Machine' : 'Select a Car',
            description: v2Active ? 'Browse our world-class fleet ranging from high-performance V8 supercars to chauffeur-driven luxury sedans.' : 'Explore our diverse fleet of vehicles and choose the one that suits your style and needs. find the perfect ride for your journey.',
        },
        {
            stepNumber: 3,
            icon: <TextSnippetIcon style={{ fontSize: 36 }} />,
            type: 'medium',
            heading: v2Active ? 'Reserve & Tailor' : 'Fill up Booking Form',
            description: v2Active ? 'Pick travel dates, select doorstep delivery location, and personalize with optional concierge amenities.' : 'Complete a simple booking form to provide us the details of your travel dates, pickup location, and any additional preferences.',
        },
        {
            stepNumber: 4,
            icon: <AccountBalanceWalletIcon style={{ fontSize: 36 }} />,
            type: 'pro',
            heading: v2Active ? 'Instant Key Handover' : 'Payment',
            description: v2Active ? 'Enjoy seamless payment security with zero deposit hassle, followed by doorstep vehicle delivery and key handover.' : 'Finalize your booking by securely making the payment. We offer flexible payment options to accommodate your preferences.',
        },
    ];

    if (!v2Active) {
        return (
            <div className='v1-step-list'>
                <h1><strong>How it works?</strong></h1>
                <h5>Easy steps to get you started</h5>
                <div className="v1-card-container">
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
    }

    return (
        <div className="how-it-works-luxury">
            <div className="section-header-box" data-aos="fade-up">
                <span className="section-subtitle-tag">EXECUTIVE PROCESS</span>
                <h2 className="section-main-title">
                    HOW IT <span className="gold-title-highlight">WORKS</span>
                </h2>
                <p className="section-desc">
                    4 seamless steps separating you from driving your dream luxury supercar
                </p>
            </div>

            <div className="card-container" data-aos="fade-up" data-aos-delay="150">
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


