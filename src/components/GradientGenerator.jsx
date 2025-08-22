
import React, { useState } from 'react';
import CodeOutput from './CodeOutput';
import GradientPicker from './GradientPicker';

const GradientGenerator = () => {
  const [gradientCode, setGradientCode] = useState('linear-gradient(90deg, #0d6efd 0%, #6f42c1 100%)');

  const gradientStyle = { background: gradientCode };

  return (
      <div className="container">
        <div className="card-body p-3">
        <h4 className="card-title mb-4">CSS Gradient Generator</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <GradientPicker onGradientChange={setGradientCode} />
          </div>
          <div className="col-lg-7">
            <div className="preview-area p-0 mb-3">
              <div id="gradient-preview" style={gradientStyle}></div>
            </div>
            <CodeOutput code={`background: ${gradientCode};`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
