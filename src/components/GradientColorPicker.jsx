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
        className="btn d-flex align-items-center justify-content-center border"
        style={{ 
          width: '40px', 
          height: '40px',
          backgroundColor: color,
          flexShrink: 0
        }}
        onClick={handleColorClick}
        disabled={disabled}
        title="Click to open color picker"
      >
        <i className="bi bi-palette-fill" style={{ 
          color: 'white',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          fontSize: '1rem'
        }}></i>
      </button>
    );
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" ref={dialogRef}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Color Picker</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded">
              <div 
                className="rounded border"
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: currentColor,
                  flexShrink: 0
                }}
              ></div>
              <input
                type="text"
                value={currentColor}
                onChange={handleHexChange}
                className="form-control"
                placeholder="#000000"
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fw-medium">Red</label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="range"
                    className="form-range flex-grow-1"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '80px' }}
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label fw-medium">Green</label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="range"
                    className="form-range flex-grow-1"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '80px' }}
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label fw-medium">Blue</label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="range"
                    className="form-range flex-grow-1"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '80px' }}
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientColorPicker;
