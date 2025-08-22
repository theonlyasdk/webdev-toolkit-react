
import React, { useState, useEffect } from 'react';

const ColorConverter = () => {
  const [color, setColor] = useState('#0d6efd');
  const [hex, setHex] = useState('');
  const [rgb, setRgb] = useState('');
  const [hsl, setHsl] = useState('');

  useEffect(() => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.color = color;
      document.body.appendChild(tempDiv);
      const computedColor = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      const [r, g, b] = computedColor.match(/\d+/g).map(Number);
            
      const toHex = c => c.toString(16).padStart(2, '0');
      setHex(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
      setRgb(`rgb(${r}, ${g}, ${b})`);

      let h, s, l;
      const r_ = r / 255, g_ = g / 255, b_ = b / 255;
      const max = Math.max(r_, g_, b_), min = Math.min(r_, g_, b_);
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r_: h = (g_ - b_) / d + (g_ < b_ ? 6 : 0); break;
          case g_: h = (b_ - r_) / d + 2; break;
          case b_: h = (r_ - g_) / d + 4; break;
        }
        h /= 6;
      }
      setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
    } catch (e) {
      console.error("Invalid color", e);
    }
  }, [color]);
    
  const CopyInput = ({ label, id, value }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    };
    return (
      <div>
        <label className="form-label">{label}</label>
        <div className="input-group">
          <input type="text" className="form-control" id={id} value={value} readOnly />
          <button className="btn btn-outline-secondary" onClick={handleCopy}>
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">Color Converter</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="color-input-picker" className="form-label">Input Color</label>
                <input type="color" className="form-control form-control-color w-100" id="color-input-picker" value={color} onChange={e => setColor(e.target.value)} />
              </div>
              <input type="text" className="form-control" id="color-input-text" value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="d-flex flex-column gap-3">
              <CopyInput label="HEX" id="color-hex" value={hex} />
              <CopyInput label="RGB" id="color-rgb" value={rgb} />
              <CopyInput label="HSL" id="color-hsl" value={hsl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
