import React from "react";
import "../styles/InfoCard.css";

interface InfoCardProps {
    stepNumber: number;
    heading: string;
    description: string;
    type: string;
    image: any;
}

const InfoCard: React.FC<InfoCardProps> = ({ stepNumber, image, heading, description, type }) => {

    return (
        <div className="app-wrapper">
            <div className={`card ${type}`}>
                <div className="img">
                    {image}
                </div>
                <div className="card-content">
                    <h3>{stepNumber}. {heading}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;

