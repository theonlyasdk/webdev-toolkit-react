
import React, { useState } from 'react';
import RangeInput from './RangeInput';
import CodeOutput from './CodeOutput';

const TransformGenerator = () => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const resetScale = () => setScale(1);
  const resetRotate = () => setRotate(0);
  const resetTranslateX = () => setTranslateX(0);
  const resetTranslateY = () => setTranslateY(0);
  const resetSkewX = () => setSkewX(0);
  const resetSkewY = () => setSkewY(0);

  const transformCode = `scale(${scale}) rotate(${rotate}deg) translateX(${translateX}px) translateY(${translateY}px) skewX(${skewX}deg) skewY(${skewY}deg)`;
  const transformStyle = { transform: transformCode };

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">CSS Transform Generator</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <RangeInput label="Scale" id="tf-scale" value={scale} min="0.1" max="2" step="0.05" unit="" onChange={e => setScale(e.target.value)} onReset={resetScale} />
              <RangeInput label="Rotate" id="tf-rotate" value={rotate} min="0" max="360" unit="deg" onChange={e => setRotate(e.target.value)} onReset={resetRotate} />
              <RangeInput label="Translate X" id="tf-translateX" value={translateX} min="-100" max="100" unit="px" onChange={e => setTranslateX(e.target.value)} onReset={resetTranslateX} />
              <RangeInput label="Translate Y" id="tf-translateY" value={translateY} min="-100" max="100" unit="px" onChange={e => setTranslateY(e.target.value)} onReset={resetTranslateY} />
              <RangeInput label="Skew X" id="tf-skewX" value={skewX} min="-45" max="45" unit="deg" onChange={e => setSkewX(e.target.value)} onReset={resetSkewX} />
              <RangeInput label="Skew Y" id="tf-skewY" value={skewY} min="-45" max="45" unit="deg" onChange={e => setSkewY(e.target.value)} onReset={resetSkewY} />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-area mb-3">
              <div id="transform-preview" style={transformStyle}></div>
            </div>
            <CodeOutput code={`transform: ${transformCode};`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformGenerator;
