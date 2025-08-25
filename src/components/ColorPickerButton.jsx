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
      <div className={`color-picker-button ${className}`}>
        <label className="form-label">{label}</label>
        <button
          type="button"
          className="color-picker-trigger"
          onClick={handleColorClick}
          disabled={disabled}
          style={{ backgroundColor: color }}
          title="Click to open color picker"
        >
          <span className="color-value">{color}</span>
          <i className="bi bi-palette-fill"></i>
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
