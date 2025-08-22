
import React, { useState } from 'react';
import RangeInput from './RangeInput';
import CodeOutput from './CodeOutput';

const BorderRadiusGenerator = () => {
  const [allCorners, setAllCorners] = useState(12);
  const [topLeft, setTopLeft] = useState(12);
  const [topRight, setTopRight] = useState(12);
  const [bottomRight, setBottomRight] = useState(12);
  const [bottomLeft, setBottomLeft] = useState(12);
    
  const resetAllCorners = () => {
    setAllCorners(12);
    setTopLeft(12);
    setTopRight(12);
    setBottomRight(12);
    setBottomLeft(12);
  };
  const resetTopLeft = () => setTopLeft(12);
  const resetTopRight = () => setTopRight(12);
  const resetBottomRight = () => setBottomRight(12);
  const resetBottomLeft = () => setBottomLeft(12);

  const handleAllCornersChange = (e) => {
    const value = e.target.value;
    setAllCorners(value);
    setTopLeft(value);
    setTopRight(value);
    setBottomRight(value);
    setBottomLeft(value);
  };

  const borderRadiusCode = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  const borderRadiusStyle = { borderRadius: borderRadiusCode };

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">CSS Border Radius Generator</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <RangeInput label="All Corners" id="br-all" value={allCorners} min="0" max="100" unit="px" onChange={handleAllCornersChange} onReset={resetAllCorners} />
              <RangeInput label="Top Left" id="br-tl" value={topLeft} min="0" max="100" unit="px" onChange={e => setTopLeft(e.target.value)} onReset={resetTopLeft} />
              <RangeInput label="Top Right" id="br-tr" value={topRight} min="0" max="100" unit="px" onChange={e => setTopRight(e.target.value)} onReset={resetTopRight} />
              <RangeInput label="Bottom Right" id="br-br" value={bottomRight} min="0" max="100" unit="px" onChange={e => setBottomRight(e.target.value)} onReset={resetBottomRight} />
              <RangeInput label="Bottom Left" id="br-bl" value={bottomLeft} min="0" max="100" unit="px" onChange={e => setBottomLeft(e.target.value)} onReset={resetBottomLeft} />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-area mb-3">
              <div id="border-radius-preview" style={borderRadiusStyle}></div>
            </div>
            <CodeOutput code={`border-radius: ${borderRadiusCode};`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderRadiusGenerator;
