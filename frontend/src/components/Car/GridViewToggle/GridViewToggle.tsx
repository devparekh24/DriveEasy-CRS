import React, { useState } from 'react';
import './GridViewToggle.css';
import { BsGrid1X2, BsGrid, BsGrid3X3Gap } from 'react-icons/bs';
import { MdGridView } from 'react-icons/md';

interface GridViewToggleProps {
    currentView: '1x1' | '2x2' | '3x3';
    onViewChange: (view: '1x1' | '2x2' | '3x3') => void;
}

const GridViewToggle: React.FC<GridViewToggleProps> = ({ currentView, onViewChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleViewChange = (view: '1x1' | '2x2' | '3x3') => {
        onViewChange(view);
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Desktop view - horizontal layout */}
            <div className="grid-view-toggle desktop-only">
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

            {/* Mobile view - floating action button with radial menu */}
            <div className="grid-fab-container mobile-only">
                <button
                    className={`grid-fab-main ${isMenuOpen ? 'open' : ''}`}
                    onClick={handleToggleMenu}
                    title="Grid view options"
                >
                    <MdGridView />
                </button>

                {isMenuOpen && (
                    <>
                        <button
                            className={`grid-fab-option grid-fab-option-1 ${currentView === '1x1' ? 'active' : ''}`}
                            onClick={() => handleViewChange('1x1')}
                            title="Single column"
                        >
                            <BsGrid1X2 />
                        </button>
                        <button
                            className={`grid-fab-option grid-fab-option-2 ${currentView === '2x2' ? 'active' : ''}`}
                            onClick={() => handleViewChange('2x2')}
                            title="Two columns"
                        >
                            <BsGrid />
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default GridViewToggle;
