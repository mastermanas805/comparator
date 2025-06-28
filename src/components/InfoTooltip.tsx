import React, { useState, useEffect } from 'react';
import './InfoTooltip.css';

interface InfoTooltipProps {
  title: string;
  description: string;
  example: {
    before: string;
    after: string;
    explanation: string;
  };
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, description, example }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible]);

  return (
    <>
      <div className="info-tooltip-container">
        <button
          type="button"
          className="info-button"
          onClick={handleToggle}
          aria-label={`Information about ${title}`}
        >
          i
        </button>
      </div>

      {isVisible && (
        <>
          <div className="tooltip-backdrop" onClick={handleBackdropClick} />
          <div className="tooltip-content">
            <button
              className="tooltip-close-btn"
              onClick={handleClose}
              aria-label="Close tooltip"
            >
              ×
            </button>

            <div className="tooltip-header">
              <h4 className="tooltip-title">{title}</h4>
            </div>

            <p className="tooltip-description">{description}</p>

            <div className="tooltip-example">
              <h5 className="example-title">Example:</h5>
              <div className="example-grid">
                <div className="example-section">
                  <span className="example-label">Before:</span>
                  <div className="example-code">{example.before}</div>
                </div>
                <div className="example-section">
                  <span className="example-label">After:</span>
                  <div className="example-code">{example.after}</div>
                </div>
              </div>
              <p className="example-explanation">{example.explanation}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InfoTooltip;
