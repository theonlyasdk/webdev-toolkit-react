import React, { useState, useEffect, useRef } from 'react';

const CustomColorPicker = ({ 
  isOpen, 
  onClose, 
  initialColor = '#000000', 
  onColorChange,
  showTitleBar = true 
}) => {
  const [activeTab, setActiveTab] = useState('rgb');
  const [color, setColor] = useState(initialColor);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
  const [hsb, setHsb] = useState({ h: 0, s: 0, b: 0 });
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
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Convert RGB to HSB
  const rgbToHsb = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h, s, v = max;

    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      b: Math.round(v * 100)
    };
  };

  // Convert HSB to RGB
  const hsbToRgb = (h, s, b) => {
    h /= 360;
    s /= 100;
    b /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, bVal;

    if (s === 0) {
      r = g = bVal = b;
    } else {
      const q = b < 0.5 ? b * (1 + s) : b + s - b * s;
      const p = 2 * b - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      bVal = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(bVal * 255)
    };
  };

  // Update color from RGB values
  const updateColorFromRgb = (newRgb) => {
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(newColor);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHsl(newHsl);
    const newHsb = rgbToHsb(newRgb.r, newRgb.g, newRgb.b);
    setHsb(newHsb);
    onColorChange?.(newColor);
  };

  // Update color from HSL values
  const updateColorFromHsl = (newHsl) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(newColor);
    const newHsb = rgbToHsb(newRgb.r, newRgb.g, newRgb.b);
    setHsb(newHsb);
    onColorChange?.(newColor);
  };

  // Update color from HSB values
  const updateColorFromHsb = (newHsb) => {
    setHsb(newHsb);
    const newRgb = hsbToRgb(newHsb.h, newHsb.s, newHsb.b);
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(newColor);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHsl(newHsl);
    onColorChange?.(newColor);
  };

  // Handle hex input
  const handleHexChange = (e) => {
    const hexValue = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
      const newRgb = hexToRgb(hexValue);
      updateColorFromRgb(newRgb);
    }
    setColor(hexValue);
  };

  // Initialize color values
  useEffect(() => {
    const initialRgb = hexToRgb(initialColor);
    setRgb(initialRgb);
    setHsl(rgbToHsl(initialRgb.r, initialRgb.g, initialRgb.b));
    setHsb(rgbToHsb(initialRgb.r, initialRgb.g, initialRgb.b));
    setColor(initialColor);
  }, [initialColor]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="color-picker-overlay">
      <div className="color-picker-dialog" ref={dialogRef}>
        {showTitleBar && (
          <div className="color-picker-titlebar">
            <span>Color picker</span>
            <button className="close-btn" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        )}
        
        {!showTitleBar && (
          <button className="close-btn no-titlebar" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}

        <div className="color-picker-tabs">
          <button 
            className={`tab ${activeTab === 'rgb' ? 'active' : ''}`}
            onClick={() => setActiveTab('rgb')}
          >
            RGB
          </button>
          <button 
            className={`tab ${activeTab === 'hsl' ? 'active' : ''}`}
            onClick={() => setActiveTab('hsl')}
          >
            HSL
          </button>
          <button 
            className={`tab ${activeTab === 'hsb' ? 'active' : ''}`}
            onClick={() => setActiveTab('hsb')}
          >
            HSB
          </button>
        </div>

        <div className="color-picker-content">
          <h4>{activeTab.toUpperCase()} Color Picker</h4>
          
          <div className="color-preview">
            <div 
              className="color-swatch" 
              style={{ backgroundColor: color }}
            ></div>
            <input
              type="text"
              value={color}
              onChange={handleHexChange}
              className="hex-input"
              placeholder="#000000"
            />
          </div>

          {activeTab === 'rgb' && (
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
          )}

          {activeTab === 'hsl' && (
            <div className="color-inputs">
              <div className="input-group">
                <label>Hue</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => updateColorFromHsl({ ...hsl, h: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => updateColorFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="input-group">
                <label>Saturation (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => updateColorFromHsl({ ...hsl, s: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => updateColorFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="input-group">
                <label>Lightness (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => updateColorFromHsl({ ...hsl, l: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => updateColorFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          {activeTab === 'hsb' && (
            <div className="color-inputs">
              <div className="input-group">
                <label>Hue</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsb.h}
                  onChange={(e) => updateColorFromHsb({ ...hsb, h: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsb.h}
                  onChange={(e) => updateColorFromHsb({ ...hsb, h: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="input-group">
                <label>Saturation (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsb.s}
                  onChange={(e) => updateColorFromHsb({ ...hsb, s: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsb.s}
                  onChange={(e) => updateColorFromHsb({ ...hsb, s: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="input-group">
                <label>Brightness (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsb.b}
                  onChange={(e) => updateColorFromHsb({ ...hsb, b: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsb.b}
                  onChange={(e) => updateColorFromHsb({ ...hsb, b: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="color-picker-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomColorPicker;
