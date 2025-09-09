import React, { useState } from 'react';
import CustomColorPicker from './CustomColorPicker';

const ColorPickerButton = ({ 
  color, 
  onColorChange, 
  label = "Color", 
  showTitleBar = true,
  className = "",
  disabled = false 
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleColorClick = () => {
    if (!disabled) {
      setIsPickerOpen(true);
    }
  };

  const handleColorChange = (newColor) => {
    onColorChange(newColor);
  };

  const handleClose = () => {
    setIsPickerOpen(false);
  };

  return (
    <>
      <div className={`d-flex flex-column gap-2 ${className}`}>
        <label className="form-label fw-medium">{label}</label>
        <button
          type="button"
          className="btn d-flex align-items-center justify-content-between p-3 border"
          onClick={handleColorClick}
          disabled={disabled}
          style={{ 
            backgroundColor: color,
            minHeight: '44px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
          title="Click to open color picker"
        >
          <span style={{ 
            color: 'white', 
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            fontWeight: '600'
          }}>
            {color}
          </span>
          <i className="bi bi-palette-fill" style={{ 
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            fontSize: '1.1rem'
          }}></i>
        </button>
      </div>

      <CustomColorPicker
        isOpen={isPickerOpen}
        onClose={handleClose}
        initialColor={color}
        onColorChange={handleColorChange}
        showTitleBar={showTitleBar}
      />
    </>
  );
};

export default ColorPickerButton;
