import "./CommonHeader.css";
import React from "react";
import { isV2Enabled } from "../../utils/featureFlags";

interface CommonHeaderProps {
  heading: string;
  subtitle?: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ heading, subtitle }) => {
  const v2Active = isV2Enabled();

  if (v2Active) {
    return (
      <div className="v2-common-header">
        <div className="v2-header-overlay" />
        <div className="v2-header-content">
          <span className="v2-header-tag">DRIVE EASY</span>
          <h1 className="v2-header-title">{heading}</h1>
          {subtitle && <p className="v2-header-subtitle">{subtitle}</p>}
          <div className="v2-header-divider" />
        </div>
      </div>
    );
  }

  return (
    <div className="common-header">
      <h1>{heading}</h1>
    </div>
  );
};

export default CommonHeader;
