
import React, { useState } from 'react';
import RangeInput from './RangeInput';
import CodeOutput from './CodeOutput';

const TextShadowGenerator = () => {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [blurRadius, setBlurRadius] = useState(2);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.4);

  const resetOffsetX = () => setOffsetX(4);
  const resetOffsetY = () => setOffsetY(4);
  const resetBlurRadius = () => setBlurRadius(2);
  const resetShadowOpacity = () => setShadowOpacity(0.4);

  const hexToRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const textShadowCode = `${offsetX}px ${offsetY}px ${blurRadius}px ${hexToRgba(shadowColor, shadowOpacity)}`;
  const textShadowStyle = { textShadow: textShadowCode };

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">CSS Text Shadow Generator</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <RangeInput label="Horizontal Offset" id="textOffsetX" value={offsetX} min="-50" max="50" unit="px" onChange={(e) => setOffsetX(e.target.value)} onReset={resetOffsetX} />
              <RangeInput label="Vertical Offset" id="textOffsetY" value={offsetY} min="-50" max="50" unit="px" onChange={(e) => setOffsetY(e.target.value)} onReset={resetOffsetY} />
              <RangeInput label="Blur Radius" id="textBlurRadius" value={blurRadius} min="0" max="50" unit="px" onChange={(e) => setBlurRadius(e.target.value)} onReset={resetBlurRadius} />
              <div>
                <label htmlFor="textShadowColor" className="form-label">Shadow Color</label>
                <input type="color" className="form-control form-control-color w-100" id="textShadowColor" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} />
              </div>
              <RangeInput label="Shadow Opacity" id="textShadowOpacity" value={shadowOpacity} min="0" max="1" step="0.01" unit="" onChange={(e) => setShadowOpacity(e.target.value)} onReset={resetShadowOpacity} />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-area mb-3">
              <div id="text-shadow-preview" style={textShadowStyle}>Text</div>
            </div>
            <CodeOutput code={`text-shadow: ${textShadowCode};`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextShadowGenerator;
