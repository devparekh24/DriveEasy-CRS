import React from 'react';
import './GridViewToggle.css';
import { BsGrid1X2, BsGrid, BsGrid3X3Gap } from 'react-icons/bs';

interface GridViewToggleProps {
    currentView: '1x1' | '2x2' | '3x3';
    onViewChange: (view: '1x1' | '2x2' | '3x3') => void;
}

const GridViewToggle: React.FC<GridViewToggleProps> = ({ currentView, onViewChange }) => {
    return (
        <div className="grid-view-toggle">
            <button
                className={`grid-toggle-btn ${currentView === '1x1' ? 'active' : ''}`}
                onClick={() => onViewChange('1x1')}
                title="Single column view"
            >
                <BsGrid1X2 />
            </button>
            <button
                className={`grid-toggle-btn ${currentView === '2x2' ? 'active' : ''}`}
                onClick={() => onViewChange('2x2')}
                title="Two columns view"
            >
                <BsGrid />
            </button>
            <button
                className={`grid-toggle-btn ${currentView === '3x3' ? 'active' : ''}`}
                onClick={() => onViewChange('3x3')}
                title="Three columns view"
            >
                <BsGrid3X3Gap />
            </button>
        </div>
    );
};

export default GridViewToggle;
