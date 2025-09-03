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
  const [lastKnownHue, setLastKnownHue] = useState(0);
  const [lastKnownSaturation, setLastKnownSaturation] = useState(0);
  const [isUpdatingFromHsb, setIsUpdatingFromHsb] = useState(false);
  const [lastHsb, setLastHsb] = useState({ h: 196, s: 54 });
  const [lastHsl, setLastHsl] = useState({ h: 196, s: 54 });
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
  const rgbToHsl = (r, g, b, fallbackHsl = lastHsl) => {
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

    if ((l === 0 || l === 1) && fallbackHsl) {
      return { h: fallbackHsl.h, s: fallbackHsl.s, l: Math.round(l * 100) };
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

  // Convert RGB to HSB (HSV) - CORRECTED implementation
  const rgbToHsb = (r, g, b, fallbackHsb = lastHsb) => {
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

    // If color is black and we have preserved HSB values, use them
    if (max === 0 && fallbackHsb) {
      return {
        h: fallbackHsb.h,
        s: fallbackHsb.s,
        b: 0
      };
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      b: Math.round(v * 100)
    };
  };

  // Convert HSB (HSV) to RGB - CORRECTED implementation
  const hsbToRgb = (h, s, b) => {
    h /= 360;
    s /= 100;
    b /= 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = b * (1 - s);
    const q = b * (1 - f * s);
    const t = b * (1 - (1 - f) * s);

    let r, g, bVal;

    switch (i % 6) {
      case 0: r = b; g = t; bVal = p; break;
      case 1: r = q; g = b; bVal = p; break;
      case 2: r = p; g = b; bVal = t; break;
      case 3: r = p; g = q; bVal = b; break;
      case 4: r = t; g = p; bVal = b; break;
      case 5: r = b; g = p; bVal = q; break;
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

  // Update color from HSB values
  const updateColorFromHsb = (newHsb) => {
    setHsb(newHsb);
    const newRgb = hsbToRgb(newHsb.h, newHsb.s, newHsb.b);
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(newColor);
    
    // Only update HSL, don't recalculate HSB from RGB
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b, lastHsl);
    setHsl(newHsl);
    
    onColorChange?.(newColor);
    // If not black, update lastHsb
    if (newHsb.b > 0) setLastHsb({ h: newHsb.h, s: newHsb.s });
  };

  // Update color from HSL values
  const updateColorFromHsl = (newHsl) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(newColor);
    
    // Only update HSB, don't recalculate HSL from RGB
    const newHsb = rgbToHsb(newRgb.r, newRgb.g, newRgb.b, lastHsb);
    setHsb(newHsb);
    
    onColorChange?.(newColor);
    // If not black/white, update lastHsl
    if (newHsl.l > 0 && newHsl.l < 100) setLastHsl({ h: newHsl.h, s: newHsl.s });
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

  // For HSB/HSL slider display, use last non-zero values if b/l is 0 (or 100 for HSL)
  const displayHsb = hsb.b === 0 ? { ...lastHsb, b: 0 } : hsb;
  const displayHsl = (hsl.l === 0 || hsl.l === 100) ? { ...lastHsl, l: hsl.l } : hsl;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: 380, // Thoda chota kiya (pehle 480 tha)
          width: '98%',
        }}
        ref={dialogRef}
      >
        <div className="modal-content" style={{ borderRadius: 16, padding: 8 }}>
          {showTitleBar && (
            <div className="modal-header py-2 px-3">
              <h5 className="modal-title">Color picker</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
          )}
          {!showTitleBar && (
            <button type="button" className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose} aria-label="Close"></button>
          )}
          <div className="modal-body p-3">
            {/* Bootstrap Nav Tabs */}
            <ul className="nav nav-tabs nav-fill mb-3" role="tablist" style={{ fontSize: '0.95rem' }}>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === 'rgb' ? 'active' : ''}`} onClick={() => setActiveTab('rgb')} type="button" role="tab">RGB</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === 'hsl' ? 'active' : ''}`} onClick={() => setActiveTab('hsl')} type="button" role="tab">HSL</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === 'hsb' ? 'active' : ''}`} onClick={() => setActiveTab('hsb')} type="button" role="tab">HSB</button>
              </li>
            </ul>
            <div className="p-0">
              <h6 className="mb-2" style={{ fontSize: '1rem' }}>{activeTab.toUpperCase()} Color Picker</h6>
              <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-light rounded">
                <div className="rounded border" style={{ width: 36, height: 36, backgroundColor: color, flexShrink: 0 }}></div>
                <input type="text" value={color} onChange={handleHexChange} className="form-control" placeholder="#000000" style={{ fontFamily: 'monospace', fontSize: '0.9rem', maxWidth: 120 }} />
              </div>
              {/* RGB Tab Content */}
              {activeTab === 'rgb' && (
                <div className="d-flex flex-column gap-2">
                  <div>
                    <label className="form-label fw-medium mb-1">Red</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="255" value={rgb.r} onChange={(e) => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="255" value={rgb.r} onChange={(e) => updateColorFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-medium mb-1">Green</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="255" value={rgb.g} onChange={(e) => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="255" value={rgb.g} onChange={(e) => updateColorFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-medium mb-1">Blue</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="255" value={rgb.b} onChange={(e) => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="255" value={rgb.b} onChange={(e) => updateColorFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                </div>
              )}
              {/* HSL Tab Content */}
              {activeTab === 'hsl' && (
                <div className="d-flex flex-column gap-2">
                  <div>
                    <label className="form-label fw-medium mb-1">Hue</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="360" value={displayHsl.h} onChange={(e) => updateColorFromHsl({ ...displayHsl, h: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="360" value={displayHsl.h} onChange={(e) => updateColorFromHsl({ ...displayHsl, h: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-medium mb-1">Saturation (%)</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="100" value={displayHsl.s} onChange={(e) => updateColorFromHsl({ ...displayHsl, s: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="100" value={displayHsl.s} onChange={(e) => updateColorFromHsl({ ...displayHsl, s: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-medium mb-1">Lightness (%)</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="100" value={displayHsl.l} onChange={(e) => updateColorFromHsl({ ...displayHsl, l: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="100" value={displayHsl.l} onChange={(e) => updateColorFromHsl({ ...displayHsl, l: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                </div>
              )}
              {/* HSB Tab Content */}
              {activeTab === 'hsb' && (
                <div className="d-flex flex-column gap-2">
                  <div>
                    <label className="form-label fw-medium mb-1">Hue</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="360" value={displayHsb.h} onChange={(e) => updateColorFromHsb({ ...displayHsb, h: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="360" value={displayHsb.h} onChange={(e) => updateColorFromHsb({ ...displayHsb, h: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-medium mb-1">Saturation (%)</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="100" value={displayHsb.s} onChange={(e) => updateColorFromHsb({ ...displayHsb, s: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="100" value={displayHsb.s} onChange={(e) => updateColorFromHsb({ ...displayHsb, s: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-medium mb-1">Brightness (%)</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="range" className="form-range flex-grow-1" min="0" max="100" value={displayHsb.b} onChange={(e) => updateColorFromHsb({ ...displayHsb, b: parseInt(e.target.value) })} />
                      <input type="number" className="form-control" style={{ width: 80 }} min="0" max="100" value={displayHsb.b} onChange={(e) => updateColorFromHsb({ ...displayHsb, b: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer py-2 px-3">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomColorPicker;
