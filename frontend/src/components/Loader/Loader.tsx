import loadingImg from '../../assets/loading.gif';
import { isV2Enabled } from '../../utils/featureFlags';
import { SiMediamarkt } from 'react-icons/si';
import './Loader.css';

const Loader = () => {
    const v2Active = isV2Enabled();

    if (v2Active) {
        return (
            <div className="v2-loader-wrapper">
                <div className="v2-loader-stage">
                    <div className="v2-loader-glow-ring" />
                    <div className="v2-loader-glow-ring inner" />
                    <div className="v2-loader-emblem">
                        <SiMediamarkt />
                    </div>
                </div>
                <div className="v2-loader-brand">
                    Drive<span>Easy</span>
                </div>
                <div className="v2-loader-subtitle">Preparing Fleet...</div>
                <div className="v2-loader-progress-bar">
                    <div className="v2-loader-progress-fill" />
                </div>
            </div>
        );
    }

    return (
        <div className="loader-container">
            <img src={loadingImg} alt="Loading..." />
        </div>
    );
};

export default Loader;
