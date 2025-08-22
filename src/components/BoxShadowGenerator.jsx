
import React, { useState } from 'react';
import RangeInput from './RangeInput';
import CodeOutput from './CodeOutput';

const BoxShadowGenerator = () => {
  const [offsetX, setOffsetX] = useState(10);
  const [offsetY, setOffsetY] = useState(10);
  const [blurRadius, setBlurRadius] = useState(5);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.5);
  const [inset, setInset] = useState(false);

  const resetOffsetX = () => setOffsetX(10);
  const resetOffsetY = () => setOffsetY(10);
  const resetBlurRadius = () => setBlurRadius(5);
  const resetSpreadRadius = () => setSpreadRadius(0);
  const resetShadowOpacity = () => setShadowOpacity(0.5);

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

  const boxShadowCode = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${hexToRgba(shadowColor, shadowOpacity)}`.trim();
  const boxShadowStyle = { boxShadow: boxShadowCode };

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">CSS Box Shadow Generator</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <RangeInput label="Horizontal Offset" id="offsetX" value={offsetX} min="-50" max="50" unit="px" onChange={(e) => setOffsetX(e.target.value)} onReset={resetOffsetX} />
              <RangeInput label="Vertical Offset" id="offsetY" value={offsetY} min="-50" max="50" unit="px" onChange={(e) => setOffsetY(e.target.value)} onReset={resetOffsetY} />
              <RangeInput label="Blur Radius" id="blurRadius" value={blurRadius} min="0" max="100" unit="px" onChange={(e) => setBlurRadius(e.target.value)} onReset={resetBlurRadius} />
              <RangeInput label="Spread Radius" id="spreadRadius" value={spreadRadius} min="-50" max="50" unit="px" onChange={(e) => setSpreadRadius(e.target.value)} onReset={resetSpreadRadius} />
              <div>
                <label htmlFor="shadowColor" className="form-label">Shadow Color</label>
                <input type="color" className="form-control form-control-color w-100" id="shadowColor" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} />
              </div>
              <RangeInput label="Shadow Opacity" id="shadowOpacity" value={shadowOpacity} min="0" max="1" step="0.01" unit="" onChange={(e) => setShadowOpacity(e.target.value)} onReset={resetShadowOpacity} />
              <div className="form-check form-switch mt-2">
                <input className="form-check-input" type="checkbox" role="switch" id="insetSwitch" checked={inset} onChange={(e) => setInset(e.target.checked)} />
                <label className="form-check-label" htmlFor="insetSwitch">Inset Shadow</label>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-area mb-3">
              <div id="box-shadow-preview" style={boxShadowStyle}></div>
            </div>
            <CodeOutput code={`box-shadow: ${boxShadowCode};`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxShadowGenerator;
