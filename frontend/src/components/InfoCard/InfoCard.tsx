import React from "react";
import "./InfoCard.css";
import { isV2Enabled } from "../../utils/featureFlags";

interface InfoCardProps {
    stepNumber: number;
    heading: string;
    description: string;
    type: string;
    image: any;
}

const InfoCard: React.FC<InfoCardProps> = ({ stepNumber, image, type, heading, description }) => {
    const v2Active = isV2Enabled();

    // V1 Classic white card with colored border per type
    if (!v2Active) {
        return (
            <div className={`v1-info-card v1-info-card--${type}`}>
                <div className="v1-card-icon">{image}</div>
                <h3 className="v1-card-heading">{stepNumber}. {heading}</h3>
                <p className="v1-card-desc">{description}</p>
            </div>
        );
    }

    // V2 Luxury dark glassmorphism card
    return (
        <div className="luxury-step-card">
            <div className="step-card-header">
                <span className="step-badge-number">0{stepNumber}</span>
                <div className="step-icon-wrapper">
                    {image}
                </div>
            </div>
            <div className="step-card-body">
                <h3 className="step-card-heading">{heading}</h3>
                <p className="step-card-desc">{description}</p>
            </div>
            <div className="step-bottom-border"></div>
        </div>
    );
};

export default InfoCard;
