import React, { useState, useEffect, useRef } from 'react';

const GradientColorPicker = ({
  color,
  onColorChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
  const [activeTab, setActiveTab] = useState('RGB'); // NEW: tab state
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

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Update color from RGB values
  const updateColorFromRgb = (newRgb) => {
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(newColor);
    onColorChange(newColor);
  };

  // Update color from HSL values
  const updateColorFromHsl = (newHsl) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
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

  useEffect(() => {
    setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

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
            {/* Color preview button in header */}
            <div
              className="rounded border me-2"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: currentColor,
                flexShrink: 0
              }}
            ></div>
            <h5 className="modal-title">Color Picker</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            ></button>
          </div>

          {/* Tab Bar */}
          <ul className="nav nav-tabs justify-content-center mt-2" role="tablist">
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'RGB' ? ' active' : ''}`} onClick={() => setActiveTab('RGB')} type="button" role="tab">RGB</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'HSL' ? ' active' : ''}`} onClick={() => setActiveTab('HSL')} type="button" role="tab">HSL</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'HEX' ? ' active' : ''}`} onClick={() => setActiveTab('HEX')} type="button" role="tab">HEX</button>
            </li>
          </ul>

          <div className="modal-body">
            {/* Tab Content */}
            {activeTab === 'RGB' && (
              <div className="d-flex flex-column gap-3">
                {/* Red */}
                <div>
                  <label className="form-label fw-medium">Red</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={e => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={e => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                {/* Green */}
                <div>
                  <label className="form-label fw-medium">Green</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={e => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={e => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                {/* Blue */}
                <div>
                  <label className="form-label fw-medium">Blue</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={e => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={e => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'HSL' && (
              <div className="d-flex flex-column gap-3">
                {/* Hue */}
                <div>
                  <label className="form-label fw-medium">Hue</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="360"
                      value={hsl.h}
                      onChange={e => updateColorFromHsl({ ...hsl, h: parseInt(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="0"
                      max="360"
                      value={hsl.h}
                      onChange={e => updateColorFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                {/* Saturation */}
                <div>
                  <label className="form-label fw-medium">Saturation</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={e => updateColorFromHsl({ ...hsl, s: parseInt(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={e => updateColorFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                {/* Lightness */}
                <div>
                  <label className="form-label fw-medium">Lightness</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={e => updateColorFromHsl({ ...hsl, l: parseInt(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={e => updateColorFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'HEX' && (
              <div className="d-flex flex-column gap-3">
                <label className="form-label fw-medium">HEX</label>
                <input
                  type="text"
                  value={currentColor}
                  onChange={handleHexChange}
                  className="form-control"
                  placeholder="#000000"
                  style={{ fontFamily: 'monospace', fontSize: '1rem', maxWidth: 160 }}
                  maxLength={7}
                />
              </div>
            )}
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
