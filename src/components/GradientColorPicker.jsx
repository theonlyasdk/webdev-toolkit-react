import React, { useState, useEffect, useRef } from 'react';

const GradientColorPicker = ({ 
  color, 
  onColorChange,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const dialogRef = useRef(null);

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Update color from RGB values
  const updateColorFromRgb = (newRgb) => {
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(newColor);
    onColorChange(newColor);
  };

  // Handle hex input
  const handleHexChange = (e) => {
    const hexValue = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
      const newRgb = hexToRgb(hexValue);
      updateColorFromRgb(newRgb);
    }
    setCurrentColor(hexValue);
  };

  // Initialize color values
  useEffect(() => {
    const initialRgb = hexToRgb(color);
    setRgb(initialRgb);
    setCurrentColor(color);
  }, [color]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="gradient-color-picker-trigger"
        onClick={handleColorClick}
        disabled={disabled}
        style={{ backgroundColor: color }}
        title="Click to open color picker"
      >
        <i className="bi bi-palette-fill"></i>
      </button>
    );
  }

  return (
    <div className="gradient-color-picker-overlay">
      <div className="gradient-color-picker-dialog" ref={dialogRef}>
        <div className="gradient-color-picker-header">
          <span>Color Picker</span>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="gradient-color-picker-content">
          <div className="color-preview">
            <div 
              className="color-swatch" 
              style={{ backgroundColor: currentColor }}
            ></div>
            <input
              type="text"
              value={currentColor}
              onChange={handleHexChange}
              className="hex-input"
              placeholder="#000000"
            />
          </div>

          <div className="color-inputs">
            <div className="input-group">
              <label>Red</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) })}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>Green</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) })}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>Blue</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) })}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="gradient-color-picker-actions">
          <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradientColorPicker;
